window.CardEditor = (function() {
  var exports = {};

  var apiPath = '/card_maker_ajax'
    , card
    ;

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

  var renderer =
    new TemplateRenderer(templateSupplier, canvasSupplier, imageFetcher);

  function setCard(theCard) {
    card = theCard;

    if (card.data == null) {
      card.data = {}
    }

    data = card.data;
    cardId = card.id;

    renderer.setCard(card, function(err) {
      if (err) throw err;
      $canvas = $(renderer.getCanvas());

      renderer.draw(function(err, canvas) {
        if (err) {
          console.log(err); // TODO: better handling
        } else {
          $canvas.removeClass('hidden');
        }
      });
    });
  }
  exports.setCard = setCard;

  function setupZoomWidget() {
    var $zoomKnob = $('#ZoomKnob')
      , $zoomStem = $('#ZoomStem')
      , $zoomPct = $('#ZoomPct')
      , $zoomPlus = $('#ZoomPlus')
      , $zoomMinus = $('#ZoomMinus')
      , maxPct = 100
      , minPct = 1
      , pct
      ;

    var maxTop = $zoomStem.innerHeight() - $zoomKnob.outerHeight(true) + minPct;

    function setPctTxt() {
      $('#ZoomPct').html(pct + '%');
    }

    function setKnobTop() {
      $zoomKnob.css('top', topFromPct(pct));
    }

    function setPctFromTop(top) {
      pct = Math.round((maxTop - top) * 100.0 / maxTop);
      setPctTxt();
    }

    function topFromPct() {
      return -1 * ((pct * maxTop / 100) - maxTop);
    }

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
        setPctTxt();
      }
    });

    $zoomMinus.click(function() {
      if (pct > minPct) {
        pct -= 1;
        setKnobTop();
        setPctTxt();
      }
    });

    setPctFromTop(parseInt($zoomKnob.css('top')));
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

  $(function() {
    $(document).scroll(setPreviewTopMargin);
    setupZoomWidget();
  });

  return exports;
})();
