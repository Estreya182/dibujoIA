let video;
let handpose;
let predictions = [];
let prevX = null;
let prevY = null;
let smoothX = null;
let smoothY = null;
let drawingLayer;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, () => {
    console.log("Modelo de mano cargado");
  });

  handpose.on("predict", results => {
    predictions = results;
  });

  drawingLayer = createGraphics(width, height);
  drawingLayer.clear();
}

function draw() {
  image(video, 0, 0, width, height);
  drawFace();

  if (predictions.length > 0) {
    const landmarks = predictions[0].landmarks;
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const d = dist(thumbTip[0], thumbTip[1], indexTip[0], indexTip[1]);

    const drawActive = d < 40;

    if (drawActive) {
      
      if (smoothX == null) {
        smoothX = indexTip[0];
        smoothY = indexTip[1];
      } else {
        
        let smoothing = 0.2;
        smoothX = lerp(smoothX, indexTip[0], smoothing);
        smoothY = lerp(smoothY, indexTip[1], smoothing);
      }

      drawingLayer.strokeWeight(4);
      drawingLayer.stroke(255, 0, 0);

      if (prevX !== null && prevY !== null) {
        
        if (dist(prevX, prevY, smoothX, smoothY) < 50) {
          drawingLayer.line(prevX, prevY, smoothX, smoothY);
        }
      }

      prevX = smoothX;
      prevY = smoothY;
    } else {
      prevX = null;
      prevY = null;
      smoothX = null;
      smoothY = null;
    }
  }

  image(drawingLayer, 0, 0);
}

function drawFace() {
  fill(153, 102, 0);
  noStroke();
  ellipse(320, 240, 200, 250); 

  fill(255);
  circle(290, 200, 50); 
  circle(350, 200, 50); 

  fill(0);
  circle(290, 200, 20); 
  circle(350, 200, 20); 
}
