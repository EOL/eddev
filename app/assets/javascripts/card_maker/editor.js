window.CardEditor = (function() {
  var exports = {};

  var apiPath = '/card_maker_ajax'
    , cardWrapper
    , imageControls
    ;

  // Handlebars (set onload)
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
    supply: function(width, height) {
      var $canvas = $('#CardCanvas'),
          canvas  = $canvas[0];

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;

      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      canvas.getContext('2d').setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      return canvas;
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

  CardWrapper.setTemplateSupplier(templateSupplier);

  var renderer =
    new TemplateRenderer(templateSupplier, canvasSupplier, imageFetcher);

  function setCard(theCard) {
    CardWrapper.newInstance(theCard, function(err, instance) {
      if (err) {
        throw err; // TODO: ???
      }

      cardWrapper = instance;

      renderer.setCard(theCard, function(err) {
        if (err) throw err;
        $canvas = $(renderer.getCanvas());

        setupThumbs();
        imageControls.setupForSelected();

        renderer.draw(function(err, canvas) {
          if (err) {
            console.log(err); // TODO: better handling
          } else {
            $canvas.removeClass('hidden');
          }
        });
      });
    });
  }
  exports.setCard = setCard;

  function selectedImgFieldId() {
    var $elmt = $('#PreviewImgSelect .thumb.selected')
      , id = null
      ;

    if ($elmt) {
      id = $elmt.data('field-id');
    }

    return id;
  }

  function setupThumbs() {
    var imgFields = renderer.imageFields()
      , $thumbs = $('#PreviewImgSelect')
      ;

    for (var i = 0; i < imgFields.length; i++) {
      var field = imgFields[i]
        , val = renderer.getFieldValue(field.id)
        , $thumb = $(previewThumbTemplate({
            name: field.label,
            url: val.url,
            fieldId: field.id
          }));

      $thumb.find('.thumb').click(function() {
        thumbClicked(this);
      });

      $thumbs.append($thumb);

      if (i === 0) {
        $thumb.find('.thumb').addClass('selected');
      }
    }
  }

  function thumbClicked(elmt) {
    var $thumbsArea = $('#PreviewImgSelect')
      ;

    $thumbsArea.find('.thumb').removeClass('selected');
    $(elmt).addClass('selected');

    imageControls.setupForSelected();
  }

  function ImageControls() {
    var $zoomControls = $('#ZoomControls')
      , $zoomKnob  = $('#ZoomKnob')
      , $zoomStem  = $('#ZoomStem')
      , $zoomPct   = $('#ZoomPct')
      , $zoomPlus  = $('#ZoomPlus')
      , $zoomMinus = $('#ZoomMinus')
      , $cardCanvas = $('#CardCanvas')
      , maxPct = 100
      , minPct = 1
      , zoomLevelOffset = 50
      , maxTop = $zoomStem.innerHeight() - $zoomKnob.outerHeight(true) + minPct
      , dragArea
      , pct
      ;

    function updatePctTxt() {
      $zoomPct.html(pct + '%');
    }

    function updatePct() {
      var selectedImgId = selectedImgFieldId();

      cardWrapper.setZoomLevel(selectedImgId, pct - zoomLevelOffset);
      updatePctTxt();

      redraw();
    }

    function setKnobTop() {
      $zoomKnob.css('top', topFromPct(pct));
    }

    function setPctFromTop(top) {
      pct = Math.round((maxTop - top) * 100.0 / maxTop);
      updatePct();
    }

    function topFromPct() {
      return -1 * ((pct * maxTop / 100.0) - maxTop);
    }

    $zoomControls.find('*').off();

    $zoomKnob.draggable({
      containment: $('#ZoomStem'),
      axis: 'y',
      drag: function(event, ui) {
        setPctFromTop(ui.position.top);
      }
    });

    $zoomPlus.click(function() {
      if (pct < maxPct) {
        pct += 1;
        setKnobTop();
        updatePct();
      }
    });

    $zoomMinus.click(function() {
      if (pct > minPct) {
        pct -= 1;
        setKnobTop();
        updatePct();
      }
    });

    function selectedImageContains(e) {
      var minX = dragArea.x
        , minY = dragArea.y
        , maxX = minX + dragArea.width
        , maxY = minY + dragArea.height
        , canvasOffset = $cardCanvas.offset()
        , mouseX
        , mouseY
        , cont
        ;

      mouseX = e.pageX - canvasOffset.left;
      mouseY = e.pageY - canvasOffset.top;

      contains =  mouseX >= minX &&
                  mouseX <= maxX &&
                  mouseY >= minY &&
                  mouseY <= maxY;

      return contains;
    }

    function cardCanvasClicked(clickEvent) {
      var $that = $(this)
        , selectedImgId = selectedImgFieldId()
        , panX = cardWrapper.getDataAttr(selectedImgId, 'panX', 0)
        , panY = cardWrapper.getDataAttr(selectedImgId, 'panY', 0)
        ;

      if (!selectedImageContains(clickEvent)) {
        return;
      }

      function moveHandler(e) {
        console.log(clickEvent.pageX, clickEvent.pageY, e.pageX, e.pageY);

        console.log(clickEvent.pageX - e.pageX);

        cardWrapper.setDataAttr(selectedImgId, 'panX', panX + clickEvent.pageX - e.pageX);
        cardWrapper.setDataAttr(selectedImgId, 'panY', panY + clickEvent.pageY - e.pageY);

        redraw();
      }

      function mouseupHandler() {
        $(document).off('mousemove', moveHandler);
        $(document).off('mouseup', mouseupHandler);
      }

      $(document).mousemove(moveHandler);

      $(document).mouseup(mouseupHandler);
    }

    this.setupForSelected = function() {
      var selectedImgId = selectedImgFieldId();

      pct = cardWrapper.getZoomLevel(selectedImgId) + zoomLevelOffset;

      dragArea = cardWrapper.getImageLocation(selectedImgId);

      $cardCanvas.off('click');
      $cardCanvas.mousedown(cardCanvasClicked);

      $(document).off('mousemove');
      $(document).mousemove(function(e) {
        if (selectedImageContains(e)) {
          $('html,body').css('cursor', 'move');
        } else {
          $('html,body').css('cursor', 'auto');
        }
      });

      updatePctTxt();
      setKnobTop();
    }
  }

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
      ;

    if (innerColViewOffset < 0) {
      top = Math.min(colViewOffset * -1, colHeight - previewHeight);
    } else {
      top = colHeadHeight;
    }

    $preview.animate({
      top: top
    }, 50);
  }

  function redraw() {
    renderer.draw(function(err) {
      if (err) {
        console.log(err);
      }
    });
  }

  $(function() {
    $(document).scroll(setPreviewTopMargin);

    previewThumbTemplate = Handlebars.compile($('#PreviewThumbTemplate').html());
    imageControls = new ImageControls();
  });

  return exports;
})();
