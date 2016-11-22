(function() {
  function gradeLevelToggle() {
    var $this = $(this),
        $list = $this.next('.lesson-plan-list');

    $list.slideToggle(); 
  }

  $(function () {
    $('.grade-level-bar').click(gradeLevelToggle);

    $(document).tooltip({
      items: '.key-tooltip',
      content: function() {
        var $source = $('#' + $(this).data('source')),
            width = $source.width(),
            $clone = $source.clone();

        $clone.css('width', width);
        return $clone; 
      },
      position: {
        my: "center bottom-20",
        at: "center top",
        using: function(position, feedback) {
          $( this ).css( position );

          $( "<div>" )
            .addClass( "arrow" )
            .addClass( feedback.vertical )
            .addClass( feedback.horizontal )
            .appendTo( this );
        }
      },
      open: function(e){
        console.log(e.originalEvent.target);
      }
    });
  });
})();
