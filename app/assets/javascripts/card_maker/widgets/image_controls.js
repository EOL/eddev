window.ImageControls = (function() {
  var exports = {};

  var instance = null;

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
      , selectedImgId
      , dragArea
      , pct
      , previewThumbTemplate
      , cardWrapper
      , fieldIdsToThumbs = {}
      ;

    function updatePctTxt() {
      $zoomPct.html(pct + '%');
    }

    function updatePct() {
      cardWrapper.setDataAttr(selectedImgId, 'zoomLevel', pct - zoomLevelOffset);
      updatePctTxt();
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
        , panX = cardWrapper.getDataAttr(selectedImgId, 'panX', 0)
        , panY = cardWrapper.getDataAttr(selectedImgId, 'panY', 0)
        ;

      if (!selectedImageContains(clickEvent)) {
        return;
      }

      function moveHandler(e) {
        cardWrapper.setDataAttr(selectedImgId, 'panX', panX + clickEvent.pageX - e.pageX);
        cardWrapper.setDataAttr(selectedImgId, 'panY', panY + clickEvent.pageY - e.pageY);
      }

      function mouseupHandler() {
        $(document).off('mousemove', moveHandler);
        $(document).off('mouseup', mouseupHandler);
      }

      $(document).mousemove(moveHandler);
      $(document).mouseup(mouseupHandler);
    }

    function setupThumbs() {
      var imgFields = cardWrapper.imageFields()
        , $thumbs = $('#PreviewImgSelect')
        ;

      $thumbs.empty();

      fieldIdsToThumbs = {};

      for (var i = 0; i < imgFields.length; i++) {
        var field = imgFields[i]
          , val = cardWrapper.getFieldValue(field)
          , url = val.thumbUrl
          , $thumb = $(previewThumbTemplate({
              name: field.label,
              url: val.thumbUrl
            }));

        $thumb.find('.thumb').click(function() {
          thumbClicked(this, field.id);
        });

        fieldIdsToThumbs[field.id] = {
          src: url,
          $elmt: $thumb
        };

        $thumbs.append($thumb);

        if (i === 0) {
          thumbClicked($thumb.find('.thumb'), field.id);
        }
      }
    }

    function thumbClicked(elmt, id) {
      var $thumbsArea = $('#PreviewImgSelect')
        ;

      $thumbsArea.find('.thumb').removeClass('selected');
      $(elmt).addClass('selected');

      selectedImgId = id;

      setupForSelected();
    }

    function setupForSelected() {
      pct = cardWrapper.getDataAttr(selectedImgId, 'zoomLevel', 0) +
        zoomLevelOffset;

      dragArea = cardWrapper.getImageLocation(selectedImgId);

      $cardCanvas.off('click');
      $cardCanvas.mousedown(cardCanvasClicked);

      $cardCanvas.off('mousemove');
      $cardCanvas.mousemove(function(e) {
        if (selectedImageContains(e)) {
          $(this).css('cursor', 'move');
        } else {
          $(this).css('cursor', 'auto');
        }
      });

      updatePctTxt();
      setKnobTop();
    }

    function rotateClicked() {
      var rotation =
        (cardWrapper.getDataAttr(selectedImgId, 'rotate', 360) - 90) % 360;


      cardWrapper.setDataAttr(selectedImgId, 'rotate', rotation);
    }

    function setInverseImgBool(prop) {
      var curVal = cardWrapper.getDataAttr(selectedImgId, prop, false);
      cardWrapper.setDataAttr(selectedImgId, prop, !curVal);
    }

    function flipHorizClicked() {
      setInverseImgBool('flipHoriz');
    }

    function flipVertClicked() {
      setInverseImgBool('flipVert');
    }

    function fieldChanged(e) {
      var $thumbWrap
        , url
        ;

      if (e.field.type === 'image') {
        url = e.resolvedData.thumbUrl;
        thumb = fieldIdsToThumbs[e.field.id];

        if (thumb && thumb.src !== url) {
          thumb.$elmt.find('.thumb').attr('src', url);
          thumb.src = url;

          if (selectedImgId === e.field.id) {
            setupForSelected();
          }
        }
      }
    }

    this.setCard = function(theCardWrapper) {
      cardWrapper = theCardWrapper;
      cardWrapper.change(fieldChanged);
      setupThumbs();
    }

    // One-time event binding
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

    $('#ImgBtns .btn').mouseenter(function() {
      $('#ImgBtnLabel').html($(this).data('label'));
    });

    $('#ImgBtns .btn').mouseout(function() {
      $('#ImgBtnLabel').html('');
    })

    $('#RotateBtn').click(rotateClicked);
    $('#FlipHorizBtn').click(flipHorizClicked);
    $('#FlipVertBtn').click(flipVertClicked);

    // Handlebars templates
    previewThumbTemplate = Handlebars.compile($('#PreviewThumbTemplate').html());
  }

  exports.getInstance = function() {
    if (instance === null) {
      instance = new ImageControls();
    }

    return instance;
  }

  return exports;
})();
