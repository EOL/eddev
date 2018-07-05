(function() {
  var navMobileWidth = 648; // XXX: duplicated in CSS

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

  function slideMenuOpen($page, $menuToggle) {
    $page.animate({
      left: -200
    });

    $page.off('click', slideMenuOpen);
    $menuToggle.click(slideMenuClose);
  }

  function slideMenuClose($page, $menuToggle) {
    $page.animate({
      left: 0
    });
  }

  function setupSlideMenu() {
    var $page = $('#Page')
      , $toggle = $('.js-slide-menu-toggle')
      , $navbar = $('.js-navbar')
      , $menu = $('.js-slide-menu')
      , menuWidth = $menu.outerWidth()
      , menuRight = -1 * menuWidth
      , slideMenuOpen = function() {
          $toggle.off('click', slideMenuOpen);
          $toggle.click(slideMenuClose);
          $page.animate({
            left: menuRight
          }, { queue: false });
          $navbar.animate({
            left: menuRight
          }, { queue: false });
          $menu.animate({
            right: 0
          }, { queue: false });
        }
      , slideMenuClose = function() {
          $toggle.off('click', slideMenuClose);
          $toggle.click(slideMenuOpen);
          $page.animate({
            left: 0
          }, { queue: false });
          $navbar.animate({
            left: 0
          }, { queue: false });
          $menu.animate({
            right: menuRight
          }, { queue: false });
        }
      ;

    $toggle.click(slideMenuOpen);
    $(window).resize(function() {
      if ($(window).width() > navMobileWidth) {
        $page.css({ left: 0 });
        $navbar.css({ left: 0 });
        $menu.css({ right: menuRight });
        $toggle.off('click', slideMenuClose);
        $toggle.click(slideMenuOpen);
      }
    });
  }

  function setupLangMenus() {
    var $menu = $('.js-lang-menu')
      , openFn = function(e) {
          var $that = $(this)
            , closeFn = function() {
                $that.removeClass('is-lang-menu-open');
                $(document).off('click', closeFn);
              }

          e.stopPropagation();
          $that.addClass('is-lang-menu-open');
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
