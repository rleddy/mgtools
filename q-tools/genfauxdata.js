
var isnow = Date.now()

var nobs = Array(100).fill(null)

nobs = nobs.map((nob) => {
    return({
        timestamp : isnow,
        available : 0})
    })

var line = (x) => 2*x + 2

const DELTA = 450

nobs.forEach((nob, index)  => {
    nob.available = line(index*DELTA)
    nob.timestamp += index*DELTA
})


console.log(JSON.stringify(nobs))
