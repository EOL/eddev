(function() {
  // Click handler for grade level bars. Shows all lesson plans for grade level.
  function gradeLevelClicked() {
    toggleGradeLevelMenu($(this));
  }

  function closeAllMenus() {
    var $gradeLevels = $('.grade-level');

    $gradeLevels.each(function() {
      var $list = $(this).find('.lesson-plan-list')
        , $chevron = $(this).find('.chevron')
        ;

      $list.css({
        display: 'none'
      });
      setGradeLevelClass($(this), null);
      $chevron.removeClass('fa-chevron-up');
      $chevron.addClass('fa-chevron-down');
    });
  }

  function openMenu($menu) {
    var $gradeLevel = $menu.closest('.grade-level')
      , $list = $gradeLevel.find('.lesson-plan-list')
      , $chevron = $gradeLevel.find('.chevron')
      ;

    $list.css({
      display: 'block'
    });

    $chevron.removeClass('fa-chevron-down');
    $chevron.addClass('fa-chevron-up');
  }

  // Show/hide lesson plans for grade level
  function toggleGradeLevelMenu($menu, callback) {
    var $gradeLevel = $menu.closest('.grade-level')
      , $list = $gradeLevel.find('.lesson-plan-list')
      , $chevron = $menu.find('.chevron')
      , $navbar
      , $bar
      , visible = $list.is(':visible')
      ;

    if (visible) {
      $navbar = $('.navbar-outer');
      $bar = $gradeLevel.find('.grade-level-bar-outer');
      window.scrollTo(0, $list.offset().top + $navbar.height() + $bar.height());
    }

    $list.slideToggle({
      complete: function() {
        if (visible) {
          setGradeLevelClass($gradeLevel, null);
        }

        if (callback) {
          callback();
        }
      }
    });

    setGradeLevelClass($gradeLevel, null);

    $chevron.toggleClass('fa-chevron-down');
    $chevron.toggleClass('fa-chevron-up');
  }

  // Get the lesson plan id from a lesson plan element
  function idPart($lessonPlan) {
    return $lessonPlan.attr('id').replace('LessonPlan', '');
  }

  // Save scroll state in session storage
  function updateStorage() {
    var $this = $(this),
        $lessonPlan = $this.closest('.lesson-plan');

    sessionStorage.setItem('scrollState', idPart($lessonPlan));
  }

  // Restore scroll state from session storage
  function restoreFromStorage() {
    var id = sessionStorage.getItem('scrollState');

    if (id) {
      scrollToId(id, false);
      sessionStorage.removeItem('scrollState');
    }

    return id != null;
  }

  // Scroll to lesson plan with id, opening the required grade level menu
  function scrollToId(id, highlight) {
    var $lessonPlan = $('#LessonPlan' + id)
      , $menu = $lessonPlan.closest('.grade-level').find('.grade-level-bar')
      , $navbar = $('.navbar-outer')
      , highlightColor = '#c9ddff'
      ;

    toggleGradeLevelMenu($menu, function() {
      var backgroundColor = $lessonPlan.css('background-color');
      $(window).scrollTop(
        $lessonPlan.offset().top - 
        $menu.height() -
        $navbar.outerHeight()
      ); //accommodate persistent header

      if (highlight) {
        $lessonPlan.css('background-color', highlightColor);

        $lessonPlan.animate({
          backgroundColor: backgroundColor
        }, 3000)
      }
    });
  }

  function scrollToGradeLevel(id) {
    var $menu = $('.grade-level-' + id)
      , $navbar = $('.navbar-outer')
      ;

    closeAllMenus();
    openMenu($menu);
    $(window).scrollTop($menu.offset().top - $navbar.outerHeight());
  }

  // Scroll to lesson plan passed in via url hash or saved in session storage.
  // Highlights lesson plan if lesson plan scrolled to was indicated via url hash.
  function scrollWhereNecessary() {
    var $markedLesson = null,
        hashParams = null;

    if (!restoreFromStorage()) {
      hashParams = EolUtil.parseHashParams();

      if (hashParams) {
        if (hashParams['scroll_to']) {
          scrollToId(hashParams['scroll_to'], true);
        } else if (hashParams['grade_level']) {
          scrollToGradeLevel(hashParams['grade_level']);
          EolUtil.clearHash(); // To allow re-navigating to the same grade level
        }
      }
    }
  }

  // Scroll handler, enables persistent grade level headers
  function updateHeadersOnScroll() {
    var windowScroll = $(window).scrollTop()
      , $lessonPlanLists = $('.lesson-plan-list:visible')
      , $navbar = $('.navbar-outer')
      , navbarHeight = $navbar.height()
      ;

    $lessonPlanLists.each(function(i, list) {
      var $list = $(list)
        , $gradeLevel = $list.closest('.grade-level')
        , $barOuter = $gradeLevel.find('.grade-level-bar-outer')
        , $bar = $gradeLevel.find('.grade-level-bar')
        , barHeight = $bar.height()
        , listTop = $list.offset().top
        , $lastLp = $list.find('.lesson-plan').last()
        , lastLpTop = $lastLp.offset().top
        , lastLpHeight
        ;
      if (
        (
          $gradeLevel.hasClass('grade-level-fixed-bar') || 
          $gradeLevel.hasClass('grade-level-abs-bar') 
        ) &&
        listTop > windowScroll + navbarHeight // in this state there is top padding of barHeight
      ) {
        setGradeLevelClass($gradeLevel, null);
      } else if (
        lastLpTop <= windowScroll + navbarHeight + barHeight
      ) {
        if (!$gradeLevel.hasClass('grade-level-abs-bar')) {
          lastLpHeight = $lastLp.outerHeight();
          setGradeLevelClass($gradeLevel, 'grade-level-abs-bar')
          $barOuter.css({
            bottom: lastLpHeight
          });
        }
      } else if (
        listTop <= windowScroll + navbarHeight + barHeight
      ) {
        if (!$gradeLevel.hasClass('grade-level-fixed-bar')) {
          setGradeLevelClass($gradeLevel, 'grade-level-fixed-bar');
        }
      } 
    });
  }

  function setGradeLevelClass($gradeLevel, klass) {
    if (!klass || klass === 'grade-level-abs-bar') {
      $gradeLevel.removeClass('grade-level-fixed-bar');
    } 
    
    if (!klass || klass === 'grade-level-fixed-bar') {
      $gradeLevel.removeClass('grade-level-abs-bar');
    } 
    
    if (klass) {
      $gradeLevel.addClass(klass);
    }
  }

  $(function () {
    scrollWhereNecessary();
    $('.grade-level-bar').click(gradeLevelClicked);
    $('.lesson-plan.external a').click(updateStorage);

    $(window).scroll(updateHeadersOnScroll);
    $(window).on('hashchange', scrollWhereNecessary);
  });
})();
