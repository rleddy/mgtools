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


request.post({
    "uri": apikeyrequest,
    "method" : "POST",
    "json": formData
  }, (e, r, data) => {
    if ( e ) {
      console.log(e)
    } else {
      console.log(data.token)

      var options = {
        headers : {
            "Authorization"  :  "Bearer " + data.token
        }
    }
    //
    //
    for ( var i = 0; i < 10; i++ ) {
      request.get("http://localhost:8000/edgemicro_trialbybakery/",options, (e, r, data) => {
          console.log(e)
          if ( r ) console.log(r.statusCode)
          console.log(data)
        })
        //
    }

    
  }
})
