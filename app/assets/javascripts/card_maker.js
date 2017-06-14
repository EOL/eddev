//= require template_renderer/template-renderer
//= require template_renderer/card-wrapper
//= require card_maker/widgets/image_controls
//= require card_maker/widgets/card_form
//= require card_maker/editor
//= require card_maker/manager

$(function() {
  var $managerScreen = $('#CardManager')
    , $editorScreen  = $('#CardGenerator')
    , fadeMs = 500
    ;

  function screenTransition($cur, $next) {
    $cur.fadeOut(fadeMs, function() {
      $next.fadeIn(fadeMs);
    });
  }

  CardManager.cardSelected(function(card) {
    CardEditor.setCard(card);
    screenTransition($managerScreen, $editorScreen);
  });

  CardEditor.close(function() {
    screenTransition($editorScreen, $managerScreen);
  });
});
