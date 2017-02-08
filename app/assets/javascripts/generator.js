var template = window.Trait;

window.CardGenerator = {};

$(function() {
  var exports = window.CardGenerator;
  var data = {};

  var $canvas = $('#Canvas'),
      canvas = $canvas[0],
      ctx = canvas.getContext('2d'),
      $inputs = $('#GeneratorControls');


  function dumpData() {
    console.log(JSON.stringify(data));
  }
  exports.dumpData = dumpData;

  // Construct UI inputs
  function buildInputs() {
    var fields  = template.getFields();

    $.each(fields, function(i, field) {
      var $label = $('<label for="' + field.id + '">' + field.label + ': </label>')
        , $wrapper = $('<div class="fields"></div>');

      if (field.type === "text") {
        var $field = $('<input type="text" class="text-input" id="' + field.id + '"/>');

        $field.keyup(redraw);

        $wrapper.append($label);
        $wrapper.append($field);
        $inputs.append($wrapper);
      } else if (field.type === "image") {
        var $field = $('<input type="hidden" class="image-input" id="' + field.id + '"/>')
          , $selector = $('#ImgSelector').clone();

        $selector.attr('id', null);
        $selector.removeClass('hidden');

        $selector.find('img').each(function(i, img) {
          var $img = $(img);

          $img.click(function() {
            $selector.find('img').removeClass('selected');
            $(this).addClass('selected');
            $field.val($(this).attr('id'));
            redraw();
          });
        });

        $wrapper.append($label);
        $wrapper.append($selector);
        $wrapper.append($field);

        $inputs.append($wrapper);
      } else {
        console.log('unable to construct field: ' + JSON.stringify(field));
      }
    });
  }

  function redraw() {
    $inputs.find('.text-input').each(function(i, input) {
      var $input = $(input);
      data[$input.attr('id')] = $input.val();
    });

    $inputs.find('.image-input').each(function(i, input) {
      var $input = $(input);
      data[$input.attr('id')] = {
        image: $('#' + $input.val())[0],
        sx: 0,
        sy: 0,
        sWidth: 500
      };
    });

    template.draw(canvas, data);
  }

  buildInputs();

  ctx.canvas.width = template.width();
  ctx.canvas.height = template.height();
/*
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
  */

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
