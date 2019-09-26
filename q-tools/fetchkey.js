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
//
var apikeyrequest = `https://api.enterprise.apigee.com/v1/organizations/${org}/developers/${devAcct}/apps/${apiDeveloperApp}`;

var options = {
    headers : {
        "Content-Type"  :  "application/json"
    },
    'auth': {
        'user': user,
        'pass': password
      }
}

function getCreds() {

  request.get(apikeyrequest,options, (e, r, data) => {
    if ( e ) console.log(e)
    //console.log(r.statusCode)
    //console.log(data)
    data = data.toString()
    if ( data.indexOf('DoesNotExist') > 0 ) {
      setTimeout(getCreds,500)
      console.error("-")
      console.error(data)
    } else {
      data = JSON.parse(data)
      console.log( `${data.credentials[0].consumerKey} ${data.credentials[0].consumerSecret}` )
    }


  })

}



getCreds()