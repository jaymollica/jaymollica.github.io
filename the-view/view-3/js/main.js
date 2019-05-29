(function (window) {

  // aspect ratio is 5/6
  var aspectRatio = 5 / 6;

  // get browser window info
  var browserWidth = window.innerWidth / 3; // 3 canvases
  var browserHeight = window.innerHeight / 3; // 3 canvases

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

  var canvasDimensions = function(browserWidth, browserHeight) {
    // all measurements are proportionate to canvas h / w
    var canvasWidth;
    var canvasHeight;

    if (browserWidth > browserHeight) {
      // landscape mode so height is limiting dimension
      if(browserHeight > 660) {
        canvasHeight = 600;
      }
      else {
        canvasHeight = (browserHeight * .9);
      }
      canvasWidth = (canvasHeight * aspectRatio);
    } else {
      canvasWidth = (browserWidth * .9);
      canvasHeight = (canvasWidth / aspectRatio);
    }

    return {
      width: canvasWidth,
      height: canvasHeight
    };

  }

  var canvasSize = new canvasDimensions(browserWidth, browserHeight);

  window.onload = function() {
    document.body.classList.remove('preload');
  }

  var buildView = {
    'init': function(canvas, colors, canvasSize) {
      // set canvas size
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      // draw view
      this.fillBackground(canvas, this.randomColor(colors));
      this.drawRightWall(canvas, canvasSize.width, canvasSize.height, this.randomColor(colors));
      this.drawMidRect(canvas, canvasSize.width, canvasSize.height, this.randomColor(colors));
      this.drawLeftSill(canvas, canvasSize.width, canvasSize.height, this.randomColor(colors));
      this.drawBottomSill(canvas, canvasSize.width, canvasSize.height, this.randomColor(colors));

    },
    'randomColor': function (obj) {
      var keys = Object.keys(obj)
      return obj[keys[ keys.length * Math.random() << 0]];
    },
    'fillBackground': function(canvas, color) {
      ctx = canvas.getContext('2d');
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    'drawRightWall': function(canvas, w, h, color) {

      ctx = canvas.getContext('2d');
      // set boundaries of shape
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
    },
    'drawMidRect': function(canvas, w, h, color) {
      ctx = canvas.getContext('2d');
      // set boundaries of rect
      x = (w / 5) * 2;
      y = (h / 6);
      width = (w / 5) + 1;
      height = (h / 6) * 5;

      ctx.fillStyle = color;
      // x, y, w, h
      ctx.fillRect(x, y, width, height);
      
    },
    'drawBottomSill': function(canvas, w, h, color) {
      ctx = canvas.getContext('2d');
      // set boundaries
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

    },
    'drawLeftSill': function(canvas, w, h, color) {
      var ctx = canvas.getContext('2d');
      // set boundaries
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

    },
  };

  // choose random color combo and initiate view
  var colors = colorCombos[Math.floor(Math.random() * colorCombos.length)];
  var canvasIDs = ['view-1','view-2','view-3'];
  canvasIDs.forEach(function(id) {
    canvas = document.getElementById(id);
    buildView.init(canvas,colors,canvasSize);
  });

})(window);
