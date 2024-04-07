// angle in degree
var visualData = {
    angle: 0,
    vAccel1: 0,
    vAccel2: 0,
    hAccel1: 0,
    hAccel2: 0,
    gyro1: 0,
    gyro2: 0,
}
var calibMode = false;
// get the canvas element
const canvas = document.getElementById('display');
// make canvas size full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// empty black background
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// draw a retangle on the canvas, at the bottom center
ctx.fillStyle = 'white';
const rectWidth = 300;
const rectHeight = 150;
const rectX = canvas.width / 2 - rectWidth / 2;
const rectY = canvas.height - rectHeight;
ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

// draw a red line from the center of the rectangle, 300px long, face up
const lineLength = 700;
ctx.strokeStyle = 'red';
ctx.beginPath();
ctx.moveTo(rectX + rectWidth / 2, rectY + rectHeight / 2);
ctx.lineTo(rectX + rectWidth / 2, rectY + rectHeight / 2 - lineLength);
ctx.stroke();

// same but yellow line
ctx.strokeStyle = 'yellow';
ctx.beginPath();
ctx.moveTo(rectX + rectWidth / 2, rectY + rectHeight / 2);
ctx.lineTo(rectX + rectWidth / 2, rectY + rectHeight / 2 + lineLength);
ctx.stroke();

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(rectX + rectWidth / 2, rectY + rectHeight / 2);
    const angleInRadians = - (-visualData.angle * Math.PI / 180) + Math.PI/2;
    const lineEndX = rectX + rectWidth / 2 + lineLength * Math.cos(angleInRadians);
    const lineEndY = rectY + rectHeight / 2 - lineLength * Math.sin(angleInRadians);
    ctx.lineTo(lineEndX, lineEndY);
    ctx.stroke();
    // draw the line of the angleAcel
    ctx.strokeStyle = 'yellow';
    ctx.beginPath();
    ctx.moveTo(rectX + rectWidth / 2, rectY + rectHeight / 2);
    const angleAccelInRadians = - (-visualData.angleAccel * Math.PI / 180) + Math.PI/2;
    const lineEndX2 = rectX + rectWidth / 2 + lineLength * Math.cos(angleAccelInRadians);
    const lineEndY2 = rectY + rectHeight / 2 - lineLength * Math.sin(angleAccelInRadians);
    ctx.lineTo(lineEndX2, lineEndY2);
    ctx.stroke();
    // show angle value on the screen
    angleDisplay.innerText = `Angle: ${visualData.angle}°`;
    angleAccelDisplay.innerText = `Angle Accel: ${visualData.angleAccel}`;
    errorDisplay.innerText = `Error: ${visualData.error}`;
}

setInterval(() => {
    // server sent back a string of data, split by commas as angle, angleAccel, error then put in visualData
    while (calibMode) {
        fetch(`/getState`).then(res => res.text()).then(state => {
            if (state == "Done") {
                calibMode = false;
                calibDisplay.innerText = "";
            }
        });
        wait(1000);
    }
    fetch(`/data`).then(res => res.text()).then(data => {
        const [angle, angleAccel, error] = data.split(',');
        visualData.angle = angle;
        visualData.angleAccel = angleAccel;
        visualData.error = error;
        console.log(data);
        draw();
    });
}, 1);

const angleDisplay = document.createElement('div');
angleDisplay.style.position = 'absolute';
angleDisplay.style.top = '0';
angleDisplay.style.left = '0';
angleDisplay.style.color = 'white';
document.body.appendChild(angleDisplay);

const angleAccelDisplay = document.createElement('div');
angleAccelDisplay.style.position = 'absolute';
angleAccelDisplay.style.top = '25px';
angleAccelDisplay.style.left = '0';
angleAccelDisplay.style.color = 'white';
document.body.appendChild(angleAccelDisplay);

const errorDisplay = document.createElement('div');
errorDisplay.style.position = 'absolute';
errorDisplay.style.top = '50px';
errorDisplay.style.left = '0';
errorDisplay.style.color = 'white';
document.body.appendChild(errorDisplay);

// add calibIMU button
const calibIMUButton = document.createElement('button');
calibIMUButton.innerText = 'Calibrate IMU';
calibIMUButton.style.position = 'absolute';
calibIMUButton.style.top = '0';
calibIMUButton.style.right = '0';
calibIMUButton.onclick = () => {
    fetch('/calibIMU');
    calibMode = true;
    calibDisplay.innerText = "Calibrating...";
};
document.body.appendChild(calibIMUButton);

// add calibAngle button
const calibAngleButton = document.createElement('button');
calibAngleButton.innerText = 'Calibrate Angle';
calibAngleButton.style.position = 'absolute';
calibAngleButton.style.top = '25px';
calibAngleButton.style.right = '0';
calibAngleButton.onclick = () => {
    fetch('/calibAngle');
    calibMode = true;
    calibDisplay.innerText = "Calibrating...";
};
document.body.appendChild(calibAngleButton);


// add text calibrating on the screen
const calibDisplay = document.createElement('div');
calibDisplay.style.position = 'absolute';
calibDisplay.style.top = '50px';
calibDisplay.style.right = '0';
calibDisplay.style.color = 'white';
calibDisplay.innerText = "";
document.body.appendChild(calibDisplay);
