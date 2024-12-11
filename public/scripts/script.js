const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');

const quadrantMap = new Map([
  [1, new Map([
    ['start', Math.PI/2],
    ['end', Math.PI/4]
  ])],
  [2, new Map([
    ['start', Math.PI/4],
    ['end', 0]
  ])],
  [3, new Map([
    ['start', 2*Math.PI],
    ['end', 7*Math.PI/4]
  ])],
  [4, new Map([
    ['start', 7*Math.PI/4],
    ['end', 6*Math.PI/4]
  ])],
  [5, new Map([
    ['start', 6*Math.PI/4],
    ['end', 5*Math.PI/4]
  ])],
  [6, new Map([
    ['start', 5*Math.PI/4],
    ['end', Math.PI]
  ])],
  [7, new Map([
    ['start', Math.PI],
    ['end', 3*Math.PI/4]
  ])],
  [8, new Map([
    ['start', 3*Math.PI/4],
    ['end', Math.PI/2]
  ])]
]);

const init = () => {
  // fill circle gradient
  ctx.save();
  let gradientColor = ctx.createLinearGradient(0, 0, pieDiameter, pieDiameter);
  gradientColor.addColorStop(0, fillColorGradientStart);
  gradientColor.addColorStop(1, fillColorGradientEnd);
  ctx.fillStyle = gradientColor;
  ctx.fillRect(0, 0, pieDiameter, pieDiameter);
  drawSlices();
  ctx.restore();
  updateFocusQuadrant(1);
};


function isAllowed(xCoord, yCoord) {
  let angle = Math.atan2(centerY - yCoord, xCoord - centerX);
  if (angle < 0) {
    angle = angle + 2 * Math.PI;
  }
  return isAngleInQuadrant(angle, 8);
}

function isAngleInQuadrant(radianAngle, quadrantCount) {
  // for now, expecting and allowing only 6 quadrant pies
  if (quadrantCount != 8) {
    return false;
  }
  return (radianAngle <= quadrantMap.get(focusQuadrant).get('start') && radianAngle >= quadrantMap.get(focusQuadrant).get('end'));
}

// draw pie pieces
function drawSlices() {
  // vertical
  ctx.save();
  let startX = centerX;
  let startY = 0;
  let endX = centerX;
  let endY = pieDiameter;
  drawSlice(startX, startY, endX, endY);

  // horizontal
  ctx.save();
  startX = 0;
  startY = centerY;
  endX = pieDiameter;
  endY = centerY;
  drawSlice(startX, startY, endX, endY);

  // top-left to bottom-right
  startX = centerX-fortyFiveOffsetX;
  startY = centerY-fortyFiveOffsetY;
  endX = centerX+fortyFiveOffsetX;
  endY = centerY+fortyFiveOffsetY;
  drawSlice(startX, startY, endX, endY);

  // bottom-left to top-right
  startX = centerX-fortyFiveOffsetX;
  startY = centerY+fortyFiveOffsetY;
  endX = centerX+fortyFiveOffsetX;
  endY = centerY-fortyFiveOffsetY;
  drawSlice(startX, startY, endX, endY);
  ctx.restore();
}

function drawSlice(startX, startY, endX, endY) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.lineWidth = pieSliceWidth/10;
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

function scratch(mouseX, mouseY) {
  // const x = e.clientX - canvas.offsetLeft;
  // const y = e.clientY - canvas.offsetTop;
  if (isAllowed(mouseX, mouseY)) {
    ctx.save();

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, pieSliceWidth/2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
    //ctx.globalCompositeOperation = 'destination-over';
    //drawSlices();
  }
}

function nextFocusQuadrant() {
  if (focusQuadrant < 8) {
    focusQuadrant++;
    updateFocusQuadrant(focusQuadrant);
  }
}

function previousFocusQuadrant() {
  if (focusQuadrant > 1) {
    focusQuadrant--;
    updateFocusQuadrant(focusQuadrant);
  }
}

function updateFocusQuadrant(newFocusQuadrant) {
  const input = document.getElementById('quadrant-label');
  input.innerHTML = `Leg ${newFocusQuadrant} (of 8)`;
  const distanceDetails = document.getElementById('distance-details');
  distanceDetails.innerHTML = `<span>${singlePieSliceDistance*newFocusQuadrant} out of ${totalPieDistance} total miles</span>`;
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, pieDiameter/2, -quadrantMap.get(focusQuadrant).get('start'), -quadrantMap.get(focusQuadrant).get('end'));
  ctx.lineTo(centerX, centerY);
  ctx.closePath();
  ctx.clip();
}

function selectDestination(locationName, totalDistance, pieSliceDistance, locationImg) {
  singlePieSliceDistance = pieSliceDistance;
  totalPieDistance = totalDistance;
  var selectionContainer = document.getElementById("selection-container");
  selectionContainer.classList.add('hidden');
  var canvasContainer = document.getElementById("canvas-container");
  canvasContainer.classList.remove('hidden');
  var pieheader = document.getElementById('pie-header');
  pieheader.innerHTML = 'En Route to ' + locationName + '!';
  var distanceDetails = document.getElementById('distance-details');
  distanceDetails.innerHTML = `<span>${pieSliceDistance} out of ${totalDistance} total miles</span>`;

  var piebackground = document.getElementById('pie-background');
  piebackground.style.backgroundImage = "url('img/" + locationImg + "')";
}

let deviceType = "";
//Detech touch device
const isTouchDevice = () => {
  try {
    //We try to create TouchEvent. It would fail for desktops and throw error.
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

var pieDiameter = 750;
var pieSliceWidth = 50;
if (isTouchDevice()) {
  console.log("touch device!");
  pieDiameter = 400;
  pieSliceWidth = 40;
} else {
  console.log("not a touch device!");
}

const centerX = pieDiameter/2;
const centerY = pieDiameter/2;
const fortyFiveOffsetX = (Math.sqrt(2) * pieDiameter)/2;
const fortyFiveOffsetY = (Math.sqrt(2) * pieDiameter)/2;
const fillColorGradientStart = 'rgb(85, 88, 218)'; //"#c3a3f1"
const fillColorGradientEnd = 'rgb(95, 209, 249)'; //"#6414e9"
var focusQuadrant = 1;
var singlePieSliceDistance = 0;
var totalPieDistance = 0;
var mouseX = 0;
var mouseY = 0;

// can also use the following libraries potentially:
// Scratch-it: a lightweight library specifically for scratch-off effects.
// Next-scratchcard: a React component for creating scratch cards.
// Set canvas dimensions
canvas.width = pieDiameter;
canvas.height = pieDiameter;

// Scratching functionality
let isDrawing = false;

//Events for touch and mouse
let events = {
  mouse: {
    down: "mousedown",
    move: "mousemove",
    up: "mouseup",
  },
  touch: {
    down: "touchstart",
    move: "touchmove",
    up: "touchend",
  },
};

const getXY = (e) => {
  mouseX = (!isTouchDevice() ? e.clientX - canvas.offsetLeft : e.touches[0].pageX - canvas.getBoundingClientRect().left);
  mouseY = (!isTouchDevice() ? e.clientY - canvas.offsetTop : e.touches[0].pageY - canvas.getBoundingClientRect().top);
};

isTouchDevice();

canvas.addEventListener(events[deviceType].down, (e) => {
  isDrawing = true;
  getXY(e);
  scratch(mouseX, mouseY);
});

canvas.addEventListener(events[deviceType].move, (e) => {
  if (isTouchDevice()) {
    e.preventDefault();
  }
  if (isDrawing) {
    getXY(e);
    scratch(mouseX, mouseY);
  }
});

canvas.addEventListener(events[deviceType].up, () => {
  isDrawing = false;
});

window.onload = init();