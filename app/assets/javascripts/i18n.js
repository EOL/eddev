(function() {
  function I18n() {
    var that = this;

    function setTranslations(translations) {
      that.translations = flattenTranslations(translations);
    }
    that.setTranslations = setTranslations;

    function t(key) {
      if (key in that.translations) {
        return that.translations[key];
      } else {
        return key;
      }
    }

    function flattenTranslations(translations) {
      var transformed = {};

      $.each(Object.keys(translations), function(i, key) {
        var val = translations[key]
          , childResult
          ;

        // We only have to deal with object or string
        if (typeof val === 'object') {
          childResult = flattenTranslations(val);

          $.each(Object.keys(childResult), function(j, childKey) {
            transformed[key + '.' + childKey] = childResult[childKey];
          });
        } else {
          transformed[key] = val;
        }
      });

      return transformed;
    }
  }

  window.I18n = new I18n();
})();
