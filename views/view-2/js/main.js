// aspect ratio is 5/6
var aspectRatio = 5 / 6;

// get browser window info
var bWidth = window.innerWidth;
var bHeight = window.innerHeight;

var colorCombos = [
  {
    // colors from Endless Summer album cover
    first:"#FF5A30", // ~orange/red
    second:"#FEA52F", // ~orange/yellow
    third:"#E24e4e", // ~magenta

  },
    // colors from CDMX
  {
    //first:"#E4007C", // CDMX Pink
    first: "#F7A583",
    second:"#FB9FA4",
    third:"#F0EAD6"
  },
  // colors from Finding Shore album cover
  {
    first:"#ECC36B", // gold
    second:"#539EC5", // lighter blue
    third: "white",
    //third:"#0F6FC6" // darker blue
  },
  {
    first:"white",
    second:"white",
    third:"#FF5A30", // ~orange/red
  },
];

function getCanvasDimensions(bWidth, bHeight) {
  // all measurements are proportionate to canvas h / w
  var cWidth;
  var cHeight;

  if (bWidth > bHeight) {
    // landscape mode so height is limiting dimension
    if(bHeight > 660) {
      cHeight = 600;
    }
    else {
      cHeight = (bHeight * .9);
    }
    cWidth = (cHeight * aspectRatio);
  } else {
    cWidth = (bWidth * .9);
    cHeight = (cWidth / aspectRatio);
  }

  canvasDimensions = {
    width: cWidth,
    height: cHeight
  };

  return canvasDimensions;

}

canvasDimensions = getCanvasDimensions(bWidth, bHeight);

document.getElementById('view-1').width = canvasDimensions.width;
document.getElementById('view-1').height = canvasDimensions.height;

function fillBackground(color) {
  var canvas = document.getElementById('view-1');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// other side of apartment building
function drawMidRect(w,h,color) {
  var canvas = document.getElementById('view-1');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    var x = (w / 5) * 2;
    var y = (h / 6);
    var width = (w / 5);
    var height = (h / 6) * 5;

    ctx.fillStyle = color;
    // x, y, w, h
    ctx.fillRect(x, y, width, height);
    
  }
}

// right side of apartment building
function drawWall(w,h,color) {
  var canvas = document.getElementById('view-1');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    var x1 = (w / 5) * 3;
    var y1 = (h / 6) * 1;
    var x2 = (w / 5) * 3;
    var y2 = h;
    var x3 = (w / 5) * 5;
    var y3 = h;
    var x4 = (w / 5) * 5;
    var y4 = 0;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.lineTo(x1, y1);

    ctx.fillStyle = color;
    ctx.fill();
  }
}

function drawBottomSill(w,h,color) {
  var canvas = document.getElementById('view-1');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    var x1 = w;
    var y1 = h;
    var x2 = w;
    var y2 = (h / 6) * 5;
    var x3 = (w / 5);
    var y3 = (h / 6) * 5;
    var x4 = 0;
    var y4 = h;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.lineTo(x1, y1);

    ctx.fillStyle = color;
    ctx.fill();
  }
}

function drawLeftSill(w,h,color) {
  var canvas = document.getElementById('view-1');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    var x1 = 0;
    var y1 = 0;
    var x2 = (w / 5);
    var y2 = 0;
    var x3 = (w / 5);
    var y3 = h;
    var x4 = 0;
    var y4 = h;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.lineTo(x1, y1);

    ctx.fillStyle = color;
    ctx.fill();
  }
}

// choose a random color combo
var colors = colorCombos[Math.floor(Math.random() * colorCombos.length)];

var randomColor = function (obj) {
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
};

function createView() {
  fillBackground(randomColor(colors)); //background
  drawMidRect(canvasDimensions.width, canvasDimensions.height, randomColor(colors));
  drawWall(canvasDimensions.width, canvasDimensions.height, randomColor(colors));
  drawLeftSill(canvasDimensions.width, canvasDimensions.height, randomColor(colors));
  drawBottomSill(canvasDimensions.width, canvasDimensions.height, randomColor(colors));
}

var gyroPresent = false;

window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
  var x = event.beta;  // In degree in the range [-180,180]
  var y = event.gamma;
  alert("motion happened!");

}

// window.addEventListener("devicemotion", function(event){
//     if(event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)
//       gyroPresent = true;
//       createView();
// });

var xpos = 0;
var ypos = 0;

function findScreenCoords(mouseEvent) {
  var newx;
  var newy;
  if (mouseEvent)
  {
    //FireFox
    newx = mouseEvent.screenX;
    newy = mouseEvent.screenY;
  }
  else
  {
    //IE
    newx = window.event.screenX;
    newy = window.event.screenY;
  }
  if( (Math.abs(newx - xpos) > 100) || (Math.abs(newy - ypos) > 100) ) {
    window.xpos = newx;
    window.ypos = newy;
    createView();
  }
}

if(gyroPresent === false) {
  document.getElementById("view-1").onmousemove = findScreenCoords;
}


createView();

