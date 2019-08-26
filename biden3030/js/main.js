$(document).ready(function(){

  $("#makeSpeech").on("submit", function(e) {

    e.preventDefault();

    var i = 0;
    var text = '';
    for (i = 0; i < 500; i++) { 
      var speechStuff = [
        'Barry',
        'My friend Barack',
        'Barack Obama',
        'Big Barry O',
        'My pal Barack',
        'Obama',
        'Barack Hussein Obama',
        'My best friend Barack',
        'Barack Hussein Obama II',
        'Barack H. Obama',
        'Barack and I',
        'As Barack\'s VP',
      ];
      l = speechStuff.length;
      r = Math.floor(Math.random() * l);
      text += ' '+speechStuff[r];
    }

    console.log(text);

    $("#results").empty();
    $("#results").html(text);

  });

});