(function (window) {

  // aspect ratio is 5/6
  var aspectRatio = 5 / 6;

  // get browser window info
  var browserWidth = window.innerWidth;
  var browserHeight = window.innerHeight;

  var colorCombos = [
    {
      first:"#FF5A30", // ~orange/red
      second:"#FEA52F", // ~orange/yellow
      third:"#E24e4e", // ~magenta
    },
      // colors from CDMX
    {
      first: "#F7A583",
      second:"#FB9FA4",
      third:"#F0EAD6"
    },
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

  // get canvas and set size
  var canvasSize = new canvasDimensions(browserWidth, browserHeight);
  var canvas = document.getElementById('view-1');
  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;

  var buildView = {
    'init': function(ctx, colors, canvasSize) {
      this.fillBackground(ctx,colors.third);
      this.drawRect(ctx, colors.second, canvasSize.width, canvasSize.height);
      this.drawTriangle(ctx, colors.first, canvasSize.width, canvasSize.height);
    },
    'fillBackground': function(ctx, color) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    'drawRect': function(ctx, color, w, h) {
      var x = (w / 5) * 3;
      var y = h * 0;
      var width = (w / 5) * 2;
      var height = h;

      ctx.fillStyle = color;
      // x, y, w, h
      ctx.fillRect(x, y, width, height);
    },
    'drawTriangle': function(ctx, color, w, h) {
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
    },
  };
  
  var ctx = canvas.getContext('2d');
  // choose random color combo
  var colors = colorCombos[Math.floor(Math.random() * colorCombos.length)];
  
  buildView.init(ctx,colors,canvasSize);

})(window);
