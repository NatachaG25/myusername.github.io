// const express = require('express');

// const app = express();
// const port = 5501;

// app.get('/', (req, res) => {
//     res.send('Hello, world!');
// });

// app.listen(3000, () => {
//     console.log(`Server is running on port ${port}`);
// });


export function writeToLogFile(data) {
    const formatLogData = `[${new Date().toISOString()}] ${data}\n`;
    const fs = require('fs');
    fs.appendFile("./log/app.log", formatLogData, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}
// module.exports = add;

// let datalog = "#######  INIT REQUEST PARAMS #####" +
//     JSON.stringify(initParamsCAM) +
//     "#######  INIT RESPONSE #####" +
//     JSON.stringify(promiseResolvedPayloadCAM) +
//     "####### INIT END ######";


// writeToLogFile(datalog);

