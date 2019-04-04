window.EolUtil = {};

(function(exports) {
  // Parse parameters from url hash
  function parseHashParams() {
    var hash = window.location.hash,
        keyValPairs = null,
        params = {};

    if (hash) {
      hash = hash.replace('#', '');
      keyValPairs = hash.split('&');

      $.each(keyValPairs, function(i, pair) {
        var keyAndVal = pair.split('=');
        params[keyAndVal[0]] = keyAndVal[1]
      });
    }

    return params;
  }
  exports.parseHashParams = parseHashParams;

  function clearHash() {
    window.location.hash = '_';
  }
  exports.clearHash = clearHash;

  var fontsLoadedCallbackArr = [];
  function onFontsLoaded(fn) {
    fontsLoadedCallbackArr.push(fn);
  }
  exports.onFontsLoaded = onFontsLoaded;

  function fontsLoadedCallbacks() {
    return fontsLoadedCallbackArr;
  }
  exports.fontsLoadedCallbacks = fontsLoadedCallbacks;
})(window.EolUtil);
