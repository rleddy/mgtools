


var fs = require('fs')

var stubdoc = fs.readFileSync('tools/mcore.json').toString();
stubdoc = JSON.parse(stubdoc)

var stubber = stubdoc.stubber;
delete stubdoc.stubber;

var outdoc = {}
for ( var k in stubdoc ) {
    var entry = stubdoc[k];
    var outdockey = stubber + k
    outdoc[outdockey] = entry.map(req => {
        return(stubber + req)
    })
}


console.dir(outdoc,{level : 3})
