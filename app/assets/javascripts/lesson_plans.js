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

  function updateHash() {
    var $this = $(this),
        $lessonPlan = $this.closest('.lesson-plan');

    sessionStorage.setItem('scrollState', idPart($lessonPlan));
  }

  function restoreFromHash() {
    var scrollState = sessionStorage.getItem('scrollState');
    if (scrollState) {
      var catAndId = scrollState.split('-'),
          cat = catAndId[0],
          id = catAndId[1],
          $menu = $('#GradeLevelMenu' + cat),
          $lessonPlan = $('#LessonPlan' + cat + '-' + id);

      toggleGradeLevelMenu($menu, function() {
        $(window).scrollTop($lessonPlan.offset().top); 
      });

      sessionStorage.removeItem('scrollState');
    }
  }

  $(function () {
    restoreFromHash();
    $('.grade-level-bar').click(gradeLevelClicked);
    $('.lesson-plan.external a').click(updateHash);
  });
})();
