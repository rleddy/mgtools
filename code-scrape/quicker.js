


const fs = require('fs')
const cp = require('child_process');



var data = fs.readFileSync('./tools/dirs.txt').toString().trim();

var dirs = data.split('\n')

console.log(dirs);

dirs.forEach(dir => {
    cp.spawn('bash',['quick.sh',dir])
})
