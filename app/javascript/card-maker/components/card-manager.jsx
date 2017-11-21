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
import iguanaBanner from 'images/card_maker/iguana_banner.jpg'

import styles from "stylesheets/card_maker/card_manager"

const allDecksDeck = {
        id: -1,
        name: I18n.t('react.card_maker.all_decks'),
      }
    , allCardsDeck = {
        id: -2,
        name: I18n.t('react.card_maker.all_cards'),
      }
    , pollIntervalMillis = 1000
    ;


class CardManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      decks: [],
      selectedFilter: 'cards',
      selectedDeck: allCardsDeck,
      speciesSearchOpen: false,
      newDeckOpen: false,
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

  handleDeckSelect = (deck) => {
    this.setState({
      selectedDeck: deck
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

    let resources
      , resourceType
      ;

    if (that.state.selectedDeck === allDecksDeck) {
      resourceType = 'deck';
      resources = this.state.decks;
    } else {
      resourceType = 'card';
      
      if (that.state.selectedDeck === allCardsDeck) {
        resources = that.state.cards;
      } else {
        resources = that.state.cards.filter((card) => {
          return card.deck && card.deck.id === that.state.selectedDeck.id
        });
      }
    }

    return {
      resources: resources,
      resourceType: resourceType,
    };
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
    const that = thisß;

    $.getJSON(cardMakerUrl('collectionJob/' + jobId + '/status'), function(data) {
      if (data.status === 'running') {
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

  handleDeckPdf = (id) => {
    const that = this;

    that.props.showLoadingOverlay();

    $.ajax({
      url: cardMakerUrl('deck_pdfs'),
      data: JSON.stringify({
        deckId: id
      }),
      method: 'POST',
      success: (result) => {
        that.pollPdfJob(result.jobId)
      }
    });
  }

  pollPdfJob = (id) => {
    const that = this;

    $.getJSON(cardMakerUrl('deck_pdfs/' + id + '/status'), (result) => {
      if (result.status === 'done') {
        that.props.hideLoadingOverlay();
        window.open(cardMakerUrl('deck_pdfs/' + id + '/result'));
      } else if (result.status === 'running') {
        setTimeout(() => {
          that.pollPdfJob(id)
        }, pollIntervalMillis)
      } else {
        that.props.hideLoadingOverlay();
        alert(I18n.t('react.card_maker.unexpected_error_msg'));
      }
    });
  }

  deckItem = (deck) => {
    return (
      <li
        key={deck.id}
        onClick={() => this.handleDeckSelect(deck)}  
        className={[styles.deck, 
          (this.state.selectedDeck === deck ? styles.isDeckSel : '')
        ].join(' ')}
      >
        {deck.name}
      </li>
    )
  }

  selectedResourceCount = (resourceResult) => {
    const count = resourceResult.resources.length;
    let i18nKey;

    if (resourceResult.resourceType === 'card') {
      i18nKey = 'react.card_maker.n_cards';
    } else if (resourceResult.resourceType === 'deck') {
      i18nKey = 'react.card_maker.n_decks';
    } else {
      throw new TypeError('Resource type invalid: ' 
        + resourceResult.resourceType);
    }

    return I18n.t(i18nKey, {
      count: count
    });
  }

  // TODO: add cardsHdr icons after building a proper icon font. Last round was a hack job.
  render() {
    var resourceResult = this.selectedResources();
    return (
      <div>
        <div className={styles.lBanner}>
          <img src={iguanaBanner} />
        </div>
        <div className={styles.lLeftRail}>
          <div className={styles.cardsHdr}>
            <h2>Cards logo goes here</h2>
          </div>
          <div className={styles.ctrls}>
            <div className={[styles.btn, styles.btnCtrls].join(' ')}>NEW</div>
            <div className={styles.libCtrls} >
              <div className={styles.libCtrlsActive}>your cards</div>
              <div className={styles.tog}>view public cards</div>
            </div>
            <input type='text' className={styles.search} placeholder='search decks...'/>
          </div>
          <ul className={styles.decks}>
            {this.deckItem(allCardsDeck)}
            {this.deckItem(allDecksDeck)}
            {this.state.decks.map(this.deckItem)}
          </ul>
        </div>
        <div className={styles.lResources}>
          <div className={styles.menuBar}>
            <div className={styles.menuBarAnchorContain}>
              <div className={styles.menuAnchor}>
                <span>{this.state.selectedDeck ? this.state.selectedDeck.name : ''} &nbsp;&nbsp;</span>
                <i className='fa fa-caret-down' />
              </div>
            </div>
            <div className={styles.menuBarCount}>
              {this.selectedResourceCount(resourceResult)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardManager
