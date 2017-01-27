(function() {
  function gradeLevelClicked() {
    toggleGradeLevelMenu($(this));
  }

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

  function idPart($lessonPlan) {
    return $lessonPlan.attr('id').replace('LessonPlan', '');
  }

  function updateStorage() {
    var $this = $(this),
        $lessonPlan = $this.closest('.lesson-plan');

    sessionStorage.setItem('scrollState', idPart($lessonPlan));
  }

  function restoreFromStorage() {
    var id = sessionStorage.getItem('scrollState');

    if (id) {
      scrollToId(id, false);
      sessionStorage.removeItem('scrollState');
    }

    return id != null;
  }

  function scrollToId(id, highlight) {
    var $lessonPlan = $('#LessonPlan' + id),
        $menu = $lessonPlan.closest('.grade-level').find('.grade-level-bar'),
        highlightColor = '#7ab62d';

    toggleGradeLevelMenu($menu, function() {
      var backgroundColor = $lessonPlan.css('background-color');
      $(window).scrollTop($lessonPlan.offset().top); 

      if (highlight) {
        $lessonPlan.css('background-color', highlightColor);

        $lessonPlan.animate({
          backgroundColor: backgroundColor
        }, 1500);
      }
    });
  }

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

  function updateHeadersOnScroll() {
    var windowScroll = $(window).scrollTop(),
        $fixedBar = $('.grade-level-bar.fixed'),
        $bars = $('.grade-level-bar.open').filter(function(i, bar) {
          return !$(bar).hasClass('fixed'); 
        }),
        barFound = false;
    
    $bars.sort(function(a, b) {
      return $(b).offset().top - $(a).offset().top; 
    });

    $bars.each(function(i, bar) {
      var $bar = $(bar);

      if ($bar.offset().top <= windowScroll) {
        if (!$fixedBar || ($fixedBar && $bar.data('grade-id') != $fixedBar.data('grade-id'))) {
          var $clone = $bar.clone();

          $clone.addClass('fixed');
          $clone.attr('id', null);

          resizeFixedBarHelper($clone);

          if ($fixedBar) {
            $fixedBar.remove();
          }

          $("body").append($clone);
        }

        barFound = true;
        return false;
      }
    });

    if (!barFound) {
      $('.grade-level-bar.fixed').remove();
    }
  }

  function resizeFixedBarHelper($fixedBar) {
    var width = $('.main-col').width(),
        left = ($('body').width() - width) / 2;

        $fixedBar.css('width', width);
        $fixedBar.css('left', left);
  }

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
