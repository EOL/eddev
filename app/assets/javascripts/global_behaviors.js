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

  function closeNavMenu() {

  }

  function setupNavMenu() {
    var $navUserMenu = $('.js-nav-user-menu')
      , $navUserMenuToggle = $('.js-nav-user-menu-toggle')
      , closeNavMenu = function(e) {
          $navUserMenu.addClass('is-hidden');
          $(document).off('click', handleDocClick)
        }
      , handleDocClick = function(e) {
          if (
            !$navUserMenu.has(e.target).length &&
            !$navUserMenuToggle.has(e.target).length
          ) {
            closeNavMenu();
          }
        }
      ;

    $navUserMenuToggle.click(function() {
      if ($navUserMenu.hasClass('is-hidden')) {
        $navUserMenu.removeClass('is-hidden');
        $(document).click(handleDocClick);
      } else {
        closeNavMenu();
      }
    });
  }

  function setupNavLangMenu() {
    var $menuToggle = $('.js-nav-user-menu-lang')
      , $menu = $('.js-nav-user-menu-lang-menu')
      , animateMillis
      ;

    $menuToggle.click(function() {
      if (!$menuToggle.hasClass('is-lang-menu-open')) {
        $menuToggle.addClass('is-lang-menu-open');
        $menu.animate({
          height: $menu.get(0).scrollHeight
        }, animateMillis);
      } else {
        $menuToggle.removeClass('is-lang-menu-open');
        $menu.animate({
          height: 0
        }, animateMillis);
      }
    });
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
      , slideMenuOpen = function() {
          $toggle.off('click', slideMenuOpen);
          $toggle.click(slideMenuClose);
          $page.animate({
            left: -1 * menuWidth
          }, { queue: false });
          $navbar.animate({
            left: -1 * menuWidth
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
            right: -1 * menuWidth 
          }, { queue: false });
        }
      ;

    $toggle.click(slideMenuOpen);
    $(window).resize(function() {
      if ($(window).width() > navMobileWidth) {
        $page.css({ left: 0 });
        $navbar.css({ left: 0 });
        $menu.css({ right: menuWidth });
        $toggle.off('click', slideMenuClose);
        $toggle.click(slideMenuOpen);
      }
    });
  }

  $(function() {
    $('#BarsIcon').click(slideMenuOpen);
    $(window).resize(closeMenuIfNecessary);
    setTimeout(function() {
      $('.js-notice').fadeOut();
    }, 6000);
    //    setupNavMenu();
    //     setupNavLangMenu();
    setupSlideMenu();

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
