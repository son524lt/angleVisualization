const express = require('express');
const { realpath } = require('fs');
const path = require('path');

const app = express();

var data = ""
// Serve static files from the "web_version" directory
app.use(express.static(path.join(__dirname, 'web_version')));
const calibAngle = "A"
const calibIMU = "I"
const release = ""
var state = release

// Route for serving the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/sendData', express.raw({type: 'application/octet-stream'}), (req, res) => {
    // round number to 2 decimal places
    data = req.body.readFloatLE(0).toFixed(2) + ',' + req.body.readFloatLE(4).toFixed(2) + ',' + req.body.readInt32LE(8);
    res.send(state);
});

app.post('/doneCalib', (req, res) => {
    state = release
    res.send('');
    console.log("Done calibrating")
});

app.get('/getState', (req, res) => {
    if (state == release)
    res.send("Done");
    else res.send("Calibrating");
});

app.use((req, res) => {
    if (req.path == '/data') {
        res.send(data);
    } else if (req.path == '/calibIMU') {
        state = calibIMU
        res.send('');
        console.log("Calibrating IMU")
    } else if (req.path == '/calibAngle') {
        state = calibAngle
        res.send('');
        console.log("Calibrating Angle")
    } else if (req.path != '/sendData') {
        res.sendFile(path.join(__dirname, 'src', req.path));
    }
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});