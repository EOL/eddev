window.CardForm = (function() {
  var exports = {};

  var instance = null;

  var imageUploader = null;

  function setImageUploader(uploader) {
    imageUploader = uploader;
  }
  exports.setImageUploader = setImageUploader;

  function getInstance() {
    if (instance === null) {
      if (imageUploader === null) {
        throw new Error('must set image uploader using setImageUploader');
      }

      instance = new CardForm(imageUploader);
    }

    return instance;
  }
  exports.getInstance = getInstance;

  function CardForm(imageUploader) {
    var that = this
      , card;

    // Handlebars
    Handlebars.registerPartial('labelTempl', $('#FieldLabelTempl').html());
    Handlebars.registerPartial('textField', $('#TextFieldTempl').html());
    Handlebars.registerPartial('imageField', $('#ImageFieldTempl').html());
    Handlebars.registerPartial('colorSchemeField', $('#ColorSchemeFieldTempl').html());
    Handlebars.registerPartial('labeledChoiceImageField', $('#LabeledChoiceImageFieldTempl').html());
    Handlebars.registerPartial('keyValListField', $('#KeyValListFieldTempl').html());

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

    function disableFields($exemptElmt) {
      var $disableOverlay = $('#CardFieldsWrap').children('.disable-overlay').first()
        , exemptZIndex = $exemptElmt.css('z-index');

      $disableOverlay.removeClass('hidden');
      $exemptElmt.css('z-index', parseInt($disableOverlay.css('z-index')) + 1);

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
      var enableFn = disableFields($fontSize)
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
        , $uploadBtn
        , $fileInput
        ;

      for (var i = 0; i < numThumbUrls; i++) {
        thumbUrls[i] = choices[i].thumbUrl;
      }

      $elmt = buildField('imageField', field, {
        thumbUrls: thumbUrls
      });

      $imgLib = $elmt.find('.img-lib');
      $imgLib.click(openImgLib.bind(null, field.id, choices));

      $uploadBtn = $elmt.find('.img-upload-btn');
      $fileInput = $elmt.find('.img-upload-file');

      $fileInput.click(function(e) {
        e.stopPropagation();
      });

      $fileInput.on('change', function() {
        var files = $fileInput[0].files
          , file = files[0]
          ;

        if (file) {
          imageUploader.upload(file, function(err, data) {
            if (err) {
              throw err;
            }

            card.wipeData(field.id);
            card.setDataAttr(field.id, 'url', data.url);
            card.setDataAttr(field.id, 'thumbUrl', data.thumbUrl);
          });
        }
      });

      $uploadBtn.click(function() {
        $fileInput.click();
        return false;
      });

      return $elmt;
    }

    function buildColorSchemeField(field) {
      var choices = card.getFieldChoices(field.id)
        , choiceTips = card.getFieldChoiceTips(field.id) || []
        , colorData = new Array(choices.length)
        , $elmt
        , $colorSchemeElmts
        ;

      for (var i = 0; i < choices.length; i++) {
        var tip = i < choiceTips.length ? choiceTips[i] : '&mdash;';

        colorData[i] = {
          colors: choices[i],
          tip: tip
        };
      }

      $elmt = buildFieldNoBorder('colorSchemeField', field, {
          colorSchemes: colorData
      });

      $colorSchemeElmts = $elmt.find('.color-scheme')

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

    function dropdownClicked() {
      var $that = $(this)
        , $drop = $that.find('.choices')
        , enableFn = disableFields($that)
        ;

      $that.addClass('open');
      $that.off('click', dropdownClicked);

      $(document).one('click', function() {
        $that.removeClass('open');
        enableFn();
        $that.click(dropdownClicked);
      });

      return false;
    }

    function buildLabeledChoiceImageField(field) {
      var choices = card.getFieldChoices(field.id)
        , noChoiceIndexVal = -1
        , choiceIndex = card.getChoiceIndex(field.id, noChoiceIndexVal)
        , labels = choices.map(function(choice) {
            return choice.label;
          })
        , $elmt = buildField('labeledChoiceImageField', field, {
            labels: labels
          })
        , $options = $elmt.find('.choices')
        , $choiceElmts = $options.find('.choice')
        , $txt = $elmt.find('.selected-txt')
        , $drop = $elmt.find('.labeled-choice-drop')
        , $selected
        ;

      $selected = $choiceElmts.filter('[data-index="' + choiceIndex +'"]');
      $txt.html($selected.data('text'));

      $choiceElmts.click(function() {
        var $that = $(this)
          , newChoiceIndex = $that.data('index')
          ;

        if (newChoiceIndex === noChoiceIndexVal) {
          newChoiceIndex = null;
        }

        card.setChoiceIndex(field.id, newChoiceIndex);

        $txt.html($that.data('text'));
      });

      $drop.click(dropdownClicked);

      return $elmt;
    }

    function buildKeyValListField(field) {
      var fieldDatas = new Array(field.max)
        , cardDatas = card.getFieldValue(field)
        , $elmt = buildField('keyValListField', field, { fieldDatas: [] })
        , curKey
        , curVal
        , curCardData
        , $keyValInputs
        , $keyValRows
        ;

      for (var i = 0; i < fieldDatas.length; i++) {
        curKey = '';
        curVal = '';

        if (i < cardDatas.length) {
          curCardData = cardDatas[i];
          curKey = curCardData.key.text;
          curVal = curCardData.val.text;
        }

        fieldDatas[i] = { key: curKey, val: curVal };
      }

      $elmt = buildField('keyValListField', field, { fieldDatas: fieldDatas });
      $keyValInputs = $elmt.find('.key-val-field');
      $keyValRows = $elmt.find('.key-val-row');

      $keyValInputs.keyup(function() {
        var $that = $(this)
          , keyOrVal = $that.hasClass('key') ? 'key' : 'val'
          , index = $that.parent('.key-val-row').data('index')
          , value = $that.val()
          ;

        card.setKeyValText(field.id, keyOrVal, index, value);
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
          case 'labeled-choice-image':
            $elmt = buildLabeledChoiceImageField(field);
            break;
          case 'key-val-list':
            $elmt = buildKeyValListField(field);
            break;
          default:
            console.log(field, 'type not recognized');
        }

        if ($elmt) {
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
