import React from 'react'
import ReactModal from 'react-modal'
import update from 'immutability-helper'

import UserResources from './user-resources'
import NewResourceBtn from './new-resource-btn'
import UserResourceFilter from './user-resource-filter'
import Card from './card'
import SpeciesSearchLightbox from './species-search-lightbox'
import NewDeckLightbox from './new-deck-lightbox'

import ladybugIcon from 'images/card_maker/icons/ladybug.png'
import eolHdrIcon from 'images/card_maker/icons/eol_logo_sub_hdr.png'
import newCardIcon from 'images/card_maker/icons/new_card.png'
import managerLogo from 'images/card_maker/icons/card_manager_logo.png'
import newDeckIcon from 'images/card_maker/icons/new_deck.png'

const allDecksId = -1;

class CardManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      decks: [],
      selectedFilter: 'cards',
      selectedDeckId: allDecksId,
      speciesSearchOpen: false,
      newDeckOpen: false,
      speciesSearchDeckId: allDecksId,
    }
  }

  componentDidMount() {
    var that = this;

    $.ajax({
      url: 'card_maker_ajax/decks',
      method: 'GET',
      success: (decks) => {
        $.ajax({
          url: 'card_maker_ajax/card_summaries',
          method: 'GET',
          success: (cards) => {
            that.setState((prevState, props) => {
              return {
                cards: cards,
                decks: decks,
              }
            });
          }
        });
      }
    });
  }

  assignCardDeck = (cardId, deckId) => {
    const url = '/card_maker_ajax/cards/' + cardId + '/deck_id'
        , card = this.state.cards.find((card) => {
            return card.id === cardId
          })
        , decksToReloadIds = []
        ;

    var successFn;

    if (card.deck) {
      decksToReloadIds.push(card.deck.id);
    }

    if (deckId != null) {
      decksToReloadIds.push(deckId);
    }

    successFn = this.replaceCardAndReloadDecks.bind(null, decksToReloadIds);

    if (deckId != null) {
      $.ajax(url, {
        method: 'PUT',
        data: deckId,
        contentType: 'text/plain',
        success: successFn,
      });
    } else {
      $.ajax(url, {
        method: 'DELETE',
        success: successFn,
      });
    }
  }

  reloadDecks = (deckIds) => {
    for (const deckId of deckIds) {
      $.ajax('/card_maker_ajax/decks/' + deckId, {
        method: 'GET',
        success: this.replaceDeck,
      })
    }
  }

  // To be called after a card has a deck assigned/unassigned, since the
  // deck's titleCardId may have changed
  replaceCardAndReloadDecks = (deckIds, card) => {
    this.replaceCard(card);
    this.reloadDeckIds(deckIds);
  }

  findResourceIndex = (colName, id) => {
    return this.state[colName].findIndex((resource) => {
      return resource.id === id;
    });
  }

  replaceResource = (colName, resource) => {
    const index = this.findResourceIndex(colName, resource.id);

    this.setState((prevState, props) => {
      return update(prevState, {
        [colName]: { [index]: { $set: resource } }
      })
    });
  }

  removeResource = (colName, id) => {
    const index = this.findResourceIndex(colName, id);
    this.setState((prevState, props) => {
      return update(prevState, {
        [colName]: { $splice: [[index, 1]]}
      })
    })
  }

  removeCard = (cardId) => {
    this.removeResource('cards', cardId);
  }

  replaceCard = (card) => {
    this.replaceResource('cards', card)
  }

  replaceDeck = (deck) => {
    this.replaceResource('decks', deck);
  }

  showLoadingOverlay = () => {
    this.setState(() => {
      return {
        showLoadingOverlay: true,
      }
    })
  }

  hideLoadingOverlay = () => {
    this.setState(() => {
      return {
        showLoadingOverlay: false,
      }
    })
  }

  handleDestroyResource(confirmMsg, resourceType, id) {
    const that = this
        , shouldDestroy = confirm(confirmMsg)
        ;

    if (!shouldDestroy) return;

    that.showLoadingOverlay();
    $.ajax({
      url: 'card_maker_ajax/' + resourceType + '/' + id,
      method: 'DELETE',
      success: () => {
        that.removeResource(resourceType, id);
        that.hideLoadingOverlay();
      }
    });
  }

  handleDestroyCard = (id) => {
    this.handleDestroyResource(
      'Are you sure you want to delete this card?',
      'cards',
      id
    );
  }

  handleDestroyDeck = (id) => {
    this.handleDestroyResource(
      'Are you sure you want to delete this deck?',
      'decks',
      id
    );
  }

  handleOpenNewCardLightbox = () => {
    this.setState(() => {
      return {
        speciesSearchOpen: true,
      }
    })
  }

  handleOpenNewDeckLightbox = () => {
    this.setState(() => {
      return {
        newDeckOpen: true,
      }
    })
  }

  deckFilterItemsHelper = (noSelectionText, includeCount) => {
    const items = this.state.decks.map((deck) => {
      return {
        name: deck.name,
        id: deck.id,
        count: (includeCount ? deck.cardIds.length : null),
      }
    });
    items.unshift({
      name: noSelectionText,
      id: allDecksId,
      count: (includeCount ? this.state.decks.length : null),
    });
    return items;
  }

  deckFilterItems = () => {
    return this.deckFilterItemsHelper('All decks', true);
  }

  deckFilterItemsForNewCard = () => {
    return this.deckFilterItemsHelper('—', false);
  }

  cardFilterItems() {
    return [{
      name: 'All cards'
    }];
  }

  handleDeckFilterSelect = deckId => {
    this.setState((prevState, props) => {
      return {
        selectedDeckId: deckId
      }
    });
  }

  handleDeckFilterClick = () => {
    this.setState((prevState, props) => {
      return {
        selectedFilter: 'decks',
      }
    });
  }

  handleCardFilterClick = () => {
    this.setState((prevState, props) => {
      return {
        selectedFilter: 'cards',
      }
    });
  }

  selectedResources = () => {
    const that = this;

    var resources
      , resourceType
      ;

    if (that.state.selectedFilter === 'decks') {
      if (that.state.selectedDeckId === allDecksId) {
        resources = that.state.decks;
        resourceType = 'deck';
      } else {
        resources = that.state.cards.filter((card) => {
          return card.deck && card.deck.id === that.state.selectedDeckId;
        });
        resourceType = 'card';
      }
    } else {
      resources = that.state.cards;
      resourceType = 'card';
    }

    return {
      resources: resources,
      resourceType: resourceType,
    };
  }

  selectedResourceType = () => {
    var resourceType;

    if (this.state.selectedFilter === 'decks' &&
      this.state.selectedDeckId === allDecksId
    ) {
      resourceType = 'deck';
    } else {
      resourceType = 'card'
    }
  }

  handleSpeciesSearchClose = () => {
    this.setState(() => {
      return {
        speciesSearchOpen: false,
        speciesSearchDeckId: allDecksId,
      }
    })
  }

  handleCreateCard = (id) => {
    const that = this
        , deckId = that.state.speciesSearchDeckId
        , url = deckId !== allDecksId ?
          '/card_maker_ajax/decks/' + deckId + '/cards' :
          '/card_maker_ajax/cards'
        ;

    if (!id) {
      return;
    }

    this.setState(() => {
      return {
        showLoadingOverlay: true,
        speciesSearchOpen: false,
      }
    });

    $.ajax({
      url: url,
      data: JSON.stringify({
        templateName: 'trait',
        templateParams: {
          speciesId: id
        }
      }),
      contentType: 'application/json',
      method: 'POST',
      success: (card) => {
        that.setState((prevState, props) => {
          return update(prevState, {
            cards: { $unshift: [card] },
            showLoadingOverlay: { $set: false },
          })
        });

        if (deckId !== allDecksId) {
          that.reloadDecks([deckId]);
        }
      },
      error: () => {
        alert('Something went wrong');
        this.setState(() => {
          return {
            showLoadingOverlay: false
          }
        })
      }
    })
  }

  handleCreateDeck = (deckName, colId) => {
    const that = this;

    $.ajax({
      url: 'card_maker_ajax/decks',
      method: 'POST',
      data: JSON.stringify({ name: deckName }),
      success: function(deck) {
        that.setState((prevState, props) => {
          return update(prevState, {
            decks: { $unshift: [deck]},
          });
        });
        /*
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
        */
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
  }

  handleDeckRequestClose = () => {
    this.setState(() => {
      return {
        newDeckOpen: false,
      }
    });
  }

  handleSpeciesSearchDeckSelect = (id) => {
    this.setState(() => {
      return {
        speciesSearchDeckId: id,
      }
    })
  }

  render() {
    var resourceResult = this.selectedResources();

    return (
      <div id='CardManagerWrap'>
        <ReactModal
          isOpen={this.state.showLoadingOverlay}
          parentSelector={() => {return document.getElementById('Page')}}
          contentLabel='Loading spinner'
          className='global-loading lightbox'
          overlayClassName='fixed-center-wrap disable-overlay'
          bodyOpenClassName='noscroll'
        >
          <i className='fa fa-spin fa-spinner fa-4x' />
        </ReactModal>
        <div className='hdr-spacer red'></div>
        <div id='CardManager' className='card-manager card-screen'>
          <div className='screen-inner manager-inner'>
            <div className='welcome-block maker-welcome-block'>
              <img src={ladybugIcon} className='ladybug' />
              <h3 className='welcome-txt'>
                <span className='big-letter'>W</span>
                <span>elcome to the </span>
                <img src={eolHdrIcon} className='eol_logo' />
                <span> Card Manager.</span>
              </h3>
            </div>
            <div className="manager-ctrls">
              <div className="new-resource-btns">
                <NewResourceBtn
                  icon={newCardIcon}
                  id='NewCard'
                  text='Create a card'
                  btnClass='new-card-btn'
                  handleClick={this.handleOpenNewCardLightbox}
                />
                <SpeciesSearchLightbox
                  isOpen={this.state.speciesSearchOpen}
                  handleClose={this.handleSpeciesSearchClose}
                  handleCreateCard={this.handleCreateCard}
                  deckFilterItems={this.deckFilterItemsForNewCard()}
                  selectedDeckId={this.state.speciesSearchDeckId}
                  handleDeckSelect={this.handleSpeciesSearchDeckSelect}
                />
                <img src={managerLogo} className='manager-logo' id='ManagerLogo' />
                <NewResourceBtn
                  icon={newDeckIcon}
                  id='NewDeck'
                  text='Create a deck'
                  btnClass='new-deck-btn'
                  handleClick={this.handleOpenNewDeckLightbox}
                />
                <NewDeckLightbox
                  isOpen={this.state.newDeckOpen}
                  handleCreate={this.handleCreateDeck}
                  handleRequestClose={this.handleDeckRequestClose}
                />
              </div>
              <div className='filters'>
                <UserResourceFilter
                  selected={this.state.selectedFilter === 'cards'}
                  iconClass='icon-card'
                  className='first'
                  count={this.state.cards.length}
                  handleSelect={this.handleDeckFilterSelect}
                  handleClick={this.handleCardFilterClick}
                  filterItems={this.cardFilterItems()}
                />
                <UserResourceFilter
                  selected={this.state.selectedFilter === 'decks'}
                  iconClass='icon-deck'
                  count={this.state.decks.length}
                  filterItems={this.deckFilterItems()}
                  handleSelect={this.handleDeckFilterSelect}
                  handleClick={this.handleDeckFilterClick}
                  handleMenuOpenClick={this.handleDeckMenuOpenClick}
                  selectedId={this.state.selectedDeckId}
                />
              </div>
            </div>
            <UserResources
              resources={resourceResult.resources}
              decks={this.state.decks}
              resourceType={resourceResult.resourceType}
              handleCardDeckSelect={this.assignCardDeck}
              handleEditCard={this.props.handleEditCard}
              handleDestroyCard={this.handleDestroyCard}
              handleDestroyDeck={this.handleDestroyDeck}
              handleNewCard={this.handleOpenNewCardLightbox}
              handleNewDeck={this.handleOpenNewDeckLightbox}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default CardManager
