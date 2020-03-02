console.log("Starting node sensor script");

const sensor = require("node-dht-sensor").promises;
const path = require("path");
const bunyan = require("bunyan");

var event = new Date;
var startDate = event.toLocaleDateString('en-US');
console.log()
var parsedDate = startDate.replace('/', '_');
var parsedDate2 = parsedDate.replace('/', '_');
var startTime = event.toLocaleTimeString('en-US', { hour12: false });

// var logPath = path.join(__dirname, "../logs", `weather_${parsedDate2}.log`);

// const log = bunyan.createLogger({ 
//     name: "dht22_aday",
//     streams: [
//         {
//             path: logPath,
//             level:"info"
//         }
//     ]
// });

const logMax = bunyan.createLogger({ 
    name: "dht22_max",
    streams: [
        {
            path:"../logs/dht22_weather.log",
            level:"info"
        }
    ]
});

sensor.setMaxRetries(10);

var maxTemp = -100;
var minTemp = 100;
var preTemp = 0;

setInterval(async () => {
    try {
        const reading = await sensor.read(22, 4);

        var curTemp = ((Math.round(reading.temperature * 1000)) / 1000).toFixed(3);
        var humi = reading.humidity;

        if (curTemp<minTemp){minTemp = curTemp;}
        if (curTemp>maxTemp){maxTemp = curTemp;}
        if (curTemp > preTemp + 0.2){preTemp = curTemp;}
        if (curTemp < preTemp - 0.2){preTemp = curTemp;}
      
        //log.info(`temp: ${curTemp}°C`);
        logMax.info(`temp: ${curTemp}°C, maxtemp: ${maxTemp}°C, mintemp: ${minTemp}°C`);
        console.log(`temp: ${curTemp}°C, maxtemp: ${maxTemp}°C, mintemp: ${minTemp}°C`);

    } catch (e) {
        console.log("Error!");
        console.log(e);
    }
}, 5000);


