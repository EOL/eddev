import React from 'react'
import update from 'immutability-helper'

import UserResources from './user-resources'
import NewResourceBtn from './new-resource-btn'
import UserResourceFilter from './user-resource-filter'
import Card from './card'
import SpeciesSearchLightbox from './species-search-lightbox'
import NewDeckLightbox from './new-deck-lightbox'
import {cardMakerUrl} from 'lib/card-maker/url-helper'

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

  reloadResourcesWithCb = (cb) => {
    var that = this;

    $.ajax({
      url: cardMakerUrl('decks'),
      method: 'GET',
      success: (decks) => {
        $.ajax({
          url: cardMakerUrl('card_summaries'),
          method: 'GET',
          success: (cards) => {
            that.setState({
              cards: cards,
              decks: decks,
            }, cb);
          }
        });
      }
    });
  }

  reloadResources = () => {
    this.reloadResourcesWithCb(null);
  }

  componentDidMount() {
    this.reloadResources();
  }

  assignCardDeck = (cardId, deckId) => {
    const url = cardMakerUrl('cards/' + cardId + '/deck_id');

    if (deckId != null) {
      $.ajax(url, {
        method: 'PUT',
        data: deckId,
        contentType: 'text/plain',
        success: this.reloadResources,
      });
    } else {
      $.ajax(url, {
        method: 'DELETE',
        success: this.reloadResources,
      });
    }
  }

  handleDestroyResource(confirmMsg, resourceType, id) {
    const that = this
        , shouldDestroy = confirm(confirmMsg)
        ;

    if (!shouldDestroy) return;

    that.props.showLoadingOverlay();
    $.ajax({
      url: cardMakerUrl(resourceType + '/' + id),
      method: 'DELETE',
      success: () => {
        that.reloadResourcesWithCb(that.props.hideLoadingOverlay);
      }
    });
  }

  handleDestroyCard = (id) => {
    this.handleDestroyResource(
      I18n.t('react.card_maker.are_you_sure_delete_card'),
      'cards',
      id
    );
  }

  handleDestroyDeck = (id) => {
    this.handleDestroyResource(
      I18n.t('react.card_maker.are_you_sure_delete_deck'),
      'decks',
      id
    );
  }

  handleOpenNewCardLightbox = () => {
    this.setState((prevState) => {
      return {
        speciesSearchOpen: true,
        speciesSearchDeckId: (
          this.state.selectedFilter === 'decks' ?
          this.state.selectedDeckId :
          allDecksId
        ),
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
    return this.deckFilterItemsHelper(I18n.t('react.card_maker.all_decks'), true);
  }

  deckFilterItemsForNewCard = () => {
    return this.deckFilterItemsHelper('—', false);
  }

  cardFilterItems() {
    return [{
      name: I18n.t('react.card_maker.all_cards')
    }];
  }

  handleDeckSelect = deckId => {
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
          cardMakerUrl('decks/' + deckId + '/cards') :
          cardMakerUrl('cards')
        ;

    if (!id) {
      return;
    }

    that.props.showLoadingOverlay();
    this.setState(() => {
      return {
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
      success: () => {
        that.reloadResourcesWithCb(that.props.hideLoadingOverlay);
      },
      error: () => {
        alert(I18n.t('react.card_manager.unexpected_error_msg'));
        that.props.hideLoadingOverlay();
      }
    })
  }

  showAllDecks = () => {
    this.showDeck(allDecksId);
  }

  showDeck = (id) => {
    this.setState(() => {
      return {
        selectedFilter: 'decks',
        selectedDeckId: id,
      }
    })
  }

  populateDeckFromCollection = (deckId, colId, cb) => {
    const that = this;

    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url: cardMakerUrl('decks/' + deckId + '/populateFromCollection'),
      data: JSON.stringify({
        colId: colId
      }),
      success: function(data) {
        that.pollCollectionJob(data.jobId, cb);
      }
    });
  }

  pollCollectionJob = (jobId, cb) => {
    const that = this
        , pollIntervalMillis = 1000
        ;

    $.getJSON(cardMakerUrl('collectionJob/' + jobId + '/status'), function(data) {
      if (data.status === 'pending') {
        setTimeout(that.pollCollectionJob.bind(null, jobId, cb), pollIntervalMillis);
      } else {
        cb();
      }
    });
  }

  handleCreateDeck = (deckName, colId) => {
    const that = this
        , doneFn = (deckId) => {
            that.reloadResourcesWithCb(() => {
              that.showDeck(deckId);
              that.props.hideLoadingOverlay();
            });
          }
        ;

    that.props.showLoadingOverlay();

    $.ajax({
      url: cardMakerUrl('decks'),
      method: 'POST',
      data: JSON.stringify({ name: deckName }),
      success: (data) => {
        const cb = () => doneFn(data.id);

        if (colId != null && colId.length) {
          that.populateDeckFromCollection(data.id, colId, cb);
        } else {
          cb();
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
          alertMsg = I18n.t('react.card_manager.unexpected_error_msg')
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
        <div className='hdr-spacer red'></div>
        <div id='CardManager' className='card-manager card-screen'>
          <div className='screen-inner manager-inner'>
            <div className='welcome-block maker-welcome-block'>
              <img src={ladybugIcon} className='ladybug' />
              <h3 className='welcome-txt'
                dangerouslySetInnerHTML={{
                  __html: I18n.t('react.card_maker.welcome_card_manager_html', {
                    eolHdrIconPath: eolHdrIcon,
                  })}}
              />
            </div>
            <div className="manager-ctrls">
              <div className="new-resource-btns">
                <NewResourceBtn
                  icon={newCardIcon}
                  id='NewCard'
                  text={I18n.t('react.card_maker.create_a_card')}
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
                  text={I18n.t('react.card_maker.create_a_deck')}
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
                  handleSelect={this.handleDeckSelect}
                  handleClick={this.handleCardFilterClick}
                  filterItems={this.cardFilterItems()}
                />
                <UserResourceFilter
                  selected={this.state.selectedFilter === 'decks'}
                  iconClass='icon-deck'
                  count={this.state.decks.length}
                  filterItems={this.deckFilterItems()}
                  handleSelect={this.handleDeckSelect}
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
              handleDeckSelect={this.handleDeckSelect}
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
