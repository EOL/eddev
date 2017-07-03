window.CardManager = (function() {
  function ResourceCollection(loadFn, wrapperFn) {
    var that = this
      , items
      ;

    that.reload = function(cb) {
      loadFn(function(newItems) {
        var wrapped;

        if (wrapperFn) {
          wrapped = new Array(newItems.length);

          for (var i = 0; i < newItems.length; i++) {
            wrapped[i] = wrapperFn(newItems[i]);
          }
        } else {
          wrapped = newItems;
        }

        items = wrapped;
        fireChange();
        cb(that);
      });
    }

    that.length = function() {
      return items.length;
    }

    that.push = function(item) {
      if (wrapperFn) {
        item = wrapperFn(item);
      }

      items.unshift(item);
      fireChange();
    }

    that.items = function() {
      return items;
    }

    that.delete = function(id) {
      items.splice(items.findIndex(function(item) {
        return item.id === id
      }), 1);
      fireChange();
    }

    function fireChange() {
      $(that).triggerHandler('change');
    }
  }

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
    , deckOverlayTemplate
    , searchResultTempl
    , searchSpinnerTempl
    , searchResultDetailsTempl
    , resultDetailSpinnerTempl
    ;

  /*
   * CONSTANTS
   */
  var allCardsScreen  = 'allCards'
    , allDecksScreen  = 'allDecks'
    , deckCardsScreen = 'deckCards'
    ;

  /*
   * STATE
   */
  var idsToElmts
    , cardSelectedCb
    , curScreen
    , cards = new ResourceCollection(reloadCards, cardSummaryWrap)
    , decks = new ResourceCollection(reloadDecks)
    ;

  function openLightbox(templName) {
    var $lightbox = $(lightboxTempl({
          templ: function() {
            return templName
          }}))
      , enableFn = Util.disablePage($lightbox)
      ;

    $('#Page').prepend($lightbox);

    function closeFn() {
      $lightbox.remove();
      enableFn();
    }

    return {
      lightbox: $lightbox,
      inner: $lightbox.find('.lightbox'),
      closeFn: closeFn
    }
  }

  /*
   * Helper function to create a new card without a deck
   */
  function newCard() {
    var lightboxResult = openLightbox('speciesSearch')
      , $search = lightboxResult.lightbox
      , $inner = lightboxResult.inner
      , $results = $search.find('.search-results')
      , $resultsWrap = $search.find('.search-results-wrap')
      , $createMenu = $search.find('.create-menu')
      , $createBtn = $createMenu.find('.create-btn-wrap')
      , $resultCount = $search.find('.result-count')
      , closeFn = lightboxResult.closeFn
      , resultSelectFn
      , reqCount = 0
      ;

    $(document).click(closeFn);

    $inner.click(function() {
      return false;
    });

    function fixSearchLayout() {
      fixLayoutHelper($results, $results.find('.search-result'), 3);
    }

    $search.find('.search-field').on('input', function() {
      var $that = $(this)
        , val = $that.val()
        , $spin
        ;

      $results.empty();
      $createMenu.addClass('hidden');
      $resultCount.addClass('hidden');

      if (val && val.length >= 3) {
        $spin = $(searchSpinnerTempl());
        $resultsWrap.removeClass('hidden');
        $results.append($spin);

        taxonSearch(val, function(data) {
          var countStr;

          $spin.remove();

          if (!(data && data.results)) {
            return;
          }

          data.results.forEach(function(result) {
            var $result = $(searchResultTempl({
              id: result.id,
              sciName: result.title
            }));

            $result.click(expandSearchResult);
            $results.append($result);
            fixSearchLayout();
          });

          countStr = data.results.length + ' ';
          countStr += (data.results.length === 1 ? 'result' : 'results');
          $resultCount.html(countStr);
          $resultCount.removeClass('hidden');
        });
      } else {
        $resultsWrap.addClass('hidden');
      }
    });

    $createBtn.click(createBtnClick);

    function taxonSearch(query, cb) {
      var reqNum = ++reqCount;

      $.getJSON(apiPath + '/taxon_search/' + query, function(data) {
        if (reqNum === reqCount) {
          cb(data);
        }
      });
    }

    function expandSearchResult() {
      var $that = $(this)
        , $spinner
        ;

      $that.siblings('.expanded').removeClass('expanded');
      $that.addClass('expanded');
      fixSearchLayout();
      $createMenu.removeClass('hidden');

      if (!$that.find('.result-details').length && !$that.find('.result-detail-spinner').length) {
        $spinner = $(resultDetailSpinnerTempl());
        $that.append($spinner);

        $.getJSON(apiPath + '/taxon_details/' + $that.data('id'), function(data) {
          $spinner.remove();
          $that.append($(searchResultDetailsTempl(data)));
        });
      }
    }

    function createBtnClick() {
      var $selected = $results.find('.search-result.expanded');
      newCardForDeck($selected.data('id'), null);
      closeFn();
    }

    return false;
  }


  /*
   * Create a new card and add it to the manager
   *
   * Parameters:
   *    deckId - optional - the deck that the card should belong to
   */
  function newCardForDeck(taxonId, deckId) {
    var $cardPlaceholder = $(cardPlaceholderTemplate())
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

        pushCard(card);

        $newPlaceholder.click(cardClicked.bind(null, $newPlaceholder, card.id));
        $newPlaceholder.click();
        $newPlaceholder.find('.card-overlay .edit-btn').click();

        $cardPlaceholder.replaceWith($newPlaceholder);

        fixLayout();

        idsToElmts[card.id] = $newPlaceholder;
        loadCardImgAndBindEvents($newPlaceholder, card.id);
      }
    });
  }

  function pushCard(card) {
    cards.push(card);
  }

  function pushDeck(deck) {
    decks.push(deck);
  }

  function deleteCard(id) {
    cards.delete(id);
  }

  function deleteDeck(id) {
    decks.delete(id);
  }

  function deleteResource(resources, id) {
    resources.splice(resources.findIndex(function(curResource) {
      return curResource.id === id
    }), 1);
    $(resources).triggerHandler('x.change');
  }

  function pushResource(resources, resource) {
    resources.unshift(resource);
    $(resources).triggerHandler('x.change');
  }

  function newDeckHelper(e) {
    var lightboxResult = openLightbox('newDeck')
      , $nameInput = lightboxResult.lightbox.find('.deck-name')
      , $submitBtn = lightboxResult.lightbox.find('.create-deck-btn')
      ;

    $nameInput.click(function() {
      return false;
    });

    $(document).click(lightboxResult.closeFn);

    $submitBtn.click(function() {
      var deckName = $nameInput.val();

      if (deckName) {
        $.ajax({
          url: apiPath + '/decks',
          method: 'POST',
          data: JSON.stringify({ name: deckName }),
          success: function(deck) {
            var $deckElmt = $(deckTemplate({ name: deck.name }));
            $deckElmt.click(deckClicked.bind(null, $deckElmt, deck));
            $('#UserResources').prepend($deckElmt);
            pushDeck(deck);
            fixLayout();
          },
          error: function(err) {
            var alertMsg = '';

            if (err.status === 422 &&
                err.responseJSON &&
                err.responseJSON.errors
            ) { // Validation error
              alertMsg = err.responseJSON.errors.join('\n');
            } else {
              alertMsg = "An unexpected error occurred"
            }

            alert(alertMsg);
          }
        });
      } else {
        return false;
      }
    });
  }

  function newDeck(e) {
    showDecks();
    newDeckHelper(e);
    return false;
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
   * Click handler for decks
   */
  function deckClicked($deck, deck, event) {
    return resourceSelected(
      deckOverlayTemplate,
      destroyDeck.bind(null, $deck, deck),
      loadDeckCards.bind(null, deck),
      $deck,
      deck.id,
      event
    );
  }

  function destroyDeck($deckElmt, deck) {
    var confirmation = confirm('Are you sure you want to delete this deck?');

    if (!confirmation) return;

    $.ajax({
      url: apiPath + '/decks/' + deck.id,
      method: 'DELETE',
      success: function() {
        deleteDeck(deck);
        $deckElmt.remove();
      }
    });
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
        deleteCard(id);
        $card.remove();
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
  function buildCards() {
    var $userCards = cleanUserResources()
      ;

    idsToElmts = {};

    $.each(cards.items(), function(i, card) {
      var deckId = card.deck ? card.deck.id : null
        , $placeholder = $(cardPlaceholderTemplate({
            cardId: card.id,
            decks: decks.items()
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
    return cb(decks.items());
  }

  function selectFilter(id) {
    $('.filter').removeClass('selected');
    $('#' + id).addClass('selected');
  }

  function loadDeckCards(deck) {
    $.ajax({
      url: apiPath + '/decks/' + deck.id + '/card_ids',
      method: 'GET',
      success: function(ids) {
        loadCardsFromIds(ids, function() {
          newCardForDeck(deck.id);
        });
      }
    });
  }

  function loadCardsFromIds(ids, newResourceClickFn) {
    var $userCards = cleanUserResources();

    $.each(ids, function(i, id) {
      var $placeholder = $(cardPlaceholderTemplate({ cardId: id }));
      $userCards.append($placeholder);
      loadCardImgAndBindEvents($placeholder, id);
    });

    fixLayout();
  }

  /*
   * Load the user's cards into the #UserResources area
   */
  function showCards() {
    if (curScreen !== allCardsScreen) {
      curScreen = allCardsScreen;

      selectFilter('CardFilter');
      buildCards();
      fixLayout();
    }
  }

  function showDecks() {
    var deckContainer;

    if (curScreen !== allDecksScreen) {
      curScreen = allDecksScreen;
      deckContainer = cleanUserResources();

      selectFilter('DeckFilter');

      $.each(decks.items(), function(i, deck) {
        var $deckElmt = $(deckTemplate({ name: deck.name }));

        if (deck.titleCardId) {
          loadCardImg($deckElmt, deck.titleCardId);
        }

        $deckElmt.click(deckClicked.bind(null, $deckElmt, deck));

        deckContainer.append($deckElmt);
      });

      fixLayout();
    }
  }

  function fixLayoutHelper($container, $items, numPerRow) {
    var scrollWidth = $container[0].offsetWidth - $container[0].clientWidth
      , innerWidth = $container.width()
      , resourceWidth = $items.outerWidth()
      ;

    $items.css('margin-right',
      (innerWidth - scrollWidth - resourceWidth * numPerRow) / (numPerRow * 1.0));
  }

  // TODO: this may only work in Chrome. See how other browsers treat scrollbars.
  function fixLayout() {
    fixLayoutHelper($('#UserResources'), $('.resource-wrap'), 4);
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

  function setDeckCount(count) {
    setCount(count, 'DeckCount');
  }

  function setCardCount(count) {
    setCount(count, 'CardCount');
  }

  function setCount(count, id) {
    $('#' + id).html(count);
  }

  function reloadCards(cb) {
    $.ajax({
      url: apiPath + '/card_summaries',
      method: 'GET',
      success: cb
    });
  }

  function reloadDecks(cb) {
    $.ajax({
      url: apiPath + '/decks',
      method: 'GET',
      success: cb
    });
  }

  function cardSummaryWrap(card) {
    return {
      id: card.id,
      deck: card.deck
    };
  }

  $(function() {
    cardPlaceholderTemplate = Handlebars.compile($('#CardPlaceholderTemplate').html());
    cardImgTemplate = Handlebars.compile($('#CardImgTemplate').html());
    cardOverlayTemplate = Handlebars.compile($('#CardOverlayTemplate').html());
    spinnerTemplate = Handlebars.compile($('#SpinnerTemplate').html());
    deckTemplate = Handlebars.compile($('#DeckTemplate').html());
    deckOverlayTemplate = Handlebars.compile($('#DeckOverlayTemplate').html());
    searchResultTempl = Handlebars.compile($('#SearchResultTemplate').html());
    searchSpinnerTempl = Handlebars.compile($('#SearchSpinnerTemplate').html());
    searchResultDetailsTempl = Handlebars.compile($('#SearchResultDetailsTemplate').html());
    resultDetailSpinnerTempl = Handlebars.compile($('#ResultDetailSpinnerTemplate').html());
    lightboxTempl = Handlebars.compile($('#LightboxTemplate').html());

    Handlebars.registerPartial('speciesSearch', $('#SpeciesSearchTemplate').html());
    Handlebars.registerPartial('newDeck', $('#NewDeckLightboxTemplate').html());

    $('#NewCard').click(newCard);
    $('#NewDeck').click(newDeck);
    $('#CardFilter').click(showCards);
    $('#DeckFilter').click(showDecks);

    $(decks).on('change', function() {
      setDeckCount(this.length());
    });

    $(cards).on('change', function() {
      setCardCount(this.length());
    });

    decks.reload(function() {
      cards.reload(function() {
        showCards();
      });
    });
  });

  return exports;
})();
