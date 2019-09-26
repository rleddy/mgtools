var fs = require('fs')
var infile = process.argv[2]

var data = JSON.parse(fs.readFileSync(infile,'ascii').toString())

var start = data[0].timestamp
var last = data[data.length - 1].timestamp

var delta = 100  // milliseconds  .. (1/100) the of a second.

var n = Math.floor((last - start)/delta) + 1

// just take the stuff we want
var nums = data.map(datum => {
    return [datum.timestamp - start, datum.available]
})


//console.log(n)

var output = Array(n).fill(-1)
var countEntries = Array(n).fill(0)
//
nums.forEach(element => {
    //
    var ts = element[0]     // the time offset of the element
    var val = element[1]    // the available quota at the time.
    var ii = Math.floor(ts/delta)   // get the index as an integer (time_offset/DELTA)

    if ( ii >= 0 && ii < n ) {
        if ( output[ii] > -1 ) {  // an element is already there.
            countEntries[ii]++
            var nn = countEntries[ii]
            output[ii] = nn*(val + output[ii])/(nn+1) // average it out.
        } else {
            output[ii] = val
        }
    }
//
});

nums = output
var N = nums.length

//console.log(n)
//console.log(nums)

var i = 0
while ( i < N ) {
    if ( nums[i] === -1 ) {
        var j = i
        while ( nums[i] === -1 && i < N ) {
            i++
        }
        if ( i < N ) {
            var steps = i - j
            var a = nums[j-1]
            var b = nums[i]
            var vdelta = (b - a)/(steps+1)
            //console.log(steps,a,b,vdelta)
            for ( ; (j < i) ; j++ ) {
                a += vdelta
                nums[j] = a;
            }
        }
    } else {
        i++
    }
}


var outfile = infile.substr(0,infile.indexOf('.')) + '.json'
fs.writeFileSync(outfile,JSON.stringify(output))

/*
import matplotlib.pyplot as plt 
import json

def showQuotas(datFile)
with open(datFile) as f:
    x = json.load(f)

f = plt.figure()
plt.plot(x)
plt.show()
f.savefig("foo.pdf", bbox_inches='tight')




ong long option_1(std::size_t bytes)
{
    std::vector<uint64_t> data = GenerateData(bytes);

    auto startTime = std::chrono::high_resolution_clock::now();
    auto myfile = std::fstream("file.binary", std::ios::out | std::ios::binary);
    myfile.write((char*)&data[0], bytes);
    myfile.close();
    auto endTime = std::chrono::high_resolution_clock::now();

    return std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime).count();
}



*/
