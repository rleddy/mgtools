/****************************************************************************
 The MIT License (MIT)

 Copyright (c) 2013 Apigee Corporation

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
'use strict';

var assert = require('assert');
var Quota = require('./quota');
var _ = require('underscore');
var debug = require('debug')('quota');


var callcount1 = 0
var callcount2 = 0

/*
 * options.bufferSize (Number) optional, use a memory buffer up to bufferSize to hold quota elements
 * options.bufferTimeout (Number) optional, flush the buffer every Number ms (default: 300)
 */

// todo: update clockOffset & bucket expires occasionally to account for clock drift?
// todo: after failure, only fail locally (no flush to remote) until end of time bucket?

var create = function(spi, options) {
  return new MemoryBuffer(spi, options);
};
module.exports.create = create;

function MemoryBuffer(spi, options) {
  this.spi = spi;
  this.options = options;
  this.buckets = {};
  this.clockOffset = undefined;

  assert(options.timeInterval);
  if (options.startTime) {
    assert.equal(typeof options.startTime, 'number');
  }

  var self = this;
  let intervalCount = 0;
  self.bucketTimer = setInterval(function() {
    if(options.timeUnit === '30days'){
      if(++intervalCount === options.interval){
        intervalCount=0;
        trimTokens(self);
      }
    } else {
      trimTokens(self);
    }  }, options.timeInterval);

  if (options.bufferTimeout) {
    self.flushTimer = setInterval(function() {
      self.flushBuffer();
    }, options.bufferTimeout);
  }
}

MemoryBuffer.prototype.destroy = function() {
  clearTimeout(this.bucketTimer);
  clearTimeout(this.flushTimer);
  this.spi.destroy();
};

MemoryBuffer.prototype.apply = function(options, cb) {

  var bucket = this.buckets[options.identifier];
  var now = _.now();

  if (!bucket) {
    //console.log("MAKING A NEW BUCKET")
    bucket = new Bucket(now, options, this);
    this.buckets[options.identifier] = bucket;
  }
  bucket.apply(now, options, cb);
};

MemoryBuffer.prototype.flushBuffer = function() {
  _.each(this.buckets, function(bucket) {
    bucket.flushBucket();
  });
};

/*
 * Quotas always obey their expiration times (which prevents us from having to register a huge
 * number of individual timeouts) but we still want to periodically clean them up to prevent memory
 * issues. This job runs once per time interval (minute, hour, day, or week) and removes expired tokens.
 */
function trimTokens(self) {
  var now = _.now();

  console.log("-FIND TRIM TOKEN-")
  console.log(self.buckets)
  for ( var b in Object.keys(self.buckets) ) {
    console.log(b)
    console.log(now > b.expires)
    //if (now > b.expires) {
      delete self.buckets.b;
    //}
  }
  self.buckets = {}
  console.log("trimTokens--" + Object.keys(self.buckets))
}

function Bucket(time, options, owner) {
  this.options = options;
  this.owner = owner;
  this.reset(time);
}

Bucket.prototype.reset = function(time) {
  debug('bucket reset:', this.options.identifier);
  this.count = 0;
  this.resetAt = time;
  this.expires = undefined;
  this.remoteCount = 0;
  this.remoteExpires = undefined;
  this.flushing = false;
};

Bucket.prototype.calculateExpiration = function() {
  var time = this.resetAt + (this.owner.clockOffset || 0);

  var startTime = this.owner.options.startTime;
  var timeInterval = this.owner.options.timeInterval;

  if (startTime) {
    // "calendar" start quota -- calculate time until the end of the bucket
    var remaining = (time - startTime) % timeInterval;
    this.expires = time + timeInterval - remaining;

  } else {

    if ('month' === this.options.timeUnit) {

      var date = new Date(time);
      return new Date(date.getFullYear(), date.getMonth() + 1, 1) - 1 + this.owner.clockOffset; // last ms of this month

    } else {

      // Default quota type -- start counting from now
      this.expires = time + timeInterval;
    }
  }
};

Bucket.prototype.apply = function(time, options, cb) {
  debug('apply: ', options.weight);
  var now = _.now();
  if (time > this.expires) {
    this.reset(now); // Quota bucket has expired. The timer also runs but only periodically
  }

  this.count += options.weight; // 

  var allow = options.allow || this.options.allow;

  var count = this.count + this.remoteCount;

  console.log(`{"calls" : ${callcount1++}, "pid" : ${process.pid}, Bucket.prototype.apply": { "count" : ${count}, "bucket-count" : ${this.count}, "remoteCount" : ${this.remoteCount}, "allow" : ${allow} } }`)

  if (!this.expiryTime) { this.calculateExpiration(); }
  var result = {
    allowed: allow,
    used: count,
    isAllowed: (count <= allow),
    expiryTime: this.expires - now
  };

  cb(null, result);

  if (!this.remoteExpires || (this.count % this.owner.options.bufferSize === 0)) {
    this.flushBucket();
  }
};

Bucket.prototype.flushBucket = function(cb) {
  if (this.flushing || (!this.count && this.remoteExpires)) { return cb ? cb() : null; }
  this.flushing = true

  debug('flushing bucket: ', this.options.identifier);
  var localExpires = this.expires;
  var remoteExpires = this.remoteExpires;
  var options = {
    identifier: this.options.identifier,
    weight: this.count
  };
  var self = this;
  self.owner.spi.apply(options, function(err, reply) {
    self.flushing = false;
    if (err) { return (cb) ? cb(err) : console.error(err); }

    // sync time with remote if never been synced
    if (self.owner.clockOffset === undefined) {
      if (!reply.timestamp) {
        debug('Warning: Quota spi not reporting timestamp. Buffer assuming spi timestamp is identical.');
      }
      var offset = reply.timestamp ? reply.timestamp - _.now() : 0;
      self.owner.clockOffset = offset;  // should be < 0 most of the time
      debug('clockOffset:', offset);
    }

    // asking if reset was called during the query...
    // also seeing if the remoteExpires changed during the query --> from reset or (?)
    var sameTimeBucket = (self.expires === localExpires) &&                        // same local time bucket?
                         (!remoteExpires || remoteExpires === self.remoteExpires); // same remote time bucket?

    console.log(`sameTimeBucketL ${sameTimeBucket} remote-expires: ${self.remoteExpires}, ${self.expires} === ${localExpires}`)
    if (!sameTimeBucket) {
      debug('new time bucket');
      return cb ? cb() : null;
    }

    self.remoteExpires = reply.expiryTime;    // delta from remote -->  body.expiryTime = body.expiryTime - body.timestamp; // remote delta
    self.remoteCount = reply.used;   // added to the count later when filtering
    self.count -= options.weight; // subtract applied value  (the count that this passed to the remote quota)

    console.log(`{"calls" : ${callcount2++},  "pid" : ${process.pid}, "Bucket-flushBucket-reply": { "expiryTime" : ${reply.expiryTime}  "used": ${reply.used}  "count": ${self.count} } `)

    // if it wasn't set because offset wasn't available, calc expiration
    if (!self.expires) { self.calculateExpiration(); }

    if (cb) { cb(); }
  });
};