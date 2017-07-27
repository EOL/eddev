window.CardEditor = (function() {
  var exports = {};

  var apiPath = '/card_maker_ajax'
    , cardWrapper
    , imageControls
    , cardForm
    , closeCb
    , canvas
    , defaultWidth = 240
    , defaultHeight = 336
    ;

  var previewThumbTemplate;

  // http://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas/15666143#15666143
  var pixelRatio = (function () {
    var ctx = document.createElement('canvas').getContext('2d'),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
  })();

  /*
   * Template supplier for TemplateRenderer
   */
  var templateSupplier = {
    supply: function(templateName, cb) {
      $.getJSON(apiPath + '/templates/trait', function(data) {
        cb(null, data);
      })
        .fail(function() {
          cb(new Error('Failed to retrieve template'));
        });
    }
  };

  /*
   * Canvas supplier for TemplateRenderer
   */
  var canvasSupplier = {
    drawingCanvas: function(width, height) {
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;

      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      canvas.getContext('2d').setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      return canvas;
    },
    transformCanvas: function(width, height) {
      var $canvas = $('<canvas>');
      $canvas.attr('width', width);
      $canvas.attr('height', height);

      return $canvas[0];
    }
  }

  /*
   * Image fetcher for TemplateRenderer
   */
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

  var cardDataPersistence = {
    save: function(card, cb) {
      var url = apiPath + '/cards/' + card.id + '/save';

      $.ajax({
        url: url,
        method: 'PUT',
        data: JSON.stringify({ data: card.data, userData: card.userData }),
        contentType: 'application/json',
        success: function() {
          cb()
        },
        error: function() {
          //TODO: log error?
          cb(new Error('Failed to save card'));
        }
      });
    }
  };

  var imageUploader = {
    upload: function(file, cb) {
      var url = apiPath + '/images';

      $.ajax({
        url: url,
        method: 'POST',
        data: file,
        contentType: 'application/octet-stream',
        processData: false,
        success: function(data) {
          cb(null, data);
        },
        error: function() {
          cb(new Error('Failed to upload image'));
        }
      });
    }
  }

  CardWrapper.setTemplateSupplier(templateSupplier);
  CardWrapper.setDataPersistence(cardDataPersistence);

  CardForm.setImageUploader(imageUploader);

  var renderer =
    new TemplateRenderer(canvasSupplier, imageFetcher);

  function clearCanvas() {
    var ctx = canvas.getContext('2d');

    canvas.width = defaultWidth;
    canvas.height = defaultHeight

    canvas.style.width = defaultWidth + 'px';
    canvas.style.height = defaultHeight + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function draw() {
    renderer.draw(cardWrapper, function(err) {
      if (err) console.log(err);
    });
  }

  function handleDirtyChange(val) {
    if (val) {
      enableSave();
    } else {
      disableSave();
    }
  }

  function setCard(theCard) {
    CardWrapper.newInstance(theCard, function(err, instance) {
      if (err) {
        throw err; // TODO: ???
      }

      cardWrapper = instance;
      imageControls.setCard(cardWrapper);
      cardForm.setCard(cardWrapper);

      cardWrapper.change(draw);
      cardWrapper.dirtyChange(handleDirtyChange);

      disableSave();
      clearCanvas(); // don't show last drawn card
      draw();
    });
  }
  exports.setCard = setCard;

  function setPreviewTopMargin() {
    var scrollTop = $(this).scrollTop()
      , $preview = $('#Preview')
      , $col = $('#LeftCol')
      , $colHead = $('#LeftColHeadBox')
      , colOffsetTop = $col.offset().top
      , colViewOffset = colOffsetTop - scrollTop
      , colHeadHeight = $colHead.outerHeight()
      , colHeight = $col.outerHeight()
      , innerColViewOffset = colViewOffset + colHeadHeight
      , previewHeight = $preview.outerHeight()
      , top
      , position
      ;

    if (innerColViewOffset < 0) {
      if (colHeight - previewHeight < -colViewOffset) {
        position = 'absolute';
        top = colHeight - previewHeight;
      } else {
        position = 'fixed';
        top = 0;
      }
    } else {
      position = 'absolute';
      top = colHeadHeight;
    }

    $preview.css('position', position);
    $preview.css('top', top);
  }

  function close(cb) {
    closeCb = cb;
  }
  exports.close = close;

  function saveAndClose() {
    if (!cardWrapper.isDirty()) return;

    save(function(err) {
      if (err) console.log(err); // TODO: handle

      fireClose();
    });
  }

  function save(cb) {
    if (!cardWrapper.isDirty()) return cb(new Error('Card not saved because it is not dirty'));

    cardWrapper.save(function(err) {
      if (err) return cb(err)

      return cb();
    });
  }

  function fireClose() {
    var proceed = true;

    if (cardWrapper.isDirty()) {
      proceed = confirm('Are you sure you want to close? You will lose any unsaved changes.');
    }

    if (proceed && closeCb) {
      closeCb(cardWrapper.id());
    }
  }

  function disableSave() {
    $('.preview-btns .save, .preview-btns .save-exit').addClass('disabled');
  }

  function enableSave() {
    $('.preview-btns .save, .preview-btns .save-exit').removeClass('disabled');
  }

  $(function() {
    $(document).scroll(setPreviewTopMargin);

    imageControls = ImageControls.getInstance();
    cardForm = CardForm.getInstance();

    $('.preview-btns .close, #BackToManagerBtn').click(fireClose);
    $('.preview-btns .save').click(save.bind(null, function(err) {
      // TODO: handle error
    }));
    $('.preview-btns .save-exit').click(saveAndClose);

    canvas = $('#CardCanvas')[0];
  });

  return exports;
})();
