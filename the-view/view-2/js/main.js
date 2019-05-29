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
    {
      first: "#F7A583",
      second:"#FB9FA4",
      third:"#F0EAD6",
    },
    {
      first:"#ECC36B", // gold
      second:"#539EC5", // lighter blue
      third: "white",
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

  // set size of canvas
  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;

  var buildView = {
    'init': function(ctx, colors, canvasSize) {
      // draw view
      this.fillBackground(ctx, this.randomColor(colors));
      this.drawRightWall(ctx, canvasSize.width, canvasSize.height, this.randomColor(colors));
      this.drawMidRect(ctx, canvasSize.width, canvasSize.height, this.randomColor(colors));
      this.drawLeftSill(ctx, canvasSize.width, canvasSize.height, this.randomColor(colors));
      this.drawBottomSill(ctx, canvasSize.width, canvasSize.height, this.randomColor(colors));

    },
    'randomColor': function (obj) {
      var keys = Object.keys(obj)
      return obj[keys[ keys.length * Math.random() << 0]];
    },
    'fillBackground': function(ctx, color) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    'drawRightWall': function(ctx, w, h, color) {

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
    'drawMidRect': function(ctx, w, h, color) {

      // set boundaries of rect
      x = (w / 5) * 2;
      y = (h / 6);
      width = (w / 5) + 1;
      height = (h / 6) * 5;

      ctx.fillStyle = color;
      // x, y, w, h
      ctx.fillRect(x, y, width, height);
      
    },
    'drawBottomSill': function(ctx, w, h, color) {

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
    'drawLeftSill': function(ctx, w, h, color) {

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
    soundTone: function() {

      notes = ["C", "E", "G"]
      octaves = [3,4,5,6];
      note = notes[Math.floor(Math.random() * notes.length)];
      octave = octaves[Math.floor(Math.random() * octaves.length)];;
      tones.type = "triangle";
      tones.attack = 300;
      tones.release = 300;
      tones.play(
        note,
        octave
      );
    },
    'handleOrientationEvent': function(event) {

      if( (Math.abs(event.beta - beta) > 20) || (Math.abs(event.alpha - alpha) > 20) || (Math.abs(event.gamma - gamma) > 20) ) {
        beta = event.beta;
        alpha = event.alpha;
        gamma = event.gamma;

        this.init(ctx,colors,canvasSize);
        this.soundTone();
      }

    },
    'handleMousemoveEvent': function(event) {
      
      var newx;
      var newy;
      if (event)
      {
        //FireFox
        newx = event.screenX;
        newy = event.screenY;
      }
      else
      {
        //IE
        newx = window.event.screenX;
        newy = window.event.screenY;
      }
      if( (Math.abs(newx - xpos) > 100) || (Math.abs(newy - ypos) > 100) ) {
        xpos = newx;
        ypos = newy;
        this.init(ctx,colors,canvasSize);
        this.soundTone();
      }
    
    },
  };

  var ctx = canvas.getContext('2d');
  // choose random color combo
  var colors = colorCombos[Math.floor(Math.random() * colorCombos.length)];
    
  buildView.init(ctx,colors,canvasSize);

  // add / init gyroscope event listener
  var beta = 90;
  var alpha = 0;
  var gamma = 0;
  window.addEventListener("deviceorientation", function(event) {
    buildView.handleOrientationEvent(event);
  }, true);

  // add / init mouse movement listener
  var xpos = 0;
  var ypos = 0;
  window.addEventListener("mousemove", function() {
    buildView.handleMousemoveEvent(event);
  }, true);

})(window);
