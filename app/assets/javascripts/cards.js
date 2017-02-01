(function() {
  function scrollIfNecessary() {
    var hashParams = EolUtil.parseHashParams(),
        $deck = null;

    if (hashParams['scroll_to']) {
      $deck = $('#Deck' + hashParams['scroll_to']);
    }

    if ($deck) {
      $(window).scrollTop($deck.offset().top);
    }
  }

  $(function() {
    // hack for browsers like Chrome that try to restore
    // your scroll position
    setTimeout(scrollIfNecessary, 100); 
  });
})();
