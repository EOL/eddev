(function() {
  function gradeLevelToggle() {
    var $this = $(this),
        $list = $this.next('.lesson-plan-list');

    $list.slideToggle(); 
  }

  $(function () {
    $('.grade-level-bar').click(gradeLevelToggle);
  });
})();
