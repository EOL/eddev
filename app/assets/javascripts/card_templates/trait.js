(function() {
  var exports = {}

  if (typeof module === "undefined") {
    window.Trait = exports;
  } else {
    module.exports = exports;
  }

  const width  = 360,
        height = 504,
        imgHeight = 200,
        heightWidthRatio = (imgHeight * 1.0) / width,
        imgStartY = 65;

  function getWidth() {
    return width;
  }
  exports.width = getWidth;

  function getHeight() {
    return height;
  }
  exports.height = getHeight;

  function draw(canvas, content) {
    var ctx = canvas.getContext('2d'),
        mainPhoto = content['mainPhoto'];

    ctx.fillStyle = 'rgb(150, 56, 37)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = '24px Open Sans';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(content['commonName'], 15, 25);

    ctx.font = 'italic 20px Open Sans';
    ctx.fillText(content['sciName'], 15, 50);

    ctx.drawImage(mainPhoto['image'], mainPhoto['sx'], mainPhoto['sy'], mainPhoto['sWidth'], heightWidthRatio * mainPhoto['sWidth'], 0, imgStartY, width, imgHeight);

    /*
    ctx.font = '30px Helvetica';
    ctx.fillText(content['text'], 50, 100);

    var te = ctx.measureText(content['text']);
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.lineTo(50, 102);
    ctx.lineTo(50 + te.width, 102);
    ctx.stroke();
    */
  }
  exports.draw = draw;

  function getMoveable() {
    return [
      { 'name': 'mainPhoto',
        'topLeft': {
          'x': 0,
          'y': imgStartY
        },
        'bottomRight': {
          'x': width,
          'y': imgStartY + imgHeight
        }
      }  
    ]
  }
  exports.moveable = getMoveable;
})();

