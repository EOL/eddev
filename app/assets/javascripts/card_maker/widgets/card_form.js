window.CardForm = (function() {
  var exports = {};

  var instance = null;

  var imageUploader = null;

  // Handlebars
  var fieldTempl
    , fieldSepTempl
    , imgLibTempl
    , thumbSpinTempl
    , suggestionsTempl
    ;

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
      , card
      , imgSrcProp = 'imageSource'
      , srcUpload = 'upload'
      , srcLib = 'lib'
      , srcUrl = 'url'
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
      return Util.disablePage($exemptElmt);
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

    function buildTextFieldHelper(field, partialName) {
      var $elmt
        , $txtInput
        , $fontSize
        , fontSizes
        , $fontSizeSelect
        , fieldValue = card.resolvedFieldData(field)
        , $disableOverlay
        , curFontSize
        , choices = card.getFieldChoices(field.id)
        , menu
        ;

      if (field.fontSizes) {
        fontSizes = field.fontSizes.map(function(sz) {
          return { value: sz, selected: sz === fieldValue.fontSz };
        });
      } else {
        fontSizes = [];
      }

      $elmt = buildField(partialName, field, {
        fontSizes: fontSizes,
        choices: choices
      });
      $txtInput = $elmt.find('.text-entry');
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

      $txtInput.on('input', function() {
        card.setDataAttr(field.id, 'text', $(this).val());
      });

      if (choices) {
        menu = new SuggestionMenu(choices.map(function(choice) {
          return choice.text;
        }));

        $elmt.find('.text-input-btn').click(function() {
          var enableFn = disableFields($elmt.find('.text-input-wrap'));

          menu.show($(this));

          menu.select(function(val) {
            $txtInput.val(val);
            $txtInput.trigger('input');
          });

          $(document).one('click', function() {
            enableFn();
            menu.hide();
          });

          return false;
        });
      }

      return $elmt;
    }

    function buildTextField(field) {
      return buildTextFieldHelper(field, 'textField');
    }

    function buildMultilineTextField(field)  {
      return buildTextFieldHelper(field, 'multilineTextField');
    }

    function openImgLib(fieldId, $field, choices, $creditInput) {
      var $cols = $('#Cols')
        , $imgLib
        , enableFn
        ;

      $('body').addClass('noscroll');

      $imgLib = $(imgLibTempl({ choices: choices }));
      $imgLib.find('.img-lib-thumb').click(function() {
        removeThumbSelected($field);
        card.setChoiceIndex(fieldId, $(this).data('index'));
        setCreditValFromCard(fieldId, $creditInput);
      });

      $cols.append($imgLib);

      enableFn = Util.disablePage($imgLib)

      $(document).click(function() {
        $imgLib.remove();
        enableFn();
        $('body').removeClass('noscroll');
      });

      return false;
    }

    function removeThumbSelected($elmt) {
      $elmt.find('.thumb').removeClass('selected');
    }

    function setImgData(fieldId, data, $creditInput, bucket) {
      card.setUserDataAttr(fieldId, bucket, 'url', data.url);
      card.setUserDataAttr(fieldId, bucket, 'thumbUrl', data.url);
      card.setUserDataRef(fieldId, bucket);
      $creditInput.val('');
    }

    function setImgDataSrc(fieldId, type) {
      card.setUserDataRef(fieldId, type);
    }

    function setCreditValFromCard(fieldId, $creditInput) {
      var creditText = card.getDataAttr(fieldId, 'credit', {}).text || '';

      $creditInput.val(creditText);
    }

    function restoreThumb(fieldId, $thumb, bucket) {
      var thumbUrl = card.getUserDataAttr(fieldId, bucket, 'thumbUrl')
        , userDataRef = card.getUserDataRef(fieldId)
        ;

      if (thumbUrl) {
        $thumb.find('.img').attr('src', thumbUrl);
        $thumb.removeClass('hidden');

        if (userDataRef === bucket) {
          $thumb.addClass('selected');
        }
      } else {
        $thumb.addClass('hidden');
      }
    }

    function restoreUploadThumb(fieldId, $uploadThumb) {
      restoreThumb(fieldId, $uploadThumb, 'upload');
    }

    function restoreUrlField(fieldId, $urlThumb, $urlInput) {
      var url = card.getUserDataAttr(fieldId, 'fromUrl', 'url');

      restoreThumb(fieldId, $urlThumb, 'fromUrl');

      if (url) {
        $urlInput.val(url);
      }
    }

    function showThumbSpin($thumb) {
      var $spin = $(thumbSpinTempl())
        , $img = $thumb.find('.img')
        ;

      $thumb.removeClass('hidden');
      $img.addClass('hidden');
      $thumb.append($spin);

      return function() {
        $spin.remove();
        $img.removeClass('hidden');
      }
    }

    function imageFileInputChange(fieldId, $field, $fileInput, $previewThumb, $creditInput) {
      var files = $fileInput[0].files
        , file = files[0]
        , $previewThumbImg = $previewThumb.find('.img')
        , $spin = $(thumbSpinTempl())
        ;

      if (file) {
        $previewThumb.removeClass('hidden');
        $previewThumbImg.addClass('hidden');
        $previewThumb.append($spin);

        imageUploader.upload(file, function(err, data) {
          if (err) {
            throw err;
          }

          $previewThumb.data('urls', data);
          removeThumbSelected($field);
          setImgData(fieldId, data, $creditInput, 'upload');

          $previewThumb.addClass('selected');

          $previewThumbImg.attr('src', data.thumbUrl);
          $spin.remove();
          $previewThumbImg.removeClass('hidden');
        });
      }
    }

    function loadImgFromUrl(fieldId, $field, $imgUrlInput, $urlPreviewThumb, $error,
      $creditInput) {
      var url = $imgUrlInput.val()
        , $img = $urlPreviewThumb.find('.img')
        , showImgFn
        ;

      if (url) {
        showImgFn = showThumbSpin($urlPreviewThumb);

        $error.addClass('hidden');


        $img.one('load', function() {
          $img.off();
          showImgFn();
          setImgData(fieldId, {url: url, thumbUrl: url}, $creditInput, 'fromUrl');
          thumbSelect(fieldId, $field, $urlPreviewThumb, $creditInput, 'fromUrl');
        });

        $img.one('error', function(e) {
          $img.off();
          $error.removeClass('hidden');
          showImgFn();
          restoreUrlField(fieldId, $urlPreviewThumb, $imgUrlInput)
        });

        $img.attr('src', url);
      }
    }

    function thumbSelect(fieldId, $field, $thumb, $creditInput, type) {
      if (!$thumb.hasClass('selected')) {
        removeThumbSelected($field);
        $thumb.addClass('selected');
        setImgDataSrc(fieldId, type);
        setCreditValFromCard(fieldId, $creditInput);
      }
    }

    function buildImageField(field) {
      var choices = card.getFieldChoices(field.id)
        , numThumbUrls = Math.min(3, choices.length)
        , thumbUrls = new Array(numThumbUrls)
        , $elmt
        , $imgLib
        , $uploadBtn
        , $fileInput
        , $previewThumb
        , $urlPreviewThumb
        , $creditInput
        , $urlInput
        , $urlBtn
        , $urlError
        , uploadedImgData
        , curImgSrc
        , creditText
        ;

      for (var i = 0; i < numThumbUrls; i++) {
        thumbUrls[i] = choices[i].thumbUrl;
      }

      $elmt = buildField('imageField', field, {
        thumbUrls: thumbUrls
      });

      $uploadBtn = $elmt.find('.img-upload-btn');
      $fileInput = $elmt.find('.img-upload-file');
      $previewThumb = $elmt.find('.upload-img-preview');
      $urlPreviewThumb = $elmt.find('.url-img-preview');
      $creditInput = $elmt.find('.img-credit-input');
      $urlInput = $elmt.find('.img-url-input');
      $urlBtn = $elmt.find('.img-url-btn');
      $urlError = $elmt.find('.img-url-error');

      $imgLib = $elmt.find('.img-lib');
      $imgLib.click(openImgLib.bind(null, field.id, $elmt, choices,
        $creditInput));

      $fileInput.click(function(e) {
        e.stopPropagation();
      });

      $fileInput.on('change',
        imageFileInputChange.bind(null, field.id, $elmt, $fileInput, $previewThumb,
          $creditInput)
      );

      $uploadBtn.click(function() {
        $fileInput.click();
        return false;
      });

      $previewThumb.click(thumbSelect.bind(null, field.id, $elmt, $previewThumb,
        $creditInput, 'upload'));
      $urlPreviewThumb.click(thumbSelect.bind(null, field.id, $elmt, $urlPreviewThumb,
        $creditInput, 'fromUrl'));

      $creditInput.on('input', function() {
        card.setDataAttr(field.id, 'credit', { text: $(this).val() });
      });

      $urlBtn.click(loadImgFromUrl.bind(null, field.id, $elmt, $urlInput,
        $urlPreviewThumb, $urlError, $creditInput));

      restoreUploadThumb(field.id, $previewThumb);
      restoreUrlField(field.id, $urlPreviewThumb, $urlInput);
      setCreditValFromCard(field.id, $creditInput);

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
        , cardDatas = card.resolvedFieldData(field)
        , fieldChoices = card.getFieldChoices(field.id)
        , $elmt = buildField('keyValListField', field, { fieldDatas: [] })
        , curKey
        , curVal
        , curCardData
        , $keyValInputs
        , $keyInputs
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
      $keyInputs = $keyValInputs.filter('.key');
      $keyValRows = $elmt.find('.key-val-row');

      $keyValInputs.on('input', function() {
        var $that = $(this)
          , keyOrVal = $that.hasClass('key') ? 'key' : 'val'
          , index = $that.parent('.key-val-row').data('index')
          , value = $that.val()
          ;

        card.setKeyValText(field.id, keyOrVal, index, value);
      });

      if (fieldChoices) {
        suggestions = new SuggestionMenu(fieldChoices);

        $keyInputs.focus(function() {
          var $that = $(this)
            , enableFn
            ;

          suggestions.select(function(val) {
            $that.val(val);
            $that.triggerHandler('input');
            $that.blur();
          });

          suggestions.show($that);

          $that.one('blur', function() {
            suggestions.hide();
          });
        });
      }

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
          case 'multiline-text':
            $elmt = buildMultilineTextField(field);
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

  function SuggestionMenu(items) {
    var that = this
      , $elmt = $(suggestionsTempl({items: items}))
      , selectCb
      , $items = $elmt.find('.item')
      , $arrow = $elmt.find('.arrow')
      , arrowHeight = 20
      , extraTopSpace = 5
      , enableFn
      ;

    function show($anchor) {
      var $cardFields = $('#CardFields')
        , cardFieldsOffset = $cardFields.offset()
        , cardFieldsTop = cardFieldsOffset.top
        , anchorOffset = $anchor.offset()
        , anchorTop = anchorOffset.top
        , anchorHeight = $anchor.outerHeight()
        , anchorLeftRel = anchorOffset.left - cardFieldsOffset.left
        , anchorWidth = $anchor.outerWidth()
        , menuBorder = 3
        , arrowLeft = anchorLeftRel + anchorWidth / 2 - menuBorder
        , top = anchorTop - cardFieldsTop + anchorHeight + arrowHeight + extraTopSpace
        ;

      $items.mousedown(function(e) {
        e.preventDefault();
      });

      $items.click(function() {
        fireSelect($(this).html());
      });

      $elmt.css('top', top);
      $arrow.css('left', arrowLeft);

      $cardFields.append($elmt);
      enableFn = Util.disablePage($anchor, $elmt);
    }
    that.show = show;

    function hide() {
      $elmt.remove();
      enableFn();
    }
    that.hide = hide;

    function select(cb) {
      selectCb = cb;
    }
    that.select = select;

    function fireSelect(val) {
      if (selectCb) {
        selectCb(val);
      }
    }
  }

  $(function() {
    Handlebars.registerPartial('labelTempl', $('#FieldLabelTempl').html());
    Handlebars.registerPartial('textField', $('#TextFieldTempl').html());
    Handlebars.registerPartial('multilineTextField', $('#MultilineTextFieldTempl').html());
    Handlebars.registerPartial('imageField', $('#ImageFieldTempl').html());
    Handlebars.registerPartial('colorSchemeField', $('#ColorSchemeFieldTempl').html());
    Handlebars.registerPartial('labeledChoiceImageField', $('#LabeledChoiceImageFieldTempl').html());
    Handlebars.registerPartial('keyValListField', $('#KeyValListFieldTempl').html());
    Handlebars.registerPartial('fontSizeInner', $('#FontSizeInnerTempl').html());

    fieldTempl = Handlebars.compile($('#FieldTempl').html());
    fieldSepTempl = Handlebars.compile($('#FieldSepTempl').html());
    imgLibTempl = Handlebars.compile($('#ImageLibTempl').html());
    thumbSpinTempl = Handlebars.compile($('#ThumbSpinTempl').html());
    suggestionsTempl = Handlebars.compile($('#SuggestionsTempl').html());
  });

  return exports;
})();
