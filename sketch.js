let classifier;
let soundModel = 'https://teachablemachine.withgoogle.com/models/6H9YQulOm/';

// Variables to help “hold” the drawn shapes
let currentLabel = "";
let lastUpdateTime = 0;
let holdDuration = 20000; // in milliseconds

function preload() {
  console.log(">>> preload() called");
  
  // Increase the probability threshold to reduce sensitivity
  classifier = ml5.soundClassifier(
    soundModel + 'model.json',
    { probabilityThreshold: 0.85 },
    modelReady
  );
  console.log(">>> Classifier object created:", classifier);
}

function setup() {
  console.log(">>> setup() called");
  
  createCanvas(640, 480);
  background(0);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Click to enable audio", width / 2, height / 2);
  
  console.log(">>> getAudioContext:", getAudioContext());
}

function mousePressed() {
  console.log(">>> mousePressed() called");
  
  let audioContextState = getAudioContext().state;
  console.log(">>> Audio context state is:", audioContextState);
  if (audioContextState !== 'running') {
    getAudioContext().resume();
    console.log(">>> Audio Context resumed!");
  }
}

function modelReady() {
  console.log(">>> modelReady() called");
  console.log("Model loaded!");
  
  console.log(">>> classifier.classify() about to start");
  classifier.classify(gotResults);
}

function gotResults(error, results) {
  console.log(">>> gotResults() called");
  if (error) {
    console.error("Classification error:", error);
    return;
  }
  
  // Extract the label and confidence from the first result
  let newLabel = results[0].label;
  let confidence = results[0].confidence;
  
  // Only update if the label has changed or if the hold time has elapsed.
  if (newLabel !== currentLabel || (millis() - lastUpdateTime) > holdDuration) {
    currentLabel = newLabel;
    lastUpdateTime = millis();
    
    // Clear the canvas and display the result text
    background(0);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(`Sound: ${newLabel}\nConfidence: ${nf(confidence, 0, 2)}`, width / 2, height / 2);
    
    // Draw visual effects based on the predicted label
    if (newLabel === "Click") {
      drawRandomShapes();
    } else if (newLabel === "Whistle") {
      drawRandomCircles();
    } else if (newLabel === "Clap") {
      drawRandomLines();
    }
  }
}

function drawRandomShapes() {
  console.log(">>> drawRandomShapes() called");
  for (let i = 0; i < 10; i++) {
    fill(random(255), random(255), random(255));
    rect(random(width), random(height), random(50, 100), random(50, 100));
  }
}

function drawRandomCircles() {
  console.log(">>> drawRandomCircles() called");
  for (let i = 0; i < 10; i++) {
    fill(random(255), random(255), random(255));
    ellipse(random(width), random(height), random(50, 100));
  }
}

function drawRandomLines() {
  console.log(">>> drawRandomLines() called");
  for (let i = 0; i < 10; i++) {
    stroke(random(255), random(255), random(255));
    line(random(width), random(height), random(width), random(height));
  }
}
