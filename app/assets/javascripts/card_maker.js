//= require template_renderer/template-renderer
//= require template_renderer/card-wrapper
//= require card_maker/util
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
      window.scrollTo(0, 0);
      $next.fadeIn(fadeMs);
    });
  }

  function areYouSure(e) {
    var msg = 'Are you sure you want to leave this page? Unsaved changes will be discarded.';

    e.returnValue = msg;
    return msg;
  }

  CardManager.cardSelected(function(card) {
    CardEditor.setCard(card);
    editCardId = card.id;
    screenTransition($managerScreen, $editorScreen);

    $(window).on('beforeunload', areYouSure);
  });

  CardEditor.close(function() {
    $(window).off('beforeunload', areYouSure);

    screenTransition($editorScreen, $managerScreen);
    CardManager.reloadCardImg(editCardId);
  });
});
