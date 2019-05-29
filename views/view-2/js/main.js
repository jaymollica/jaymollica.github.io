(function () {

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
      width = (w / 5);
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
      console.log(event.absolute);
      this.soundTone();
      this.init(ctx,colors,canvasSize);
    },
  };

  var ctx = canvas.getContext('2d');
  // choose random color combo
  var colors = colorCombos[Math.floor(Math.random() * colorCombos.length)];
    
  buildView.init(ctx,colors,canvasSize);

  window.addEventListener("deviceorientation", function(e) {
    buildView.handleOrientationEvent(e);
  }, true);

  //   console.log(event.beta);
  //   console.log(event.alpha);
  //   console.log(event.gamma);

  //   buildView.soundTone();
  //   buildView.init(ctx,colors,canvasSize);
  // }, true);


  // var gyroPresent = false;

  // window.addEventListener("deviceorientation", handleOrientation, true);

  // var beta = 90;  // In degree in the range [-180,180]
  // var alpha = 0;

  // function handleOrientation(event) {
  //   console.log('its happening');
    
  //   var newBeta = event.beta;  // In degree in the range [-180,180]
  //   var newAlpha = event.alpha;
  //   var gyroPresent = true;

  //   console.log(newBeta);

  //   if( (Math.abs(newBeta - beta) > 20) || (Math.abs(newAlpha - alpha) > 20) ) {
  //     window.beta = newBeta;
  //     window.alpha = newAlpha;
  //     createView();
  //   }
  // }

  // var xpos = 0;
  // var ypos = 0;

  // function findScreenCoords(mouseEvent) {
  //   var newx;
  //   var newy;
  //   if (mouseEvent)
  //   {
  //     //FireFox
  //     newx = mouseEvent.screenX;
  //     newy = mouseEvent.screenY;
  //   }
  //   else
  //   {
  //     //IE
  //     newx = window.event.screenX;
  //     newy = window.event.screenY;
  //   }
  //   if( (Math.abs(newx - xpos) > 100) || (Math.abs(newy - ypos) > 100) ) {
  //     window.xpos = newx;
  //     window.ypos = newy;
  //     createView();
  //   }
  // }

  // if(gyroPresent === false) {
  //   document.getElementById("view-1").onmousemove = findScreenCoords;
  // }


  // createView();

})();


