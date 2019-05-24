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
    // original colors
  {
    first:"red",
    second:"yellow",
    third:"black"
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

function drawLeftRect(w,h,color) {
  var canvas = document.getElementById('view-1');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    var x = (w / 5) * 3;
    var y = h * 0;
    var width = (w / 5) * 2;
    var height = h;

    ctx.fillStyle = color;
    // x, y, w, h
    ctx.fillRect(x, y, width, height);
    
  }
}

// the roof slice in the bottom corner
function drawTriangle(w,h,color) {
  var canvas = document.getElementById('view-1');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    var x1 = w * 0;
    var y1 = (h / 6) * 5;
    var x2 = w * 0;
    var y2 = h;
    var x3 = (w / 10) * 5;
    var y3 = h;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);

    ctx.fillStyle = color;
    ctx.fill();
  }
}

// choose a random color combo
var colors = colorCombos[Math.floor(Math.random() * colorCombos.length)];

fillBackground(colors.third); //background
drawLeftRect(canvasDimensions.width, canvasDimensions.height, colors.second); //main column
drawTriangle(canvasDimensions.width, canvasDimensions.height, colors.first); // slice bottom left

