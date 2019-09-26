var request = require('request')
var fs = require('fs')

//mocktarget.apigee.net
/*
node apigeereq-quota.js  '[[1,10], [800,120]]' 'A' > filenames.txt &
node apigeereq-quota.js  '[[1,10], ["random",120]]' 'B' >> filenames.txt  &
*/

var userData = fs.readFileSync(__dirname + '/usrdata.json','ascii').toString()
userData = JSON.parse(userData)

var org = userData.org
var env = userData.env
var devAcct = userData.devAcct
var apiDeveloperApp = userData.apiDeveloperApp
var password = userData.password
var user = userData.user
var gTimeUnit = userData.quotaTimeUnit
var gQuotaInterval = userData.quotaInterval
var gAllowed = userData.quota
//
var appkey = userData.key
var appSecret = userData.secret

var gWeight = userData.weight
var gUsingRandomeVariance = false
var gWeightDeviation = 0

if ( gWeight.indexOf(':') > 0 ) {
  var parts = gWeight.trim().split(':')
  gWeight = parseInt(parts[0])
  if ( parts[1] === 'random' ) {
    gUsingRandomeVariance = true
    gWeightDeviation = parseInt(parts[2])
  }
}

//
// cli/edgemicro-token get -o leddyr-eval -e test -i d0wz5pVBoUZwzqRUEs3A9EsuAmU2of2h  -s FplPyEBjA8ev8T57
//
/*
curl -i -X POST "http://org-env.apigee.net/edgemicro-auth/token" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "your consumer key",
    "client_secret": "your consumer secret",
    "grant_type": "client_credentials"
  }'



curl -vX POST \
  http://apigee-internal-test.e2e.apigee.net/edgemicro/quotas/organization/leddyr-eval/environment/test \
  -H 'Authorization: Basic dGVzdDp0ZXN0dmFsdWU=' \
  -H 'Content-Type: application/json' \
  -d '{"identifier":"testquota","allow":"2","interval":"1","timeUnit":"minute","weight":"1"}'


*/


// node tools/apigeereq-quota.js  "[[1,10], ['random',120]]"

//console.log(process.argv)

// delta,seconds

var schedule = [[1,10], [750,120]]
var gQWindowTyp = 'flexi'

//console.log(process.argv)

if ( process.argv.length > 2 ) {
  gQWindowTyp = process.argv[2]
}


if ( process.argv.length > 3 ) {
  var jsched = process.argv[3]
  schedule = JSON.parse(jsched)
}


var series = ''
if ( process.argv.length > 4 ) {
  series = process.argv[4]
}


var gInterval = 0;
var gReqDelta = null;
//
var gDataEntries = []


function dumpData() {
  var fileName = __dirname + `/dat-${gQWindowTyp}/testData${series}${Date.now()}.dat`
  fs.writeFile(fileName,JSON.stringify(gDataEntries,null,2),(err) => {
    console.log(fileName)
    process.exit(0)
  })
}


function setReqIntervals() {
  if ( !schedule.length ) {
    dumpData()
    return(100000) // make it long so that this stops first. (hack!)
  } else {
    //
    var tPair = schedule.shift()
    //console.log(tPair)
    //
    gInterval = tPair[0]
    var timeout = tPair[1]*1000
    if ( gReqDelta !== null ) {
      clearInterval(gReqDelta)
    }
    sendReqNow()
    return(timeout)
  }
}


// https://api.enterprise.apigee.com/v1/organizations/leddyr-eval/apiproducts/BakeryApp/attributes

// e2e.apigee.net

var apikeyrequest = `https://edgemicroservices.apigee.net/edgemicro/quotas/organization/${org}/environment/${env}/v2/quotas/apply`;
//var apikeyrequest = `http://apigee-internal-test.e2e.apigee.net/edgemicro/quotas/organization/${org}/environment/${env}`;
/*


curl -vX POST \
  http://apigee-internal-test.e2e.apigee.net/edgemicro/quotas/organization/${org}/environment/${env} \
  -H 'Authorization: Basic dGVzdDp0ZXN0dmFsdWU=' \
  -H 'Content-Type: application/json' \
  -d '{"identifier":"testquota","allow":"2","interval":"1","timeUnit":"minute","weight":"1"}'

curl --include https://b2b-test.efidelity.com/fidelity-np-dev/edgemicro-auth-pi/verifyApiKey -H 'Content-Type: application/json' -d '{"apiKey": "6CXttLrR2Oud32HCl0v9rB0GAYCVGBhu"}'


curl --include https://leddyr-eval-test.apigee.net/edgemicro-auth/verifyApiKey' -H 'Content-Type: application/json' -d '{"apiKey": "d0wz5pVBoUZwzqRUEs3A9EsuAmU2of2h"}'
*/

//console.log(apikeyrequest)

var options = {
  "headers" : {
      "Content-Type"  :  "application/json",
      "x-DNA-Api-Key" : appkey
  },

  "json" : {
    'allow' : gAllowed,
    'interval' : gQuotaInterval,
    'timeUnit' : gTimeUnit,
    'identifier' : apiDeveloperApp, // "BakeryApp",
    //'quotaType' : "flexi",
    'quotaType' : gQWindowTyp,
    'weight' : gWeight
  },
  "uri" : apikeyrequest
};


// ------- ------- ------- ------- ------- -------

function sendReqNow() {

  if ( gUsingRandomeVariance ) {
    //
    var randomDeviate = parseInt('' + Math.floor(Math.random()*gWeightDeviation) )
    //
    var chooseSign = Math.random()
    if ( chooseSign < 0.5 ) {
      randomDeviate = -randomDeviate
    }
    options.json.weight = gWeight + randomDeviate
    //
   }

  request.post(options, (e, r, data) => {
    if ( e ) {
      //console.log(e)
    } else {
      //console.log(data)
      gDataEntries.push(data)
    }
    nextTime()
  })
}

// ------- ------- ------- ------- -------

function nextTime() {
  var d = new Date()
  //console.log("nextSection: ",d.toUTCString())

  var interval = gInterval
  if ( typeof interval === "string" ) {
    if ( interval === "random" ) {
      interval = Math.floor(Math.random()*1000)
    } else {
      interval = parseInt(interval)
    }
  }
  if ( gReqDelta !== null ) {
    clearInterval(gReqDelta)
    gReqDelta = null;
  }
  if ( interval > 0 ) {
    gReqDelta = setTimeout(sendReqNow,interval)
  }
}

function nextSection() {
  var d = new Date()
  //console.log("nextSection: ",d.toUTCString())

  setTimeout(nextSection,setReqIntervals())
}

// ------- ------- ------- ------- -------

nextSection()



/*

{
  "appFamily": "default",
  "appId": "6faf3287-31cf-4770-b3bb-be48b99aca33",
  "attributes": [
    {
      "name": "DisplayName",
      "value": "BakeryApp"
    },
    {
      "name": "Notes",
      "value": ""
    }
  ],
  "callbackUrl": "",
  "createdAt": 1558458361622,
  "createdBy": "leddyr@google.com",
  "credentials": [
    {
      "apiProducts": [
        {
          "apiproduct": "bakerytrial",
          "status": "approved"
        }
      ],
      "attributes": [],
      "consumerKey": "d0wz5pVBoUZwzqRUEs3A9EsuAmU2of2h",
      "consumerSecret": "FplPyEBjA8ev8T57",
      "expiresAt": -1,
      "issuedAt": 1558458362419,
      "scopes": [],
      "status": "approved"
    }
  ],
  "developerId": "ec7e8e62-a98e-4b7e-9f46-ce95c5d68e00",
  "lastModifiedAt": 1558458361622,
  "lastModifiedBy": "leddyr@google.com",
  "name": "BakeryApp",
  "scopes": [],
  "status": "approved"
}


*/