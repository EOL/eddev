window.CardManager = (function() {
  function ResourceCollection(loadFn, loadSingleFn, wrapperFn) {
    var that = this
      , items
      ;

    if (!wrapperFn) {
      wrapperFn = function(item) {
        return item
      };
    }

    that.reload = function(cb) {
      loadFn(function(newItems) {
        var wrapped = new Array(newItems.length);

        for (var i = 0; i < newItems.length; i++) {
          wrapped[i] = wrapperFn(newItems[i]);
        }

        items = wrapped;
        fireChange();
        cb(that);
      });
    }

    that.reloadItem = function(id, cb) {
      if (loadSingleFn) {
        loadSingleFn(id, function(item) {
          replace(id, item);
          fireChange();
          cb(item);
        });
      } else {
        throw new Error('loadSingleFn not set');
      }
    }

    that.length = function() {
      return items.length;
    }

    that.push = function(item) {
      item = wrapperFn(item);
      items.unshift(item);
      $(that).triggerHandler('addItem', item);
      fireChange();
    }

    that.items = function() {
      return items;
    }

    that.get = function(id) {
      return items[findIndex(id)]
    }

    that.delete = function(id) {
      var item = items.splice(findIndex(id), 1)[0];
      $(that).triggerHandler('deleteItem', item)
      fireChange();
    }

    function findIndex(id) {
      return items.findIndex(function(item) {
        return item.id === id;
      });
    }

    function replace(id, newItem) {
      var index = findIndex(id);
      items[index] = wrapperFn(newItem);
    }

    function fireChange() {
      $(that).triggerHandler('change');
    }
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

  function loadSingleDeck(id, cb) {
    $.getJSON(apiPath + '/decks/' + id, cb);
  }

  function loadSingleCard(id, cb) {
    $.getJSON(apiPath + '/cards/' + id + '/json', cb);
  }

  function cardSummaryWrap(card) {
    return {
      id: card.id,
      deck: card.deck
    };
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
    , deckOptionsTempl
    , deckFilterItemsTempl
    , loadingTempl
    , emptyNewTempl
    , userResourceTempl
    ;

  /*
   * CONSTANTS
   */
  var allDecksId = -1
    ;

  /*
   * STATE
   */
  var idsToElmts
    , cardSelectedCb
    , curScreen
    , cards = new ResourceCollection(reloadCards, loadSingleCard, cardSummaryWrap)
    , decks = new ResourceCollection(reloadDecks, loadSingleDeck, null)
    ;

  function openLightbox(templName, suppressDocClick) {
    var $lightbox = $(lightboxTempl({
          templ: function() {
            return templName
          }}))
      , inner = $lightbox.find('.lightbox')
      , enableFn = Util.disablePage($lightbox)
      ;

    $('#Page').prepend($lightbox);

    function docClickHandler(e) {
      if (!e.originalEvent.innerContains) {
        closeFn();
      }
    }

    if (!suppressDocClick) {
      inner.click(function(e) {
        e.originalEvent.innerContains = true;
      });

      $(document).click(docClickHandler);
    }

    function closeFn() {
      $(document).off('click', docClickHandler);
      $lightbox.remove();
      enableFn();
    }

    return {
      lightbox: $lightbox,
      inner: $lightbox.find('.lightbox'),
      closeFn: closeFn
    }
  }

  function loadingState() {
    return openLightbox('loading', true);
  }

  function errorAlert() {
    alert('An unexpected error occurred');
  }

  function newCard(defaultDeckId) {
    var lightboxResult = openLightbox('speciesSearch')
      , $search = lightboxResult.lightbox
      , $inner = lightboxResult.inner
      , $results = $search.find('.search-results')
      , $resultsWrap = $search.find('.search-results-wrap')
      , $createMenu = $search.find('.create-menu')
      , $createBtn = $createMenu.find('.create-btn-wrap')
      , $resultCount = $search.find('.result-count')
      , $deckSelectWrap = $search.find('.deck-select-wrap')
      , $deckSelectClone = $('#DeckFilter').clone()
      , closeFn = lightboxResult.closeFn
      , noDeckId = '-1'
      , disableDeckSelect = defaultDeckId != null || !decks.items().length
      , selectedDeckId = defaultDeckId != null ? defaultDeckId : noDeckId
      , docClickHandler
      , resultSelectFn
      , reqCount = 0
      , deckSelect
      ;

    $createBtn.click(createBtnClick);

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
      $createBtn.addClass('disabled');
      $resultCount.addClass('hidden');

      if (val && val.length >= 3) {
        $spin = $(searchSpinnerTempl());
        $resultsWrap.removeClass('hidden');
        $results.append($spin);

        taxonSearch(val, function(data) {
          var countStr;

          $spin.remove();
          $createMenu.removeClass('hidden');

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

    // TODO: Hackity hack hack hack. Gross.
    $deckSelectClone.attr('id', null);
    $deckSelectClone.addClass('selected');
    $deckSelectClone.css('margin-left', 0);
    $deckSelectWrap.append($deckSelectClone);

    $deckSelectClone.find('.filter-items').html($(deckOptionsTempl({
      decks: decks.items(),
      noSelectionId: noDeckId
    })));

    deckSelect = new SelectFilter($deckSelectClone, selectedDeckId, 'click.closeSearch', docClickHandler);

    if (disableDeckSelect) {
      deckSelect.disable();
    }

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

      $createBtn.removeClass('disabled');

      if (!$that.find('.result-details').length && !$that.find('.result-detail-spinner').length) {
        $spinner = $(resultDetailSpinnerTempl());
        $that.append($spinner);

        $.getJSON(apiPath + '/taxon_details/' + $that.data('id'), function(data) {
          $spinner.remove();

          if (!data.commonName) {
            data.commonName = '(not found)';
          }

          $that.append($(searchResultDetailsTempl(data)));
        });
      }
    }

    function createBtnClick() {
      if ($(this).hasClass('disabled')) {
        return;
      }

      var $selected = $results.find('.search-result.expanded')
        , deckSelection = deckSelect.selection()
        ;

      if (deckSelection == noDeckId) {
        deckSelection = null;
      }

      newCardForDeck($selected.data('id'), deckSelection);
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
    var removeLoadingFn
      , path = deckId === null ? '/cards' : '/decks/' + deckId + '/cards'
      ;

    if (!taxonId) {
      return;
    }

    fixLayout();
    removeLoadingFn = loadingState().closeFn;

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
        cards.push(card);
        removeLoadingFn();

        if (deckId) {
          decks.reloadItem(deckId, function() {
            selectDeck(deckId);
          });
        } else {
          showCards();
        }
      },
      error: function() {
        removeLoadingFn();
        errorAlert();
      }
    });
  }

  function deleteCard(id) {
    cards.delete(id);
  }

  function populateDeckFromCollection(deckId, colId, cb) {
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url: apiPath + '/decks/' + deckId + '/populateFromCollection',
      data: JSON.stringify({
              colId: colId
            }),
      success: function(data) {
        pollCollectionJob(data.jobId, cb);
      }
    });
  }

  function pollCollectionJob(jobId, cb) {
    $.getJSON(apiPath + '/collectionJob/' + jobId + '/status', function(data) {
      if (data.status === 'pending') {
        setTimeout(pollCollectionJob.bind(null, jobId, cb), 1000);
      } else {
        cb();
      }
    });
  }

  function newDeckHelper(e) {
    var lightboxResult = openLightbox('newDeck')
      , $nameInput = lightboxResult.lightbox.find('.deck-name')
      , $submitBtn = lightboxResult.lightbox.find('.create-deck-btn')
      , $colIdInput = lightboxResult.lightbox.find('.col-id')
      ;

    function submit() {
      var deckName = $nameInput.val()
        , colId = $colIdInput.val()
        , closeLoadingFn
        ;

      if (deckName) {
        closeLoadingFn = loadingState().closeFn;

        $.ajax({
          url: apiPath + '/decks',
          method: 'POST',
          data: JSON.stringify({ name: deckName }),
          success: function(deck) {
            decks.push(deck);
            lightboxResult.closeFn();

            if (colId) {
              populateDeckFromCollection(deck.id, colId, function() {
                closeLoadingFn();
                cards.reload(function() {
                  decks.reloadItem(deck.id, function() {
                    selectDeck(deck.id);
                  })
                });
              });
            } else {
              lightboxResult.closeFn();
              closeLoadingFn();
              selectDeck(deck.id);
            }
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

            closeLoadingFn();
            alert(alertMsg);
          }
        });
      } else {
        lightboxResult.inner.effect('shake');
        return false;
      }
    }

    function submitIfEnter(e) {
      if (e.which === 13) {
        submit();
      }
    }

    $submitBtn.click(submit);
    $nameInput.keyup(submitIfEnter);
    $colIdInput.keyup(submitIfEnter);
  }

  function newDeck(e) {
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

    idsToElmts = {};

    return $userResources;
  }

  function selectDeck(id) {
    setDeckFilterSelection(id);
    selectFilter('DeckFilter');
    showSelectedDeck($('#DeckFilter .filter-items'));
  }

  function setDeckFilterSelection(id) {
    var $selection = $('#DeckFilter .filter-item[data-id="' + id + '"]');

    $('#DeckFilter .filter-items').addClass('hidden');
    $('#DeckFilter .filter-item').removeClass('selected');
    $selection.addClass('selected');
    $('#DeckFilter .filter-selection').html($selection.html());
  }

  function destroyDeck($deckElmt, deck) {
    var confirmation = confirm('Are you sure you want to delete this deck and all its cards?');

    if (!confirmation) return;

    $.ajax({
      url: apiPath + '/decks/' + deck.id,
      method: 'DELETE',
      success: function() {
        decks.delete(deck.id);
        $deckElmt.remove();
        cards.reload(function() {
          showDecks();
        });
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
    if ($placeholder.find('.user-resource').length) {
      return;
    }

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
    var $overlay;

    if ($elmt.hasClass('selected')) {
      return;
    }

    $overlay = $(overlayTemplate());

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
  function cardMouseenter($card, id, event) {
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
      selectDeck.bind(null, deck.id),
      $deck,
      deck.id,
      event
    );
  }

  /*
   * Add click event handler to a card and load its image
   *
   * Parameters:
   *   $card - card element
   *   id - the card id
   */
  function loadCardImgAndBindEvents($card, id) {
    $card.mouseenter(cardMouseenter.bind(null, $card, id));
    $card.mouseleave(unselectResourceHelper.bind(null, $card));

    loadCardImg($card, id);
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
        cards.delete(id);
        $card.remove();
        showCards();
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
   * Click handler for card overlay edit buttons.
   *
   * Parameters:
   *   $btn - the button
   *   id - the card id
   */
  function cardEditClicked($btn, id) {
    loadCardForEditing(id);
  }

  function deckIdUrl(cardId) {
    return apiPath + '/cards/' + cardId + '/deck_id';
  }

  function setCardDeck(cardId, deckId, success, error) {
    $.ajax({
      method: 'put',
      url: deckIdUrl(cardId),
      data: deckId,
      contentType: 'text/plain',
      success: success,
      error: error
    });
  }

  function removeCardDeck(cardId, success, error) {
    $.ajax({
      method: 'delete',
      url: deckIdUrl(cardId),
      success: success,
      error: error
    });
  }

  function cardResource(card) {
    var deckName = card.deck ? card.deck.name : 'Deck name'
      , $cardElmt = $(userResourceTempl({
          inner: function() {
            return 'cardResource';
          },
          decks: decks.items(),
          id: card.id
        }))
      , select
      ;

    select = new DeckAssignSelect(
      $cardElmt.find('.deck-assign-select'),
      card.id,
      card.deck ? card.deck.id : null
    );

    return $cardElmt;
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
      , $newCardElmt
      ;

    idsToElmts = {};

    if (cards.items().length) {
      $.each(cards.items(), function(i, card) {
        var $placeholder = cardResource(card);

        idsToElmts[card.id] = $placeholder;
        $userCards.append($placeholder);
      });

      fixLayout();
      loadVisibleCards();
      $userCards.scroll(loadVisibleCards);
    } else {
      $newCardElmt = $(emptyNewTempl({
        noItemsMsg: "You don't have any cards yet.",
        createItemMsg: 'Create a card'
      }));

      $newCardElmt.click(function() {
        newCard();
        return false;
      });
      $userCards.append($newCardElmt);
    }
  }

  function loadVisibleCards() {
    var $userResources = $('#UserResources')
      , innerHeight = $userResources.innerHeight();
      ;

    $userResources.find('.resource-wrap').each(function() {
      var $card = $(this)
        , cardPosnTop = $card.position().top
        , cardMargin = $card.outerHeight() - $card.innerHeight()
        ;

      if (cardPosnTop + cardMargin < innerHeight) {
        loadCardImgAndBindEvents($card, $card.data('id'));
      }
    });
  }

  function selectFilter(id) {
    $('.filter').removeClass('selected');
    $('#' + id).addClass('selected');
  }

  function loadDeckCards(deckId) {
    var $userCards = cleanUserResources()
      , $newCardBtn = $(newCardInDeckTempl())
      , ids = decks.get(deckId).cardIds
      ;

    if (ids.length) {
      $.each(ids, function(i, id) {
        var $placeholder = $(cardPlaceholderTemplate({ cardId: id }));
        $userCards.append($placeholder);
        idsToElmts[id] = $placeholder;
        loadCardImgAndBindEvents($placeholder, id);
      });
    } else {
      $newCardBtn.find('.new-btn').click(newCard.bind(null, deckId));
      $userCards.append($newCardBtn);
    }

    fixLayout();
  }

  /*
   * Load the user's cards into the #UserResources area
   */
  function showCards() {
    selectFilter('CardFilter');
    buildCards();
  }

  function selectDeckFilter() {
    selectFilter('DeckFilter');
    showSelectedDeck($('#DeckFilter .filter-items'));
    return false;
  }

  function openDeckFilter() {
    var $filterItems = $('#DeckFilter .filter-items');

    selectDeckFilter();
    $filterItems.removeClass('hidden');

    $(document).one('click', function() {
      $filterItems.addClass('hidden')
    });

    return false;
  }

  function loadAllDecksScreen() {
    selectFilter('DeckFilter');
    showDecks();

    return false;
  }

  function showDecks() {
    var $deckContainer = cleanUserResources()
      , $newBtn
      ;

    if (decks.items().length) {
      $.each(decks.items(), function(i, deck) {
        var $deckElmt = $(deckTemplate({ deckName: deck.name }));

        if (deck.titleCardId) {
          loadCardImg($deckElmt, deck.titleCardId);
        }

        $deckElmt.mouseenter(deckClicked.bind(null, $deckElmt, deck));
        $deckElmt.mouseleave(unselectResourceHelper.bind(null, $deckElmt));
        $deckContainer.append($deckElmt);
      });
    } else {
      $newBtn = $(emptyNewTempl({
        noItemsMsg: "You don't have any decks yet.",
        createItemMsg: "Create a deck"
      }));

      $newBtn.click(newDeck);
      $deckContainer.append($newBtn);
    }

    fixLayout();
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

  function setDeckFilterOptions() {
    var $container = $('#DeckFilter .filter-items')
      , $selected = $container.find('.selected')
      , selectedId = $selected.length ? $selected.data('id') : null
      , curSelection = $
      , $elmt = $(deckFilterItemsTempl({
          decks: decks.items(),
          allId: allDecksId
        }))
      ;

    $container.html($elmt);

    if (selectedId !== null) {
      setDeckFilterSelection(selectedId);
    }

    $container.find('.filter-item').click(function() {
      selectDeck($(this).data('id'));
    });
  }

  function showSelectedDeck($filterItems) {
    var id = $filterItems.find('.selected').data('id');

    if (id == allDecksId) {
      showDecks();
    } else {
      loadDeckCards(id);
    }
  }

  function reloadCardDeckIfPresent(e, card) {
    if (card.deck) {
      decks.reloadItem(card.deck.id, function() {});
    }
  };

  function SelectFilter($elmt, selectedId, suspendDocEvent, suspendDocHandler) {
    var that = this
      , $arrow = $elmt.find('.down-arrow')
      , $choicesWrap = $elmt.find('.filter-items')
      , $choices = $elmt.find('.filter-item')
      , $selection = $elmt.find('.filter-selection')
      , disabled = false
      , selectedId
      ;

    function selectItem($item) {
      var text = $item.html()
        , id = $item.data('id')
        ;

      $choices.removeClass('selected');
      $item.addClass('selected');
      $selection.html(text);

      selectedId = id;

      return id;
    }

    function clearEvents() {
      $elmt.off();
      $elmt.find('*').off();
    }

    function bindEvents() {
      clearEvents(); //make idempotent

      $elmt.click(function() {
        $(that).triggerHandler('click');
      });

      $arrow.click(function() {
        $choicesWrap.removeClass('hidden');

        if (suspendDocEvent) {
          $(document).off(suspendDocEvent);
        }

        $(document).one('click', function() {
          $choicesWrap.addClass('hidden');
          $(document).on(suspendDocEvent, suspendDocHandler);
          return false;
        });

        return false;
      });

      $choices.click(function() {
        var id = selectItem($(this));
        $(that).triggerHandler('select', id);
      });
    }

    selectItem($choices.filter('[data-id="' + selectedId + '"]'));
    bindEvents();

    that.disable = function() {
      $elmt.removeClass('selected');
      clearEvents();
    }

    that.enable = function() {
      $elmt.addClass('selected');
      bindEvents();
    }

    that.selection = function() {
      return selectedId;
    }
  }

  function DeckAssignSelect($elmt, cardId, selectedId) {
    var that = this
      , $choiceWrap = $elmt.find('.deck-assign-choices')
      , $choices = $elmt.find('.deck-assign-choice')
      , $deckName = $elmt.find('.deck-name')
      , $topArea = $elmt.find('.deck-assign-top')
      , $openMsg = $elmt.find('.open-msg')
      , noDeckId = -1
      ;

    if (selectedId === null) {
      selectedId = noDeckId;
    }

    function setSelection($choice) {
      $deckName.html($choice.data('display-name'));
      $openMsg.html($choice.data('open-msg'));
    }

    setSelection($choices.filter('[data-id="' + selectedId + '"]'));

    $topArea.click(function(e) {
      var top = this;

      if ($choiceWrap.hasClass('hidden')) {
        $choiceWrap.removeClass('hidden');

        function deckAssignClose(e) {
          if (
            !$(e.target).is($(top)) &&
            !$(e.target).parent('.deck-assign-top').is($(top))
          ) {
            $choiceWrap.addClass('hidden');
            $(document).off('click', deckAssignClose);
          }
        }

        $(document).on('click', deckAssignClose);
      }
    });

    $choices.click(function() {
      var $choice = $(this)
        , deckId = $choice.data('id')
        ;

      function success() {
        setSelection($choice);
        cards.reloadItem(cardId, function() {
          decks.reload(function() {});
        });
      }

      if (deckId === noDeckId) {
        removeCardDeck(cardId, success, errorAlert);
      } else {
        setCardDeck(cardId, deckId, success, errorAlert);
      }
    });
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
    deckOptionsTempl = Handlebars.compile($('#DeckOptionsTemplate').html());
    newCardInDeckTempl = Handlebars.compile($('#NewCardInDeckTemplate').html());
    deckFilterItemsTempl = Handlebars.compile($('#DeckFilterItemsTemplate').html());
    emptyNewTempl = Handlebars.compile($('#EmptyNewTemplate').html());
    userResourceTempl = Handlebars.compile($('#UserResourceTemplate').html());

    Handlebars.registerPartial('loading', $('#LoadingTemplate').html());
    Handlebars.registerPartial('speciesSearch', $('#SpeciesSearchTemplate').html());
    Handlebars.registerPartial('newDeck', $('#NewDeckLightboxTemplate').html());
    Handlebars.registerPartial('cardResource', $('#CardResourceTemplate').html());

    $('#NewCard').click(newCard.bind(null, null));
    $('#NewDeck').click(newDeck);
    $('#CardFilter').click(showCards);
    $('#DeckFilter .btn').click(selectDeckFilter);
    $('#DeckFilter .down-arrow').click(openDeckFilter);

    $(decks).on('change', function() {
      setDeckCount(this.length());
    });

    $(decks).on('change', function() {
      setDeckFilterOptions();
    });

    $(cards).on('change', function() {
      setCardCount(this.length());
    });

    $(cards).on('addItem deleteItem', reloadCardDeckIfPresent);

    decks.reload(function() {
      cards.reload(function() {
        showCards();
      });
    });
  });

  return exports;
})();
