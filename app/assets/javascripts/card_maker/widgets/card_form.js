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

    var fieldTempl = Handlebars.compile($('#FieldTempl').html())
      , fieldSepTempl = Handlebars.compile($('#FieldSepTempl').html())
      ;

    function setCard(theCard) {
      card = theCard;
      rebuildFields();
    }
    that.setCard = setCard;

    function buildField(templName, field, partialContext) {
      return $(fieldTempl({
        fieldPart: function() { return templName },
        field: field,
        pc: partialContext
      }));
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
      var $elmt// = buildField('textField', field)
        , $txtInput// = $elmt.find('.text-input')
        , $fontSize// = $elmt.find('.font-size')
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
