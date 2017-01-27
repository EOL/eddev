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

  $(function () {
    scrollWhereNecessary();
    $('.grade-level-bar').click(gradeLevelClicked);
    $('.lesson-plan.external a').click(updateStorage);
  });
})();
