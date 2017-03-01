$(function() {
  var card = {}; // Hold card data used to render template
  var data = {};
  var cardId = null; // Card service id for card - populated after first save
  var serviceUrl = "http://localhost:8080";
  var dragState = false;

  var imgCount = 0; // Used for generating image ids

  // Handlebars templates for building UI inputs
  var textInputTemplate = Handlebars.compile($('#TextInputTemplate').html());
  var imageInputTemplate = Handlebars.compile($('#ImageInputTemplate').html());
  var colorInputTemplate = Handlebars.compile($('#ColorInputTemplate').html());

  var templateSupplier = {
    supply: function(templateName, cb) {
      $.getJSON(serviceUrl + '/templates/trait', function(data) {
        cb(null, data);
      })
        .fail(function() {
          cb(new Error("Failed to retrieve template"));
        });
    }
  };

  var canvasSupplier = {
    supply: function(width, height) {
      var $canvas = $('#Canvas'),
          canvas  = $canvas[0];

      canvas.width = width;
      canvas.height = height;

      return canvas;
    }
  }

  TemplateRenderer.setTemplateSupplier(templateSupplier);
  TemplateRenderer.setCanvasSupplier(canvasSupplier);

  TemplateRenderer.loadTemplate('trait', function(err) {
    if (err) {
      console.log(err);
      return;
    }

    var canvas = TemplateRenderer.getCanvas(),
        $canvas = $(canvas),
        ctx = canvas.getContext('2d'),
        $inputs = $('#GeneratorControls');

    function imageId(i) {
      return "Image" + (i + imgCount);
    }

    // Construct UI inputs
    function buildInputs() {
      var fields  = TemplateRenderer.fields();

      $inputs.empty();

      $.each(fields, function(i, field) {
        var defaultVal = card.defaultData[field.id];

        if (field.type === "text") {
          var $partial = $(textInputTemplate({
            id: field.id,
            label: field.label
          }))
            , $field = $partial.find('input')

          if (defaultVal) {
            $field.val(defaultVal);
          }

          $field.keyup(redraw);
          $inputs.append($partial);
        } else if (field.type === "image") {
          var choices = card.choices[field.id] || []
            , images = new Array(choices.length)
            , defaultImg = card.defaultData[field.id]
            , defaultUrl = null
            , $partial = null
            , $selector = null
            , $field = null
            , $fileInput = null
            , $previewContainer = null;

            $.each(choices, function(i, choice) {
              images[i] = {
                src: choice,
                id: imageId(i)
              }
            });

            $partial = $(imageInputTemplate({
              id: field.id,
              label: field.label,
              images: images
            }));
            $selector = $partial.find('.img-selector')
            $field = $partial.find('.image-input')
            $fileInput = $partial.find('.image-upload-input')
            $previewContainer = $partial.find('.upload-preview')

          var thumbClickedHelper = function(elmt) {
            $partial.find('.thumb').removeClass('selected');
            $(elmt).addClass('selected');
            $field.val($(elmt).attr('id'));
          }

          var thumbClicked = function() {
            thumbClickedHelper(this);
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

          if (defaultImg) {
            thumbClickedHelper($("#" + imageId(defaultImg.index)));
            data[field.id] = {
              sx: defaultImg.sx,
              sy: defaultImg.sy,
              sWidth: defaultImg.sWidth
            }
          }

          imgCount += choices.length;
        } else if (field.type === "color") {
          var choices = card.choices[field.id] || [];

          var $partial = $(colorInputTemplate({
            id: field.id,
            label: field.label,
            colors: choices
          }));

          var $colors = $partial.find('.color')
            , defaultElmt = null;

          $colors.each(function(i, color) {
            if (defaultVal === i) {
              defaultElmt = color;
            }

            var $color = $(color);
            $color.css('background-color', $color.data('color'));
          });

          var clickHelper = function(elmt) {
            $colors.removeClass('selected');
            $(elmt).addClass('selected');
            data[field.id] = $(elmt).css('background-color');
          }

          if (defaultElmt) {
            clickHelper(defaultElmt);
          }

          $colors.click(function() {
            clickHelper(this);
            redraw();
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

      console.log(JSON.stringify(data, null, 2));

      TemplateRenderer.draw(data);
    }

    function save() {
      var requestData = $.extend(true, {}, data);

      var imageFields = TemplateRenderer.imageFields();

      dereferenceImages(imageFields, requestData, function() {
        $.ajax({
          url: serviceUrl + '/cards/' + cardId + '/data',
          method: 'PUT',
          data: JSON.stringify(requestData),
          contentType: 'application/json',
          success: function(data) {
            window.open(serviceUrl + '/cards/' + cardId + '/render');
          }
        });
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

        delete fieldData['image'];
        delete fieldData['imageId'];
        delete fieldData['url'];

        // TODO: HACK
        if (imgSrc.startsWith('data')) {
          var origFile = $('#' + field['id'] + ' .image-upload-input')[0].files[0];
          var formData = new FormData();
          formData.append('image', origFile);

          $.ajax({
            url: serviceUrl + '/images',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
              fieldData['url'] = data['url'];
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

      TemplateRenderer.draw(data);
    }

    function imageContains(imageField, e) {
      var minX = imageField.x
        , minY = imageField.y
        , maxX = minX + imageField.width
        , maxY = minY + imageField.height;

      var mouseX = e.pageX - $canvas[0].offsetLeft;
      var mouseY = e.pageY - $canvas[0].offsetTop;
      var contains = false;

      contains =  mouseX >= minX &&
                  mouseX <= maxX &&
                  mouseY >= minY &&
                  mouseY <= maxY;

      return {
        x: mouseX,
        y: mouseY,
        contains: contains
      };
    }

    function setupCardInterface() {
      buildInputs();
      $('#SaveBtn').removeClass('hidden');
      $('#SaveBtn').click(save);

      // Image panning
      $canvas.mousedown(function(e) {
        $.each(TemplateRenderer.imageFields(), function(i, imageField) {
          var containsResult = imageContains(imageField, e);

          if (containsResult.contains) {
            dragState = {
              'x': containsResult.x,
              'y': containsResult.y,
              'item': imageField['id']
            };

            return false;
          }
        });

        redraw();
      });

      $canvas.on('mousemove', updateDrag);

      $canvas.mouseup(function(e) {
        dragState = false;
      });

      // Wait until images load
      $('#GeneratorControls img')
        .one('load', redraw)
        .each(function() {
          if (this.complete) $(this).load();
        });
    }

    $('#TemplateParams').submit(function() {
      var taxonId = $(this).find('.taxon-id').val();

      // TODO: basic format validation ([0-9]+, etc)

      $.ajax({
        url: serviceUrl + '/cards',
        data: JSON.stringify({
          templateName: 'trait',
          templateParams: {
            speciesId: taxonId
          }
        }),
        contentType: 'application/json',
        method: 'POST',
        success: function(data) {
          card = data;
          cardId = data.id;
          setupCardInterface();
        }
      })

      return false;
    })
  });
});
