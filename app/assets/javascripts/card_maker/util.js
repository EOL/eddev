window.Util = (function() {
  var exports = {};

  // HANDLEBARS
  var disableOverlayTempl;

  function disablePage() {
    var $overlay = $(disableOverlayTempl())
      , exemptElmts = arguments
      , $exemptElmt
      ;

    $('#Page').prepend($overlay);

    for (var i = 0; i < exemptElmts.length; i++) {
      $exemptElmt = exemptElmts[i];
      $exemptElmt.data('origZIndex', $exemptElmt.css('z-index'));
      $exemptElmt.css('z-index', 100);
    }

    return function() {
      $overlay.remove();

      for (var i = 0; i < exemptElmts.length; i++) {
        $exemptElmt = exemptElmts[i];
        $exemptElmt.css('z-index', $exemptElmt.data('origZIndex'));
        $exemptElmt.data('origZIndex', null);
      }
    };
  }
  exports.disablePage = disablePage;

  $(function() {
    disableOverlayTempl = Handlebars.compile($('#DisableOverlayTemplate').html());
  });

  return exports;
})();
