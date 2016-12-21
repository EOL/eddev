var template = window.Trait;

window.CardGenerator = {};

(function() {
  var exports = window.CardGenerator;
  var data = {};


  function dumpData() {
    console.log(JSON.stringify(data));
  }
  exports.dumpData = dumpData;

  onFontsLoaded(function() {
    var $canvas = $('#Canvas'),
        canvas = $canvas[0],
        ctx = canvas.getContext('2d'),
        leatherbackImg = $('#LeatherbackPhoto')[0];

    data = {
      'commonName': 'Leatherback Sea Turtle',
      'sciName': 'Dermocheyls coriacea',
      'mainPhoto': {
        'image': leatherbackImg,
        'sx': 0,
        'sy': 0,
        'sWidth': 500
      }
    };

    var dragState = false;

    ctx.canvas.width = template.width();
    ctx.canvas.height = template.height();

    template.draw(canvas, data);

    $canvas.mousedown(function(e) {
      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;


      $.each(template.moveable(), function(i, item) {
        if (mouseX >= item['topLeft']['x'] && 
            mouseX <= item['bottomRight']['x'] && 
            mouseY >= item['topLeft']['y'] && 
            mouseY <= item['bottomRight']['y']) {
          dragState = {
            'x': mouseX,
            'y': mouseY,
            'item': item['name']
          };

          return false;
        }
      });
    });

    function updateDrag(e) {
      if (!dragState) {
        return;
      }

      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;

      var dx = mouseX - dragState['x'];
      var dy = mouseY - dragState['y'];

      data[dragState['item']]['sx'] -= dx;
      data[dragState['item']]['sy'] -= dy;

      dragState['x'] = mouseX;
      dragState['y'] = mouseY;

      template.draw(canvas, data);
    }

    $canvas.on('mousemove', updateDrag);
    $canvas.mouseup(function(e) {
      dragState = false;
    });
  });
})();
