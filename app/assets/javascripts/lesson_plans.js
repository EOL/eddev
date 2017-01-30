(function() {
  // Click handler for grade level bars. Shows all lesson plans for grade level.
  function gradeLevelClicked() {
    var $this = $(this)
        realBar = $this,
        lessonPlansHdr = null;

    if ($this.hasClass('fixed')) {
      realBar = $('#GradeLevelMenu' + $this.data('grade-id'));
      $("body").scrollTop(realBar.offset().top);
      $this.remove();
    }

    toggleGradeLevelMenu(realBar);
  }

  // Show/hide lesson plans for grade level
  function toggleGradeLevelMenu($menu, callback) {
    var $list = $menu.next('.lesson-plan-list'),
        $chevron = $menu.find('.chevron');

    $list.slideToggle({
      complete: callback  
    });
    $menu.toggleClass('open');

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
    var $lessonPlan = $('#LessonPlan' + id),
        $menu = $lessonPlan.closest('.grade-level').find('.grade-level-bar'),
        highlightColor = '#c9ddff';

    toggleGradeLevelMenu($menu, function() {
      var backgroundColor = $lessonPlan.css('background-color');
      $(window).scrollTop($lessonPlan.offset().top - $menu.height()); //accommodate persistent header

      if (highlight) {
        $lessonPlan.css('background-color', highlightColor);

        $lessonPlan.animate({
          backgroundColor: backgroundColor
        }, 3000)
      }
    });
  }

  // Scroll to lesson plan passed in via url hash or saved in session storage.
  // Highlights lesson plan if lesson plan scrolled to was indicated via url hash.
  function scrollWhereNecessary() {
    var $markedLesson = null,
        hashParams = null;

    if (!restoreFromStorage()) {
      hashParams = parseHashParameters();

      if (hashParams && hashParams['scroll_to']) {
        scrollToId(hashParams['scroll_to'], true);
      }
    }
  }

  // Parse parameters from url hash
  function parseHashParameters() {
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

  function lpListForBar($bar) {

  }

  // Scroll handler, enables persistent grade level headers
  function updateHeadersOnScroll() {
    var windowScroll = $(window).scrollTop(),
        $bars = $('.grade-level-bar.open').filter(function(i, bar) {
          return !$(bar).hasClass('fixed'); 
        });

    // Add new fixed bar if necessary
    $bars.sort(function(a, b) {
      return $(b).offset().top - $(a).offset().top; 
    });

    $bars.each(function(i, bar) {
      var $bar = $(bar),
          $lastLp = $bar.next('.lesson-plan-list').find('.lesson-plan').last(),
          lastLpTop = $lastLp.offset().top,
          barHeight = $bar.height(),
          fixedBarTop = lastLpTop - windowScroll - barHeight,
          $fixedBar = $('.grade-level-' + $bar.data('grade-id') + '.fixed');

      if (fixedBarTop > 0) {
        fixedBarTop = 0
      }

      if ($bar.offset().top <= windowScroll && fixedBarTop + barHeight >= 0) {
        if (!$fixedBar.length) {
          $fixedBar = $bar.clone();
          $fixedBar.addClass('fixed');
          $fixedBar.attr('id', null);
          $fixedBar.click(gradeLevelClicked);
          resizeFixedBarHelper($fixedBar);
          $("body").append($fixedBar);
        }

        $fixedBar.css('top', fixedBarTop);

        return false;
      } else if ($fixedBar.length) {
        $fixedBar.remove();
      }
    });
  }

  // Resize persistent grade level header
  function resizeFixedBarHelper($fixedBar) {
    var width = $('.main-col').width(),
        left = ($('body').width() - width) / 2;

    $fixedBar.css('width', width);
    $fixedBar.css('left', left);
  }

  // Resize active persistent grade level header(s) if exists
  function resizeFixedBar() {
    var $bar = $('.grade-level-bar.fixed');

    if ($bar) {
      resizeFixedBarHelper($bar);
    }
  }

  $(function () {
    scrollWhereNecessary();
    $('.grade-level-bar').click(gradeLevelClicked);
    $('.lesson-plan.external a').click(updateStorage);

    $(window).scroll(updateHeadersOnScroll);
    $(window).resize(resizeFixedBar);
  });
})();
