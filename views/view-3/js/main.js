

// aspect ratio is 5/6
var aspectRatio = 5 / 6;

// get browser window info
var browserWidth = window.innerWidth / 3;
var browserHeight = window.innerHeight / 3;

var colorCombos = [
  {
    first:"#FF5A30", // ~orange/red
    second:"#FEA52F", // ~orange/yellow
    third:"#E24e4e", // ~magenta
  },
  {
    first: "#F7A583",
    second:"#FB9FA4",
    third:"#F0EAD6"
  },
  {
    first:"white",
    second:"#519AC7", // lighter blue
    third:"#0F6FC6" // darker blue
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

canvasDimensions = getCanvasDimensions(browserWidth, browserHeight);

document.getElementById('view-1').width = canvasDimensions.width;
document.getElementById('view-1').height = canvasDimensions.height;

document.getElementById('view-2').width = canvasDimensions.width;
document.getElementById('view-2').height = canvasDimensions.height;

document.getElementById('view-3').width = canvasDimensions.width;
document.getElementById('view-3').height = canvasDimensions.height;

window.onload = function() {
  document.body.classList.remove('preload');
}

function fillBackground(color, id) {
  var canvas = document.getElementById(id);
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// other side of apartment building
function drawMidRect(w,h,color,id) {
  var canvas = document.getElementById(id);
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    x = (w / 5) * 2;
    y = (h / 6);
    width = (w / 5) + 1;
    height = (h / 6) * 5;

    ctx.fillStyle = color;
    // x, y, w, h
    ctx.fillRect(x, y, width, height);
    
  }
}

// right side of apartment building
function drawWall(w,h,color,id) {
  var canvas = document.getElementById(id);
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    x1 = (w / 5) * 3;
    y1 = (h / 6) * 1;
    x2 = (w / 5) * 3;
    y2 = h;
    x3 = (w / 5) * 5;
    y3 = h;
    x4 = (w / 5) * 5;
    y4 = 0;

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

function drawBottomSill(w,h,color,id) {
  var canvas = document.getElementById(id);
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    x1 = w;
    y1 = h;
    x2 = w;
    y2 = (h / 6) * 5;
    x3 = (w / 5);
    y3 = (h / 6) * 5;
    x4 = 0;
    y4 = h;

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

function drawLeftSill(w,h,color,id) {
  var canvas = document.getElementById(id);
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    x1 = 0;
    y1 = 0;
    x2 = (w / 5);
    y2 = 0;
    x3 = (w / 5);
    y3 = h;
    x4 = 0;
    y4 = h;

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

function getBase64Image(img,id) {
    var canvas = document.getElementById(id);
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function toggleOutline(elem) {
  if (elem.classList.contains('saved')) {
    elem.classList.remove('saved');
    localStorage.removeItem(elem.id);
  }
  else {
    elem.classList.add('saved');
    var canvas = document.getElementById(elem.id);
    var image = new Image();
    image.id = "pic"
    image.src = canvas.toDataURL();
    document.getElementById(elem.id).appendChild(image);
    imgData = getBase64Image(image, elem.id);
    localStorage.setItem(elem.id, imgData);
  }
}

// choose a random color combo
var colors = colorCombos[Math.floor(Math.random() * colorCombos.length)];

var randomColor = function (obj) {
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
};

function createView(id) {
  fillBackground(randomColor(colors), id); //background
  drawMidRect(canvasDimensions.width, canvasDimensions.height, randomColor(colors),id);
  drawWall(canvasDimensions.width, canvasDimensions.height, randomColor(colors),id);
  drawLeftSill(canvasDimensions.width, canvasDimensions.height, randomColor(colors),id);
  drawBottomSill(canvasDimensions.width, canvasDimensions.height, randomColor(colors),id);
}

var elementIDs = ['view-1','view-2','view-3'];
elementIDs.forEach(function(element) {
  if(localStorage.getItem(element) === null) {
    createView(element);
  }
  else {
    var dataImage = localStorage.getItem(element);
    path = "data:image/png;base64," + dataImage;
    console.log(path);

    image = document.createElement('img');
    document.body.appendChild(image);
    image.setAttribute('style','display:none');
    image.setAttribute('alt','script div');
    image.setAttribute("src", path);

    var imgCanvas = document.getElementById(element),
    imgContext = imgCanvas.getContext("2d");
    imgCanvas.classList.add('saved');

    // Make sure canvas is as big as the picture
    imgCanvas.width = image.width;
    imgCanvas.height = image.height;

    // Draw image into canvas element
    imgContext.drawImage(image, 0, 0, image.width, image.height);
    // Save image as a data URL
    imgInfom = imgCanvas.toDataURL("image/png");
    localStorage.setItem("imgInfo",imgInfom);
    document.body.removeChild(image);
  }
});
