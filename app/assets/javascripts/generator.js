$(function() {
  var card = null;
  var data = null;
  var cardId = null; // Card service id for card - populated after first save
  var serviceUrl = "http://localhost:8080";
  var dragState = false;
  var $inputs = $('#GeneratorControls');
  var $canvas = null;

  // http://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas/15666143#15666143
  var pixelRatio = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
  })();

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

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;

      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      canvas.getContext("2d").setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      return canvas;
    }
  }

  var imageFetcher = {
    fetch: function(url, cb) {
      var img = new Image()
        , $img = $(img);

      $img.on('load', function() {
        cb(null, img)
      });
      $img.on('error', function() {
        cb(new Error("Failed to load image for url " + url));
      });
      $img.attr({
        src: url
      });
    }
  }

  TemplateRenderer.setTemplateSupplier(templateSupplier);
  TemplateRenderer.setCanvasSupplier(canvasSupplier);
  TemplateRenderer.setImageFetcher(imageFetcher);

  function imageId(fieldId, i) {
    return fieldId + '-' + i;
  }

  // Construct UI inputs
  function buildInputs() {
    var fields  = TemplateRenderer.editableFields();

    $inputs.empty();

    $.each(fields, function(i, field) {
      console.log(field);
      // TODO: remove field.value hack
      var fieldDefault = field.value != null ? field : card.defaultData[field.id]
        , choices = card.choices[field.id] || []
        , choiceIndex = fieldDefault.choiceIndex
        , defaultVal = null
        ;

      if (fieldDefault) {
        defaultVal = fieldDefault.value != null ?
                     fieldDefault.value :
                     choices[choiceIndex];
      }

      if (field.type === 'text') {
        buildTextInput(field, defaultVal);
      } else if (field.type === 'image') {
        buildImageInput(field, choices, choiceIndex);
      } else if (field.type === 'color') {
        buildColorInput(field, choices, choiceIndex);
      } else {
        console.log('unable to construct field: ' + JSON.stringify(field));
      }
    });
  }

  function buildColorInput(field, choices, choiceIndex) {
    var $partial = $(colorInputTemplate({
          id: field.id,
          label: field.label,
          colors: choices
        }))
      , $colors = $partial.find('.color')
      ;

    $colors.each(function(i, color) {
      var $color = $(color);
      $color.css('background-color', $color.data('color'));
    });

    var clickHelper = function(elmt) {
      $colors.removeClass('selected');
      $(elmt).addClass('selected');
      data[field.id] = {
        choiceIndex: $(elmt).data('index')
      }
    };

    if (choiceIndex != null) {
      clickHelper($colors[choiceIndex]);
    }

    $colors.click(function() {
      clickHelper(this);
      redraw();
    });

    $inputs.append($partial);
  }

  function buildTextInput(field, defaultVal) {
    var $partial = $(textInputTemplate({
          id: field.id,
          label: field.label
        }))
      , $input = $partial.find('input')
      ;

      var setDataValue = function() {
        data[field.id] = {
          value: $input.val()
        }
      }

      if (defaultVal) {
        $input.val(defaultVal);
        setDataValue();
      }

      $input.keyup(function() {
        setDataValue();
        redraw();
      });

      $inputs.append($partial);
  }

  function updateImageSDimension(fieldId, propName, incr) {
    var oldVal = data[fieldId].value[propName];
    oldVal = oldVal != null ? oldVal : 0;

    data[fieldId].value.sWidth -= 20;
  }

  function updateZoomLevel(fieldId, incr) {
    var oldVal = 0;

    data[fieldId].value = data[fieldId].value || {};

    if (data[fieldId].value.zoomLevel != null) {
      oldVal = data[fieldId].value.zoomLevel;
    }

    data[fieldId].value.zoomLevel = oldVal + incr;
  }

  function buildImageInput(field, choices, choiceIndex) {
    var images = new Array(choices.length)
      , $partial = null
      , $partial = null
      , $selector = null
      , $field = null
      , $fileInput = null
      , $previewContainer = null
      , $zoomControls = null
      , $zoomPlus = null
      , $zoomMinus = null
      ;

    $.each(choices, function(i, choice) {
      images[i] = {
        src: choice.url,
        index: i
      }
    });

    $partial = $(imageInputTemplate({
      id: field.id,
      label: field.label,
      images: images
    }));

    $selector = $partial.find('.img-selector');
    $field = $partial.find('.image-input');
    $fileInput = $partial.find('.image-upload-input');
    $previewContainer = $partial.find('.upload-preview');

    var thumbClickedHelper = function(elmt) {
      $partial.find('.thumb').removeClass('selected');
      $(elmt).addClass('selected');
      data[field.id] = {
        choiceIndex: $(elmt).data('index'),
        value: {
          panX: 0,
          panY: 0,
          zoomLevel: 0
        }
      };
    };

    var thumbClicked = function() {
      thumbClickedHelper(this);
      redraw();
    };

    $fileInput.change(function() {
      var fileReader = null
        , $thumb = null;

      $previewContainer.empty();

      if (this.files.length) {
        fileReader = new FileReader();
        fileReader.readAsDataURL(this.files[0]);

        fileReader.onload = function(e) {
          $thumb = $('<img class="thumb" src="' + e.target.result + '">');
          $thumb.click(thumbClicked);
          $previewContainer.append($thumb);
          thumbClickedHelper($thumb);
        }
      }
    });

    $selector.find('.thumb').click(thumbClicked);

    $zoomControls = $partial.find('.zoom-controls');
    $zoomPlus     = $zoomControls.find('.fa-plus-circle');
    $zoomMinus    = $zoomControls.find('.fa-minus-circle');

    $zoomPlus.click(function(){
      updateZoomLevel(field.id, 1);
      redraw();
    });

    $zoomMinus.click(function() {
      updateZoomLevel(field.id, -1);
      redraw();
    })

    $inputs.append($partial);

    if (choiceIndex != null) {
      thumbClickedHelper($partial.find('.thumb')[choiceIndex]);
    }
  }

  function redraw() {
    var data = card.data;
    console.log(data);
    console.log('redraw');
    TemplateRenderer.draw(function(err, canvas) {
      console.log('drew')
      if (err) {
        console.log(err);
      } else {
        console.log('draw success');
      }
    });
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

    data[dragState['item']].value.panX -= dx;
    data[dragState['item']].value.panY -= dy;

    dragState['x'] = mouseX;
    dragState['y'] = mouseY;

    redraw();
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
    $('#SaveBtn').off('click', save);
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
      success: function(resp) {
        card = resp;

        if (card.data == null) {
          card.data = {}
        }

        data = card.data;

        cardId = data.id;
        TemplateRenderer.setCard(card, function(err) {
          if (err) throw err;
          $canvas = $(TemplateRenderer.getCanvas());
          setupCardInterface();
        });
      }
    })
    return false;
  });
});
