$(function() {
  var data = {}; // Hold card data used to render template
  var cardId = null; // Card service id for card - populated after first save
  var template = window.Trait;
  var serviceUrl = "http://localhost:8080";

  // Handlebars templates for building UI inputs
  var textInputTemplate = Handlebars.compile($('#TextInputTemplate').html());
  var imageInputTemplate = Handlebars.compile($('#ImageInputTemplate').html());
  var colorInputTemplate = Handlebars.compile($('#ColorInputTemplate').html());

  var $canvas = $('#Canvas'),
      canvas = $canvas[0],
      ctx = canvas.getContext('2d'),
      $inputs = $('#GeneratorControls');

  // Construct UI inputs
  function buildInputs() {
    var fields  = template.getFields();

    $.each(fields, function(i, field) {
      if (field.type === "text") {
        var $partial = $(textInputTemplate({
          id: field.id,
          label: field.label
        }))
          , $field = $partial.find('input');

        $field.keyup(redraw);
        $inputs.append($partial);
      } else if (field.type === "image") {
        var $partial = $(imageInputTemplate({
          id: field.id,
          label: field.label
        }))
          , $selector = $partial.find('.img-selector')
          , $field = $partial.find('.image-input')
          , $fileInput = $partial.find('.image-upload-input')
          , $previewContainer = $partial.find('.upload-preview');

        var thumbClicked = function() {
          $partial.find('.thumb').removeClass('selected');
          $(this).addClass('selected');
          $field.val($(this).attr('id'));
          redraw();
        }

        $fileInput.change(function() {
          $previewContainer.empty();

          if (this.files.length) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(this.files[0]);

            fileReader.onload = function(e) {
              var $thumb = $('<img class="thumb" src="' + e.target.result + '">');
              $thumb.click(thumbClicked);
              $previewContainer.append($thumb);
            }
          }
        });

        $selector.find('.thumb').click(thumbClicked);

        var $zoomControls = $partial.find('.zoom-controls')
          , $zoomPlus     = $zoomControls.find('.fa-plus-circle')
          , $zoomMinus    = $zoomControls.find('.fa-minus-circle');

        $zoomPlus.click(function(){
          data[field.id]['sWidth'] -= 20;
          redraw();
        });

        $zoomMinus.click(function() {
          data[field.id]['sWidth'] += 20;
          redraw();
        })

        $inputs.append($partial);
      } else if (field.type === "color") {
        var $partial = $(colorInputTemplate({
          id: field.id,
          label: field.label
        }));

        var $colors = $partial.find('.color');

        $colors.click(function() {
          $colors.removeClass('selected');
          $(this).addClass('selected');
          data[field.id] = $(this).css('background-color');
          redraw();
          console.log(data);
        })

        $inputs.append($partial);
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
      var $input = $(input)
        , id = $input.attr('id')
        , imgData = data[id]
        , $imgElem = $input.find('.thumb.selected');

      if ($imgElem.length) {
        if (imgData) {
          imgData['image'] = $imgElem[0];
        } else {
          data[$input.attr('id')] = {
            image: $imgElem[0],
            sx: 0,
            sy: 0,
            sWidth: 500
          };
        }
      }
    });

    template.draw(canvas, data);
  }

  function save() {
    var requestData = $.extend(true, {}, data),
        dataToSend = {};

    var imageFields = $.grep(template.getFields(), function(elem, i) {
      return elem['type'] === 'image';
    });

    dereferenceImages(imageFields, requestData, function() {
      dataToSend = JSON.stringify({
        'template': 'trait',
        'content': requestData
      })

      if (!cardId) {
        console.log('no card id');
        $.ajax({
          url: serviceUrl + '/cards',
          method: 'POST',
          data: dataToSend,
          contentType: 'application/json',
          success: function(data) {
            cardId = data['id'];
            window.open(serviceUrl + '/generate/' + cardId);
          }
        });
      } else {
        $.ajax({
          url: serviceUrl + '/cards/' + cardId,
          method: 'PUT',
          data: dataToSend,
          contentType: 'application/json',
          success: function(data) {
            window.open(serviceUrl + '/generate/' + cardId);
          }
        })
      }
    });
  }

  function dereferenceImages(imageFields, requestData, callback) {
    if (imageFields.length === 0) {
      return callback();
    }

    var field = imageFields.pop()
      , fieldData = requestData[field['id']]
      , imgSrc = null;

    if (fieldData) {
      imgSrc = fieldData['image']['src'];

      if (imgSrc.startsWith('data')) {
        var origFile = $('#' + field['id'] + ' .image-upload-input')[0].files[0];
        var formData = new FormData();
        formData.append('image', origFile);

        // Only one of these fields should be present, and it is populated
        // below
        delete fieldData['image'];
        delete fieldData['imageId'];
        delete fieldData['url'];

        $.ajax({
          url: serviceUrl + '/images',
          method: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function(data) {
            fieldData['imageId'] = data['id'];
            return dereferenceImages(imageFields, requestData, callback);
          }
        });
      } else {
        fieldData['url'] = imgSrc;
        return dereferenceImages(imageFields, requestData, callback);
      }
    }
  }

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

  function moveableContains(item, e) {
    var mouseX = e.pageX - $canvas[0].offsetLeft;
    var mouseY = e.pageY - $canvas[0].offsetTop;
    var contains = false;

    contains =  mouseX >= item['topLeft']['x'] &&
                mouseX <= item['bottomRight']['x'] &&
                mouseY >= item['topLeft']['y'] &&
                mouseY <= item['bottomRight']['y'];

    return {
      x: mouseX,
      y: mouseY,
      contains: contains
    };
  }

  buildInputs();
  $('#SaveBtn').click(save);

  var dragState = false;

  ctx.canvas.width = template.width();
  ctx.canvas.height = template.height();

  // Image panning
  $canvas.mousedown(function(e) {
    $.each(template.moveable(), function(i, item) {
      var containsResult = moveableContains(item, e);

      if (containsResult.contains) {
        dragState = {
          'x': containsResult.x,
          'y': containsResult.y,
          'item': item['name']
        };

        return false;
      }
    });
  });

  $canvas.on('mousemove', updateDrag);

  $canvas.mouseup(function(e) {
    dragState = false;
  });

  redraw();
});
