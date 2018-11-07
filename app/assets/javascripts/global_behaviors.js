(function() {
  var navMobileWidth = 648; // XXX: duplicated in CSS

  function setupSlideMenu() {
    var $page = $('#Page')
      , $toggle = $('.js-slide-menu-toggle')
      , $menu = $('.js-slide-menu')
      , menuWidth = $menu.outerWidth()
      , menuRight = -1 * menuWidth
      , slideMenuOpen = function() {
          var $fixed = fixedElmtsForSlideMenu();

          $toggle.off('click', slideMenuOpen);
          $toggle.click(slideMenuClose);
          $page.animate({
            left: menuRight
          }, { queue: false });
          $fixed.animate({
            left: menuRight
          }, { queue: false });
          $menu.animate({
            right: 0
          }, { queue: false });
          $('body').addClass('noscroll');
        }
      , slideMenuClose = function() {
          var $fixed = fixedElmtsForSlideMenu();

          $toggle.off('click', slideMenuClose);
          $toggle.click(slideMenuOpen);
          $page.animate({
            left: 0
          }, { queue: false });
          $fixed.animate({
            left: 0
          }, { queue: false });
          $menu.animate({
            right: menuRight
          }, { queue: false });
          $('body').removeClass('noscroll');
        }
      ;

    $toggle.click(slideMenuOpen);

    $(window).resize(function() {
      if ($(window).width() > navMobileWidth) {
        var $fixed = fixedElmtsForSlideMenu();

        $page.css({ left: 0 });
        $fixed.css({ left: 0 });
        $menu.css({ right: menuRight });
        $toggle.off('click', slideMenuClose);
        $toggle.click(slideMenuOpen);
        $('body').removeClass('noscroll');
      }
    });
  }

  function fixedElmtsForSlideMenu() {
    return $('.js-fixed').filter(function() {
      return $(this).css('position') === 'fixed';
    });
  }

  function setupLangMenus() {
    var $menu = $('.js-lang-menu')
      , openFn = function(e) {
          var $that = $(this)
            , closeFn = function() {
                $that.removeClass('is-lang-menu-open');
                $(document).off('click', closeFn);
                $that.off('click', closeFn);
                $that.click(openFn);
              }

          e.stopPropagation();
          $that.addClass('is-lang-menu-open');
          $that.off('click', openFn);
          $that.click(closeFn);
          $(document).click(closeFn);
        }
      ;

    $('.js-lang-menu').click(openFn);
  }

  $(function() {
    setTimeout(function() {
      $('.js-notice').fadeOut();
    }, 6000);
    setupSlideMenu();
    setupLangMenus();

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
