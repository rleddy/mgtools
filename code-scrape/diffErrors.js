/* eslint-disable no-multiple-empty-lines */

const { spawn } = require('child_process')
const { promisify } = require('util')

/*
function  diffReport() {
    if ( qreport.length > 0 ) {

    }

    var oldErrorCount = readErrorCount()
    var diffOutput = {
        'errors' : (errorCount - oldErrorCount)
    }
}
*/

async function getQuality(dir) {
    return new Promise( (resolve,reject) => {
        var qreport = ""
        var jshint = spawn('jshint', [dir])
        //
        jshint.stdout.on('data', (data) => {
            qreport = data.toString()
          });
        //
        jshint.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            reject('ERROR')
          });
        //
        jshint.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            resolve(qreport)
          });
    })
}


function matchCounter(counterLine) {
    //
    return /^\d+\serrors$/.test(counterLine)
}



// 
var dirList = process.argv[2];

if ( dirList !== undefined ) {

    dirList = JSON.parse(dirList)

    var loadQuality = (dirs) => {
        var qualPromise = dirs.map(async (dir) => {
            return(await getQuality(dir))
        })

        return(qualPromise)
    }

    var promises = loadQuality(dirList);

    Promise.all(promises).then(reports => {
        //
        var totalErrors = 0
        reports.forEach(report => {
            var lines = report.split('\n')
            var k = lines.length
            var counterLine = ""
            do {
                k--
                if ( k < 0 ) break
                counterLine = lines[k]
            } while ( !matchCounter(counterLine) )
            //
            if ( k >= 0 ) {
                console.log(counterLine)
                var cc = parseInt(counterLine)
                totalErrors += cc
            }
        })

        console.log(totalErrors)
        //
    }).catch(err => {
        console.error(err)
    })

}
