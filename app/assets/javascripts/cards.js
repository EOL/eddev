//= require template_renderer/template-renderer
//= require generator

(function() {
  function scrollIfNecessary() {
    var hashParams = EolUtil.parseHashParams(),
        $deck = null
        marginTop = 0;

    if (hashParams['scroll_to']) {
      $deck = $('#Deck' + hashParams['scroll_to']);
    }

    if ($deck) {
      marginTop = $deck.css('margin-top').replace("px", "");
      $(window).scrollTop($deck.offset().top - marginTop);
    }
  }

  $(function() {
    // Wrapping in setTimout is a hack for browsers like Chrome that try to
    // restore your scroll position
    setTimeout(scrollIfNecessary, 100);
  });
})();
