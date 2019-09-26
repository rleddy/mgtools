var request = require('request')
var fs = require('fs')

//mocktarget.apigee.net


var schedule = [[10,90]]

if ( process.argv.length > 2 ) {
  var jsched = process.argv[2]
  schedule = JSON.parse(jsched)
}


var series = ''
if ( process.argv.length > 3 ) {
  series = process.argv[3]
}


var gInterval = 0;
var gReqDelta = null;
//
var gDataEntries = {
  '200' : 0,
  '403' : 0
}


function dumpData() {
  var fileName = __dirname + `/testEMG${series}${Date.now()}.dat`
  fs.writeFile(fileName,JSON.stringify(gDataEntries,null,2),(err) => {
    console.log(fileName)
    process.exit(0)
  })
}



function setReqIntervals() {
  if ( !schedule.length ) {   // read from the schedule...or quit
    dumpData()
    return(100000) // make it long so that this stops first. (hack!)
  } else {
    //
    var tPair = schedule.shift()  // read from the schedule... each pair = (delta time,length of run)
    //console.log(tPair)
    //
    gInterval = tPair[0]
    var timeout = tPair[1]*1000
    sendReqNow()   // start of a section... on HTTP callbacks, 'nextTime' will be called.
    return(timeout)
  }
}

// ------- ------- ------- ------- ------- -------
// ------- ------- ------- ------- ------- -------


// ------- ------- ------- ------- ------- -------
// ------- ------- ------- ------- ------- -------


function nextTime() {  // called when the request returns...
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
  if ( interval > 0 ) {
    setTimeout(sendReqNow,interval)
  }
}


//  resets the schedule... according to the length of run that in the schedule second parameter.
function nextSection() {
  var d = new Date()
  //console.log("nextSection: ",d.toUTCString())
  setTimeout(nextSection,setReqIntervals())  // intentional side effect
}

// ------- ------- ------- ------- -------








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



var apikeyrequest = `https://${org}-${env}.apigee.net/edgemicro-auth/token`;

console.log(apikeyrequest)

var options = {
    headers : {
        "Content-Type"  :  "application/json"
    },
    'auth': {
        'user': user,
        'pass': password
      }
}


const formData = {
  "client_id"     : appkey, 
  "client_secret" : appSecret, 
  "grant_type"    : 'client_credentials',
};


var gOptions = null



function sendReqNow() {

  request.get("http://localhost:8000/edgemicro_trialbybakery/", gOptions, (e, r, data) => {
    //console.log(e)
    //if ( r ) console.log(r.statusCode)
    var code = ''  + (( r ) ? (r.statusCode) : 0)
    if ( gDataEntries[code] !== undefined ) {
        gDataEntries[code]++
    }
    //
    nextTime()
  })

}


// INITIALIZE ON RETURN FROM POST
request.post({
    "uri": apikeyrequest,
    "method" : "POST",
    "json": formData
  }, (e, r, data) => {
    if ( e ) {
      console.log(e)
    } else {
      console.log(data.token)
      console.dir(data)
      //
      var options = {
        headers : {
            "Authorization"  :  "Bearer " + data.token
        }
      }
      //  Initialize...
      gOptions = options;
      nextSection()  // don't just send, make sure it is on the schedule.
  }
})


function tokenUpdate() {
  request.post({
      "uri": apikeyrequest,
      "method" : "POST",
      "json": formData
  }, (e, r, data) => {
      if ( e ) {
        console.log(e)
      } else {
        console.log(data.token)
        console.dir(data)
        //
        var options = {
          headers : {
              "Authorization"  :  "Bearer " + data.token
          }
        }
        //  Initialize...
        gOptions = options;
    }
  })
}

setInterval(tokenUpdate,60000)





