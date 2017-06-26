//= require template_renderer/template-renderer
//= require template_renderer/card-wrapper
//= require card_maker/widgets/image_controls
//= require card_maker/widgets/card_form
//= require card_maker/editor
//= require card_maker/manager

$(function() {
  var $managerScreen = $('#CardManagerWrap')
    , $editorScreen  = $('#CardGeneratorWrap')
    , fadeMs = 500
    , editCardId
    ;

  function screenTransition($cur, $next) {
    $cur.fadeOut(fadeMs, function() {
      $next.fadeIn(fadeMs);
    });
  }

  CardManager.cardSelected(function(card) {
    CardEditor.setCard(card);
    editCardId = card.id;
    screenTransition($managerScreen, $editorScreen);
  });

  CardEditor.close(function() {
    screenTransition($editorScreen, $managerScreen);
    CardManager.reloadCardImg(editCardId);
  });
});
