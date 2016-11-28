(function() {
  function gradeLevelToggle() {
    var $this = $(this),
        $list = $this.next('.lesson-plan-list');

    $list.slideToggle(); 
  }

  $(function () {
    $('.grade-level-bar').click(gradeLevelToggle);

    $( document ).tooltip({
      items: '.key-tooltip',
      content: function() {
        var $source = $('#' + $(this).data('source')),
            width = $source.width(),
            $clone = $source.clone();

        $clone.css('width', width);
        return $clone; 
      },
      position: {
        my: "center bottom-10",
        at: "center top",
        using: function(position, feedback) {
          $(this).css(position);

          var $this = $(this),
              $target = $(event.target),
              tooltipPosn = $this.position(),
              targetPosn = $target.position(),
              targetWidth = $target.width(),
              targetCenter = targetPosn.left + .5 * targetWidth,
              arrowLeft = targetCenter - tooltipPosn.left;
              
          $( "<div>" )
            .addClass( "arrow" )
            .addClass( feedback.vertical )
            .css("left", arrowLeft) // Arrow centering is taken care of by negative margin in css
            .appendTo( this );
        }
      },
      open: function(e){
      }
    });
  });
})();
