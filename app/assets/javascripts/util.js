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
})(window.EolUtil);

