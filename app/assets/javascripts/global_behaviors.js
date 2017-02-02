(function() {
  function slideMenuOpen() {
    var $bars = $('#BarsIcon'),
        $titleContainer = $('#TitleContainer'),
        $slideMenu = $('#SlideMenu'),
        $topbar = $('#Topbar'),
        topbarWidth = $topbar.outerWidth(),
        slideMenuWidth = $slideMenu.outerWidth(),
        targetWidth = 
          ((topbarWidth - slideMenuWidth) / topbarWidth) * 100 + '%';
    
    $bars.off('click');

    $titleContainer.animate({
      'width': targetWidth
    },
    function() {
      $bars.click(slideMenuClose);
    });
  } 

  function slideMenuClose() {
    var $bars = $('#BarsIcon'),
        $titleContainer = $('#TitleContainer');

    $bars.off('click');

    $titleContainer.animate({
      'width': '100%'
    }, 
    function() {
      $bars.click(slideMenuOpen);
    });
  }

  function closeMenuIfNecessary() {
    var transitionWidth = 525,
        $bars = $('#BarsIcon');

    if ($(window).width() > transitionWidth) {
      $('#TitleContainer').css('width', '100%');
      $bars.off('click');
      $bars.click(slideMenuOpen);
    }
  }

  $(function() {
    $('#BarsIcon').click(slideMenuOpen);
    $(window).resize(closeMenuIfNecessary);

    // Double-touch experience for hover elements
    $('.hoverable').on('touchstart', function(event) {
      var $that = $(this);

      if (!$that.hasClass('hover')) {
        // event.preventDefault() to prevent click from going through
        // breaks scrolling, so catch the click event that follows this
        // touchstart and preventDefault on THAT event
        $that.one('click', function(event) {
          event.preventDefault();
        });

        $that.addClass('hover');

        var removeHoverTouchFn = function(event) {
          if (!($(event.target).is($that) || $that.has($(event.target)).length)) {
            $that.removeClass('hover');
          }
        }

        $( 'body' ).on('touchstart', removeHoverTouchFn);
      }
    });
  });
})();
