var template = window.Trait;

onFontsLoaded(function() {
  var $canvas = $('#Canvas'),
      canvas = $canvas[0],
      ctx = canvas.getContext('2d'),
      leatherbackImg = $('#LeatherbackPhoto')[0];

  var dragStart = false;

  var data = {
    'commonName': 'Leatherback Sea Turtle',
    'sciName': 'Dermocheyls coriacea',
    'mainPhoto': {
      'image': leatherbackImg,
      'sx': 0,
      'sy': 0,
      'sWidth': 500
    }
  };

  ctx.canvas.width = template.width();
  ctx.canvas.height = template.height();

  template.draw(canvas, data);

  $canvas.mousedown(function(e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;


    $.each(template.moveable(), function(i, item) {
      if (mouseX >= item['topLeft']['x'] && mouseX <= item['bottomRight']['x'] && mouseY >= item['topLeft']['y'] && mouseY <= item['bottomRight']['y']) {
        dragStart = {
          'x': mouseX,
          'y': mouseY,
          'item': item['name']
        };

        return false;
      }
    });
  });

  function updateDrag(e) {
    if (!dragStart) {
      return;
    }

    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    var dx = mouseX - dragStart['x'];
    var dy = mouseY - dragStart['y'];

    data[dragStart['item']]['sx'] -= dx;
    data[dragStart['item']]['sy'] -= dy;

    template.draw(canvas, data);
  }

  $canvas.on('mousemove', updateDrag);
  $canvas.mouseup(function(e) {
    updateDrag(e);
    dragStart = false;
  });
});

