window.CardForm = (function() {
  var exports = {};

  var instance = null;

  function getInstance() {
    if (instance === null) {
      instance = new CardForm();
    }

    return instance;
  }
  exports.getInstance = getInstance;

  function CardForm() {
    var that = this
      , card;

    // Handlebars
    Handlebars.registerPartial('labelTempl', $('#FieldLabelTempl').html());
    Handlebars.registerPartial('textField', $('#TextFieldTempl').html());
    Handlebars.registerPartial('imageField', $('#ImageFieldTempl').html());
    Handlebars.registerPartial('colorSchemeField', $('#ColorSchemeFieldTempl').html());

    var fieldTempl = Handlebars.compile($('#FieldTempl').html())
      , fieldSepTempl = Handlebars.compile($('#FieldSepTempl').html())
      , imgLibTempl = Handlebars.compile($('#ImageLibTempl').html())
      ;

    function setCard(theCard) {
      card = theCard;
      rebuildFields();
    }
    that.setCard = setCard;

    function buildFieldHelper(templName, field, partialContext, noBorder) {
      return $(fieldTempl({
        fieldPart: function() { return templName },
        field: field,
        pc: partialContext,
        noBorder: noBorder
      }));
    }

    function buildField(templName, field, partialContext) {
      return buildFieldHelper(templName, field, partialContext, false);
    }

    function buildFieldNoBorder(templName, field, partialContext) {
      return buildFieldHelper(templName, field, partialContext, true);
    }

    function showFontSizeSelector($fontSizeSelect, $target) {
      $target.append($fontSizeSelect);
    }

    function disableField($fieldWrap, $exemptElmt) {
      var $disableOverlay = $fieldWrap.find('.disable-overlay')
        , exemptZIndex = $exemptElmt.css('z-index');

      $disableOverlay.removeClass('hidden');
      $exemptElmt.css('z-index', parseInt($disableOverlay.css('z-index') + 1));

      return function() {
        $exemptElmt.css('z-index', exemptZIndex);
        $disableOverlay.addClass('hidden');
      }
    }

    function bindFontSizeSelectEvents(fieldId, $fontSize, $fontSizeSelect) {
      var $fontSizeChoices = $fontSizeSelect.find('.font-size-option')
        , $origSelected = $fontSizeChoices.filter('.selected')
        ;


      $fontSizeChoices.mouseenter(function() {
        $fontSizeChoices.removeClass('selected');
        $(this).addClass('selected');
        setFontSizeVal(fieldId, $(this), $fontSize);
      });

      $fontSizeChoices.mouseout(function() {
        $(this).removeClass('selected');
        $origSelected.addClass('selected');
        setFontSizeVal(fieldId, $origSelected, $fontSize);
      });
    }

    function offFontSizeSelectEvents($fontSizeSelect) {
      $fontSizeSelect.off();
      $fontSizeSelect.find('*').off();
    }

    function setFontSizeVal(fieldId, $selectedOption, $fontSize) {
      var parsedSz = parseInt($selectedOption.html());

      card.setDataAttr(fieldId, 'fontSz', parsedSz);
      $fontSize.html(parsedSz);
    }

    function openFontSizeSelect(fieldId, $fieldWrap, $fontSize, $fontSizeSelect) {
      var enableFn = disableField($fieldWrap, $fontSize)
        , closeFn;

      bindFontSizeSelectEvents(fieldId, $fontSize, $fontSizeSelect);
      $fontSizeSelect.removeClass('hidden');
      $fontSize.addClass('active');

      closeFn = function() {
        offFontSizeSelectEvents($fontSizeSelect);
        closeFontSizeSelect(enableFn, $fontSize, $fontSizeSelect);
        $(document).off('click', closeFn);
      };

      $(document).click(closeFn);

      return false;
    }

    function closeFontSizeSelect(enableFn, $fontSize, $fontSizeSelect) {
      $fontSizeSelect.addClass('hidden');
      $fontSize.removeClass('active');
      enableFn();
    }

    function buildTextField(field) {
      var $elmt
        , $txtInput
        , $fontSize
        , fontSizes = []
        , $fontSizeSelect
        , fieldValue = card.getFieldValue(field)
        , $disableOverlay
        ;

      for (var i = field.minFontSz; i <= field.maxFontSz; i++) {
        fontSizes.push({
          value: i,
          selected: i === fieldValue.fontSz
        });
      }

      $elmt = buildField('textField', field, { fontSizes: fontSizes });
      $txtInput = $elmt.find('.text-input');
      $fontSize = $elmt.find('.font-size');
      $fontSizeSelect = $elmt.find('.font-size-select');

      if (fieldValue) {
        if (fieldValue.text) {
          $txtInput.val(fieldValue.text);
        }

        $fontSize.html(fieldValue.fontSz);
      }

      $fontSize.click(openFontSizeSelect.bind(
        null,
        field.id,
        $elmt,
        $fontSize,
        $fontSizeSelect
      ));

      $txtInput.keyup(function() {
        card.setDataAttr(field.id, 'text', $(this).val());
      });

      return $elmt;
    }

    function openImgLib(fieldId, choices) {
      var $cols = $('#Cols')
        , $imgLib
        , $disableOverlay = $cols.children('.disable-overlay')
        ;


      $disableOverlay.removeClass('hidden');
      $('body').addClass('noscroll');

      $imgLib = $(imgLibTempl({ choices: choices }));
      $imgLib.find('.img-lib-thumb').click(function() {
        card.setChoiceIndex(fieldId, $(this).data('index'));
      });

      $cols.append($imgLib);

      $(document).click(function() {
        $imgLib.remove();
        $('body').removeClass('noscroll');
        $disableOverlay.addClass('hidden');
      });

      return false;
    }

    function buildImageField(field) {
      var choices = card.getFieldChoices(field.id)
        , numThumbUrls = Math.min(3, choices.length)
        , thumbUrls = new Array(numThumbUrls)
        , $elmt
        , $imgLib
        ;

      for (var i = 0; i < numThumbUrls; i++) {
        thumbUrls[i] = choices[i].thumbUrl;
      }

      $elmt = buildField('imageField', field, {
        thumbUrls: thumbUrls
      });

      $imgLib = $elmt.find('.img-lib');
      $imgLib.click(openImgLib.bind(null, field.id, choices));

      return $elmt;
    }

    function buildColorSchemeField(field) {
      var choices = card.getFieldChoices(field.id)
        , $elmt = buildFieldNoBorder('colorSchemeField', field, {
            colorSchemes: choices
          })
        , $colorSchemeElmts = $elmt.find('.color-scheme')
        ;

      $colorSchemeElmts.each(function(i, colorScheme) {
        var $colorScheme = $(colorScheme);

        $colorScheme.css('background', $colorScheme.data('bg'));
        $colorScheme.css('color', $colorScheme.data('text'));
      });

      $colorSchemeElmts.click(function() {
        card.setChoiceIndex(field.id, $(this).data('index'));
      });

      return $elmt;
    }

    function rebuildFields() {
      var $cardFields = $('#CardFields')
        , fields = card.editableFields()
        , $elmt
        , field
        ;

      $cardFields.empty();

      for (var i = 0; i < fields.length; i++) {
        field = fields[i];
        $elmt = null;

        switch (field.type) {
          case 'text':
            $elmt = buildTextField(field);
            break;
          case 'image':
            $elmt = buildImageField(field);
            break;
          case 'color-scheme':
            $elmt = buildColorSchemeField(field);
            break;
          default:
            console.log(field, 'type not recognized');
        }

        if ($elmt !== null) {
          $cardFields.append($elmt);

          if (i < fields.length - 1) {
            $cardFields.append($(fieldSepTempl()));
          }
        }
      }
    }
  }

  return exports;
})();
