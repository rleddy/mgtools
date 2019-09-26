
var cc = require('../lib/utils/formatting')

const fieldFormat = "(%s)"
var fieldSet = ['dog', 'cat']
const sep = '<>'

var myC = new cc.FieldLineFormatter(fieldFormat,fieldSet,sep)

myC.setValue('dog','fluffy')
myC.setValue('cat','woofer')

console.log(myC.outputLine())

var myC2 = myC.clone()
myC2.setValue('cat','growler')
console.log(myC2.outputLine())


const fieldFormat2 = "[%k] :: '%s'"
var fieldSet2 = ['lion', 'king']
const sep2 = '..>'

var myCA = new cc.FieldLineFormatter(fieldFormat2,fieldSet2,sep2,true)

myCA.setValue('lion','fluffy')
myCA.setValue('king','woofer')

console.log(myCA.outputLine())

var myCA2 = myCA.clone()
myCA2.setValue('lion','growler')
console.log(myCA2.outputLine())
console.log(myCA.outputLine())
myCA2.unsetValue('lion')
console.log(myCA2.outputLine())



//

/*
function formatError(eObj,separator) {
    if ( typeof eObj === 'object' ) {
        if ( eObj.constructor !== undefined ) {
            if ( eObj.constructor.name === 'TypeError' ) {
                var b = eObj.stack.split('\n').map(line => line.trim())
                if ( separator === undefined ) {
                    separator = ";;;  "
                }
                return b.join(separator)
            }
        }
    } 
    return(false)
}


function c4(msg) {
    try {
        var b = null;
        b.p = "knee"
    } catch(e) {
        console.log(formatError(e,' :;: '))
        console.log('--------------------')
        console.log(formatError(e))
    }
}

function c3(msg) {
    c4(msg)
}

function c2(msg) {
    c3(msg)
}

function c1(msg) {
    c2(msg)
}



c1("this is a test")

*/