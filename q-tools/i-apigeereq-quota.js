var request = require('request')
var fs = require('fs')

//mocktarget.apigee.net

var userData = fs.readFileSync(__dirname + '/usrdata.json','ascii').toString()
userData = JSON.parse(userData)

var org = userData.org
var env = userData.env
var devAcct = userData.devAcct
var apiDeveloperApp = userData.apiDeveloperApp
var password = userData.password
var user = userData.user

var appkey = userData.key
var appSecret = userData.secret
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
*/


console.log(process.argv)

// delta,seconds

var schedule = [[1,5], [750,120]]

var gInterval = 0;
var gReqDelta = null;
//
var gDataEntries = []


function dumpData() {
  //
  fs.writeFile(__dirname + `/testData${Date.now()}.dat`,JSON.stringify(gDataEntries,null,2),(err) => {
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
    console.log(tPair)
    //
    gInterval = tPair[0]
    var timeout = tPair[1]*1000
    if ( gReqDelta !== null ) {
      clearInterval(gReqDelta)
    }
    gReqDelta = setInterval(sendReqNow,gInterval)
    return(timeout)
  }
}


var apikeyrequest = `https://edgemicroservices.apigee.net/edgemicro/quotas/organization/${org}/environment/${env}/v2/quotas/apply`;

console.log(apikeyrequest)

var options = {
  "headers" : {
      "Content-Type"  :  "application/json",
      "x-DNA-Api-Key" : appkey
  },

  "json" : {
    'allow' : 100,
    'identifier' : "BakeryApp",
    'interval' : 1,
    'quotaType' : "flexi",
    'timeUnit' : "minute",
    'weight' : 1
  },
  "uri" : apikeyrequest
};



// ------- ------- ------- ------- ------- -------

function sendReqNow() {
  request.post(options, (e, r, data) => {
    if ( e ) {
      console.log(e)
    } else {
      gDataEntries.push(data)
    }
  })
}

// ------- ------- ------- ------- -------


function nextSection() {
  var d = new Date()
  console.log("nextSection: ",d.toUTCString())

  setTimeout(nextSection,setReqIntervals())
}

// ------- ------- ------- ------- -------

nextSection()
