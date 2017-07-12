window.Util = (function() {
  var exports = {};

  // HANDLEBARS
  var disableOverlayTempl;

  function disablePage() {
    return disableElmt($('#Page'), Array.prototype.slice.call(arguments), true);
  }
  exports.disablePage = disablePage;

  function disableElmt($elmt, exemptElmts, noscroll) {
    var $overlay = $(disableOverlayTempl())
      ;

    if (noscroll) {
      $('body').addClass('noscroll');
    }

    $elmt.prepend($overlay);

    for (var i = 0; i < exemptElmts.length; i++) {
      $exemptElmt = exemptElmts[i];
      $exemptElmt.data('origZIndex', $exemptElmt.css('z-index'));
      $exemptElmt.css('z-index', 100);
    }

    return function() {
      $('body').removeClass('noscroll');
      $overlay.remove();

      for (var i = 0; i < exemptElmts.length; i++) {
        $exemptElmt = exemptElmts[i];
        $exemptElmt.css('z-index', $exemptElmt.data('origZIndex'));
        $exemptElmt.data('origZIndex', null);
      }
    };
  }
  exports.disableElmt = disableElmt;

  $(function() {
    disableOverlayTempl = Handlebars.compile($('#DisableOverlayTemplate').html());
  });

  return exports;
})();
