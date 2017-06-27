window.CardManager = (function() {
  var exports = {};

  var apiPath = '/card_maker_ajax';

  /*
   * Handlebars templates
   */
  var cardPlaceholderTemplate
    , cardImgTemplate
    , cardOverlayTemplate
    , spinnerTemplate
    , deckTemplate
    ;

  /*
   * CONSTANTS
   */
  var allCardsScreen = 'allCards'
    , allDecksScreen = 'allDecks'
    ;

  /*
   * STATE
   */
  var idsToElmts
    , cardSelectedCb
    , curScreen
    ;

  /*
   * Helper function to create a new card without a deck
   */
  function newCard() {
    if (curScreen !== allCardsScreen) {
      reloadCardsWithCb(newCardHelper);
    } else {
      newCardHelper();
    }
  }

  function newCardHelper() {
    newCardForDeck(null);
  }

  /*
   * Create a new card and add it to the manager
   *
   * Parameters:
   *    deckId - optional - the deck that the card should belong to
   */
  function newCardForDeck(deckId) {
    var taxonId = window.prompt('Enter EOL taxon ID', '327940')
      , $cardPlaceholder = $(cardPlaceholderTemplate())
      , path = deckId === null ? '/cards' : '/decks/' + deckId + '/cards'
      ;

    if (!taxonId) {
      return;
    }

    $('#UserResources').prepend($cardPlaceholder);
    fixLayout();

    $.ajax({
      url: apiPath + path,
      data: JSON.stringify({
        templateName: 'trait',
        templateParams: {
          speciesId: taxonId
        }
      }),
      contentType: 'application/json',
      method: 'POST',
      success: function(card) {
        var $newPlaceholder = $(cardPlaceholderTemplate({ cardId: card.id }));
        $cardPlaceholder.replaceWith($newPlaceholder);
        fixLayout();
        $newPlaceholder.click(cardClicked.bind(null, $newPlaceholder, card.id));
        $newPlaceholder.click();
        $newPlaceholder.find('.card-overlay .edit-btn').click();
        loadCardImgAndBindEvents($newPlaceholder, card.id);
      }
    });
  }

  function newDeckHelper() {
    var deckName = prompt('Deck name:');

    if (!deckName) return;

    $.ajax({
      url: apiPath + '/decks',
      method: 'POST',
      data: JSON.stringify({ name: deckName }),
      success: function(deck) {
        var $deckElmt = $(deckTemplate({ name: deck.name }));
        $('#UserResources').prepend($deckElmt);
        fixLayout();
      }
    });
  }

  function newDeck() {
    if (curScreen !== allDecksScreen) {
      reloadDecksWithCb(newDeckHelper);
    } else {
      newDeckHelper();
    }
  }

  /*
   * Remove all resources (decks, cards) from the #UserResources area and
   * remove event handlers
   */
  function cleanUserResources() {
    var $userResources = $('#UserResources');

    $userResources.find('*').remove();
    $userResources.off();
    $userResources.click(unselectResource);

    return $userResources;
  }

  /*
   * Select a resource. Should be called on click. Builds and adds an overlay
   * from the provided template, which should have edit and delete buttons with
   * classes .edit-btn and .trash-btn respectively. Adds a click handler to the
   * #UserResources area to unselect the resource if the click wasn't on the
   * resource.
   *
   * Parameters:
   *   overlayTemplate - template for the overlay to add to the card
   *   destroyFn - handler for when the overlay's delete button is clicked
   *   editFn - handler for when the overlay's edit button is clicked
   *   $elmt - the selected resource
   *   id - the resource's id (card id or deck id)
   *   event - the click event that triggered this handler
   */
  function resourceSelected(
    overlayTemplate,
    destroyFn,
    editFn,
    $elmt,
    id,
    event
  ) {
    var $overlay = $(overlayTemplate())
      ;

    event.stopPropagation();

    if ($elmt.hasClass('selected')) {
      return false;
    }

    unselectResource();

    $overlay.find('.trash-btn').click(function() {
      destroyFn($elmt, id);
      return false;
    });

    $overlay.find('.edit-btn').click(function() {
      editFn($(this), id);
      return false;
    });

    $elmt.find('.resource-frame').append($overlay);
    $elmt.addClass('selected');

    return false;
  }

  /*
   * Click handler for cards
   */
  function cardClicked($card, id, event) {
    return resourceSelected(
      cardOverlayTemplate,
      destroyCard,
      cardEditClicked,
      $card,
      id,
      event
    );
  }

  /*
   * Load a card image and replace a placeholder's spinner with it.
   *
   * Parameters:
   *   $placeholder - the placeholder element
   *   cardId - the card id
   */
  function loadCardImg($placeholder, cardId) {
    var $img = $(cardImgTemplate({
      src: apiPath + '/cards/' + cardId + '/svg'
    }));

    $img.one('load', function() {
      var $resourceFrame = $placeholder.find('.resource-frame');

      // If the placeholder was selected, leave the overlay in place,
      // but remove everything else
      $resourceFrame.children().not('.resource-overlay').remove();
      $resourceFrame.prepend($img);
    });

    if ($img.complete) {
      $img.load();
    }
  }

  /*
   * Add click event handler to a card and load its image
   *
   * Parameters:
   *   $card - card element
   *   id - the card id
   */
  function loadCardImgAndBindEvents($card, id) {
    $card.click(cardClicked.bind(null, $card, id));
    loadCardImg($card, id);
  }

  /*
   * Unselect the currently selected resource
   */
  function unselectResource() {
    unselectResourceHelper($('#UserResources .resource-wrap.selected'));
  }

  /*
   * Unselect a resource
   *
   * Parameters:
   *    $resource - the element to unselect
   */
  function unselectResourceHelper($resource) {
    if ($resource) {
      $resource.find('.resource-overlay').remove();
      $resource.removeClass('selected');
    }
  }

  /*
   * Delete a card and remove its image from the card manager.
   */
  function destroyCard($card, id) {
    var shouldDestroy = confirm('Are you sure you want to delete this card?');

    if (!shouldDestroy) return;

    $.ajax({
      url: apiPath + '/cards/' + id,
      method: 'DELETE',
      success: function() {
        $card.remove();
        $('#CardGenerator').addClass('hidden');
        fixLayout();
      }
    });
  }

  /*
   * Load a card into the card editor
   *
   * Parameters:
   *   id - the card id
   */
  function loadCardForEditing(id) {
    $.ajax({
      url: apiPath + '/cards/' + id + '/json',
      method: 'GET',
      contentType: 'application/json',
      success: fireCardSelected
    });
  }

  function cardSelected(cb) {
    cardSelectedCb = cb;
  }
  exports.cardSelected = cardSelected;

  function fireCardSelected(cardData) {
    if (cardSelectedCb) {
      cardSelectedCb(cardData);
    }
  }

  /*
   * Click handler for card overlay edit buttons. Marks the button as active
   * and loads the card for editing.
   *
   * Parameters:
   *   $btn - the button
   *   id - the card id
   */
  function cardEditClicked($btn, id) {
    $btn.addClass('active');
    loadCardForEditing(id);
  }

  /*
   * Populate the #UserResources area with a list of cards
   *
   * Parameters:
   *   cards - an Array of card summaries or full cards
   *   decks - an Array of all of the decks that should show up in each card's
   *           deck selection dropdown
   *   newResourceClickFn - click handler for the new resource button
   */
  function buildCards(cards, decks, newResourceClickFn) {
    var $userCards = cleanUserResources();

    idsToElmts = {};

    $.each(cards, function(i, card) {
      var deckId = card.deck ? card.deck.id : null
        , $placeholder = $(cardPlaceholderTemplate({
            cardId: card.id,
            decks: decks
          }))
        , $deckSelector = $placeholder.find('.deck-selector')
        ;

      if (deckId) {
        $deckSelector.val(deckId);
      }

      $deckSelector.on('change', function() {
        var deckId = $(this).val();

        if (deckId === 'none') {
          removeCardDeck(card.id);
        } else {
          setCardDeck(card.id, deckId);
        }
      });

      idsToElmts[card.id] = $placeholder;
      $userCards.append($placeholder);
      loadCardImgAndBindEvents($placeholder, card.id);
    });
  }

  /*
   * Make AJAX call to get user's decks
   */
  function getDecks(cb) {
    $.ajax({
      url: apiPath + '/decks',
      method: 'GET',
      success: cb
    });
  }

  function selectFilter(id) {
    $('.filter').removeClass('selected');
    $('#' + id).addClass('selected');
  }

  function reloadCardsWithCb(cb) {
    curScreen = allCardsScreen;

    $.ajax({
      url: apiPath + '/card_summaries',
      method: 'GET',
      success: function(summaries) {
        getDecks(function(decks) {
          selectFilter('CardFilter');
          buildCards(summaries, decks, newCard);
          fixLayout();

          if (cb) {
            cb();
          }
        });
      }
    });
  }

  /*
   * Load the user's cards into the #UserResources area
   */
  function reloadCards() {
    reloadCardsWithCb(null);
  }

  function reloadDecksWithCb(cb) {
    curScreen = allDecksScreen;

    $.ajax({
      url: apiPath + '/decks',
      method: 'GET',
      success: function(decks) {
        var deckContainer = cleanUserResources();

        selectFilter('DeckFilter');

        $.each(decks, function(i, deck) {
          var $deckElmt = $(deckTemplate({ name: deck.name }));

          if (deck.titleCardId) {
            loadCardImg($deckElmt, deck.titleCardId);
          }

          //$deckElmt.click(deckSelected.bind(null, $deckElmt, deck));

          deckContainer.append($deckElmt);
        });

        fixLayout();

        if (cb) {
          cb();
        }
      }
    });
  }

  function reloadDecks() {
    reloadDecksWithCb(null);
  }

  // TODO: this may only work in Chrome. See how other browsers treat scrollbars.
  function fixLayout() {
    var $userResources = $('#UserResources')
      , scrollWidth = $userResources[0].offsetWidth - $userResources[0].clientWidth
      , innerWidth = $userResources.width()
      , resourceWidth = $('.resource-wrap').outerWidth()
      ;

    $('.resource-wrap').css('margin-right',
      (innerWidth - scrollWidth - resourceWidth * 4) / 4.0);
  }

  function reloadCardImg(cardId) {
    var $elmt = idsToElmts[cardId]
      , $spinner = $(spinnerTemplate())
      ;

    if (!$elmt) {
      // TODO: handle error
      return;
    }

    $elmt.find('.user-resource').replaceWith($spinner);
    loadCardImgAndBindEvents($elmt, cardId);
  }
  exports.reloadCardImg = reloadCardImg;

  $(function() {
    cardPlaceholderTemplate = Handlebars.compile($('#CardPlaceholderTemplate').html());
    cardImgTemplate = Handlebars.compile($('#CardImgTemplate').html());
    cardOverlayTemplate = Handlebars.compile($('#CardOverlayTemplate').html());
    spinnerTemplate = Handlebars.compile($('#SpinnerTemplate').html());
    deckTemplate = Handlebars.compile($('#DeckTemplate').html());

    $('#NewCard').click(newCard);
    $('#NewDeck').click(newDeck);
    $('#CardFilter').click(reloadCards);
    $('#DeckFilter').click(reloadDecks);

    reloadCards();
  });


  return exports;
})();
