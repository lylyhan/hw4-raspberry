const fs = require('fs');
const readline = require('readline');

const arguments = process.argv;
if(arguments.length != 4){
    console.error('inputs: [date(yyyy-mm-dd)], [pathtolog]');
} else {
    var date = arguments[2];
    var logPath = arguments[3];
}

// converting .log(text file) to JSON
function convert(file) {

    return new Promise((resolve, reject) => {

        const stream = fs.createReadStream(file);
        // Handle stream error (IE: file not found)
        stream.on('error', reject);

        const reader = readline.createInterface({
            input: stream
        });

        const array = [];

        reader.on('line', line => {
            array.push(JSON.parse(line));
        });

        reader.on('close', () => resolve(array));
    });
}

var arrMsg = [];
var rawData = [];

convert(logPath)
    .then(res => {
        res.forEach(item => {
            if(item.time.slice(0,10) == date){
                arrMsg.push(item.msg);
            }
        })
        arrMsg.forEach(item => {
            rawData.push(parseFloat(item.split(',')[0].substring(6,10)));
        })

        var maxTemp = rawData.reduce(function(a,b){
            return Math.max(a,b);
        })
        var minTemp = rawData.reduce(function(a,b){
            return Math.min(a,b);
        })
        console.log(`on ${date} highest tempture is ${maxTemp}°C lowest tempture is ${minTemp}°C`);
    })
    .catch(err => console.error(err));




