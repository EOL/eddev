import React from 'react'
import update from 'immutability-helper'

import UserResources from './user-resources'
import NewResourceBtn from './new-resource-btn'
import UserResourceFilter from './user-resource-filter'
import Card from './card'
import SpeciesSearchLightbox from './species-search-lightbox'
import NewDeckLightbox from './new-deck-lightbox'
import DeckUsersLightbox from './deck-users-lightbox'
import {cardMakerUrl} from 'lib/card-maker/url-helper'

import ladybugIcon from 'images/card_maker/icons/ladybug.png'
import eolHdrIcon from 'images/card_maker/icons/eol_logo_sub_hdr.png'
import newCardIcon from 'images/card_maker/icons/new_card.png'
import managerLogo from 'images/card_maker/icons/card_manager_logo.png'
import newDeckIcon from 'images/card_maker/icons/new_deck.png'
import iguanaBanner from 'images/card_maker/iguana_banner.jpg'

import styles from 'stylesheets/card_maker/card_manager'

const allDecksDeck = { // unused for now
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
      speciesSearchDeckId: allCardsDeck.id,
      speciesSearchOpen: false,
      newDeckOpen: false,
      newMenuOpen: false,
      showDescInput: false,
      deckDescVal: null,
      deckSearchVal: '',
      library: 'user',
      deckUsersOpen: false,
      menus: {
        new: {
          open: false,
          node: null
        }, 
        deck: {
          open: false,
          node: null
        },
      }
    }
    this.menuNodes = {
      new: null,
      deck: null,
    }
  }

  reloadResourcesWithCb = (cb) => {
    var that = this
      , decksUrl = this.state.library === 'user' ? 'decks'          : 'public/decks'
      , cardsUrl = this.state.library === 'user' ? 'card_summaries' : 'public/cards'
      ;

    $.ajax({
      url: cardMakerUrl(decksUrl),
      method: 'GET',
      success: (decks) => {
        $.ajax({
          url: cardMakerUrl(cardsUrl),
          method: 'GET',
          success: (cards) => {
            let selectedDeck = decks.find((deck) => {
              return deck.id === this.state.selectedDeck.id;
            });

            if (!selectedDeck) {
              selectedDeck = allCardsDeck;
            }

            that.setState({
              cards: cards,
              decks: decks,
              selectedDeck: selectedDeck,
              showDescInput: false
            }, cb);
          }
        });
      }
    });
  }

  reloadResources = () => {
    this.reloadResourcesWithCb(null);
  }

  componentWillMount() {
    document.addEventListener('click', this.handleDocClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocClick);
  }

  componentDidMount() {
    this.reloadResources();
  }

  closeMenu = (name) => {
    this.setState((prevState) => {
      return update(prevState, {
        menus: {
          [name]: {
            open: { $set: false }
          }
        }
      });
    });
  }

  toggleMenu = (name) => {
    this.setState((prevState) => {
      return update(prevState, {
        menus: {
          [name]: { $toggle: ['open'] }
        }
      });
    });
  }

  toggleDeckMenu = () => {
    if (this.state.library === 'user' && this.state.selectedDeck !== allCardsDeck) {
      this.toggleMenu('deck');
    }
  }

  handleDocClick = e => {
    for (let [name, menu] of Object.entries(this.state.menus)) {
      if (
        this.menuNodes[name] &&
        !this.menuNodes[name].contains(e.target) &&
        menu.open
      ) {
        this.closeMenu(name);
      }
    }
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

  handleSpeciesSearchClose = () => {
    this.setState(() => {
      return {
        speciesSearchOpen: false
      }
    });
  }

  handleSpeciesSearchOpen = () => {
    this.setState((prevState) => {
      return {
        speciesSearchOpen: true,
        speciesSearchDeckId: this.state.selectedDeck.id
      }
    })
  }

  handleCreateCard = (id) => {
    const that = this
        , deckId = that.state.speciesSearchDeckId
        , url = deckId !== allCardsDeck.id ?
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

  handleOpenNewDeckLightbox = () => {
    this.setState(() => {
      return {
        newDeckOpen: true,
      }
    })
  }

  handleCloseNewDeckLightbox = () => {
    this.setState(() => {
      return {
        newDeckOpen: false,
      }
    });
  }

  deckFilterItemsHelper = (noSelectionText, includeCount) => {
    const items = this.state.decks.map((deck) => {
      return {
        id: deck.id,
        name: deck.name,
        count: (includeCount ? deck.cardIds.length : null),
      }
    });
    items.unshift({
      id: allCardsDeck.id,
      name: noSelectionText,
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
      selectedDeck: deck,
      showDescInput: false
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

  handleSpeciesSearchDeckSelect = (id) => {
    console.log('select deck ' + id);
    this.setState({
      speciesSearchDeckId: id,
    });
  }

  makeDeckPdf = () => {
    const that = this;

    that.props.showLoadingOverlay();

    $.ajax({
      url: cardMakerUrl('deck_pdfs'),
      data: JSON.stringify({
        deckId: this.state.selectedDeck.id
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

  deckItem = (deck, highlight) => {
    const highlightedName = highlight && highlight.length ?  
            deck.name.replace(highlight, '<strong>' + highlight + '</strong>') :
            deck.name
        ;

    return (
      <li
        key={deck.id}
        onClick={() => this.handleDeckSelect(deck)}  
        className={[styles.deck, 
          (this.state.selectedDeck === deck ? styles.isDeckSel : '')
        ].join(' ')}
        dangerouslySetInnerHTML={{ __html: highlightedName }}
      />
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


  handleDescBtnClick = () => {
    this.closeMenu('deck');
    this.setState({
      showDescInput: true
    });
  }

  handleSetDescBtnClick = () => {
    const url = cardMakerUrl(
            'decks/' +
            this.state.selectedDeck.id +
            '/desc'
          )
        ;

    $.ajax({
      method: 'POST',
      data: this.state.deckDescVal,
      url: url,
      success: () => {
       this.closeAndClearDescInput(); 
       this.reloadResources();
      }
    });
  }

  handleDescInputChange = e => {
    this.setState({
      deckDescVal: e.target.value
    })
  }

  closeAndClearDescInput = () => {
    this.setState({
      showDescInput: false,
      deckDescVal: null,
    });
  }

  deckDescElements = () => {
    let result; 

    if (this.state.showDescInput) {
      result = [
        // Explicit this.state.deckDescVal === null is important since
        // otherwise the value can't ever be ''.
        (
          <textarea 
            className={styles.descInput} 
            value={this.state.deckDescVal === null ? 
                   this.state.selectedDeck.desc :
                   this.state.deckDescVal}
            onChange={this.handleDescInputChange}
            key='0'
            ref={node => node && node.focus()}
          ></textarea>
        ),
        (
          <div 
            className={styles.editDescBtns}
            key='1'
          >
            <div 
              className={styles.descBtn}
              onClick={this.handleSetDescBtnClick}
            >{I18n.t('react.card_maker.save_desc')}</div>
            <div 
              className={styles.descBtn}
              onClick={this.closeAndClearDescInput}
            >{I18n.t('react.card_maker.cancel')}</div>
          </div>
        ),
      ];
    } else if (this.state.selectedDeck === allCardsDeck) {
      if (this.state.library === 'user') {
        result = [I18n.t('react.card_maker.viewing_all_your_cards')];
      } else {
        result = [I18n.t('react.card_maker.viewing_all_public_cards')];
      }
    } else if (this.state.selectedDeck.desc) {
      result = [this.state.selectedDeck.desc];
    } else if (this.state.library === 'user') {
      result = [(
        <div 
          className={styles.descBtn}
          onClick={this.handleDescBtnClick}
          key='0'
        >{I18n.t('react.card_maker.add_desc')}</div>
      )];
    } else {
      result = [];
    }

    return result;
  }

  handleDeckSearchChange = e => {
    this.setState({
      deckSearchVal: e.target.value
    });
  }

  deckItems = () => {
    let searchVal = this.state.deckSearchVal.trim();

    return this.state.decks.filter((deck) => {
      return deck.name.includes(searchVal);
    }).map((deck) => {
      return this.deckItem(deck, searchVal);
    }); 
  }

  setMenuNode = (name, node) => {
    this.menuNodes[name] = node;
  }

  deckMenuContents = () => {
    let contents = '<span>' + this.state.selectedDeck.name
      , isMenu = this.state.library === 'user' && this.state.selectedDeck !== allCardsDeck
      ;

    if (isMenu) {
      contents += '&nbsp;&nbsp;';
    }

    contents += '</span>';

    if (isMenu) {
      contents += "<i class='fa fa-caret-down' />";
    }

    return contents;
  }

  toggleDeckPublic = () => {
    var action = this.state.selectedDeck.public ?
          'make_private' :
          'make_public'
      ;

    $.ajax({
      url: cardMakerUrl('decks/' + this.state.selectedDeck.id + '/' + action),
      method: 'POST',
      success: () => {
        this.reloadResources();
      }
    });
  }

  libCtrls = () => {
    var yourCards       = I18n.t('react.card_maker.your_cards')
      , publicCards     = I18n.t('react.card_maker.public_cards')
      , viewPublicCards = I18n.t('react.card_maker.view_public_cards') 
      , viewYourCards   = I18n.t('react.card_maker.view_your_cards')
      , active          = this.state.library === 'user' ? 
                               yourCards : 
                               publicCards
      , inactive        = this.state.library === 'user' ?
                               viewPublicCards :
                               viewYourCards
      ;

    return (
      <div className={styles.libCtrls} >
        <div className={styles.libCtrlsActive}>{active}</div>
        <div 
          className={styles.tog}
          onClick={this.toggleLibrary}
        >{inactive}</div>
      </div>
    );
  }
    
  toggleLibrary = () => {
    var newLib;

    if (this.state.library === 'user') {
      newLib = 'public';
    } else {
      newLib = 'user';
    }

    this.setState({
      library: newLib,
      selectedDeck: allCardsDeck
    }, this.reloadResources);
  }

  // TODO: add cardsHdr icons after building a proper icon font. Last round was a hack job.
  render() {
    var resourceResult = this.selectedResources();

    return (
      <div className={styles.lManager}>
        <DeckUsersLightbox
          isOpen={this.state.deckUsersOpen}
          handleRequestClose={() => this.setState({ deckUsersOpen: false })}
          deck={this.state.selectedDeck}
        />
        <NewDeckLightbox
          isOpen={this.state.newDeckOpen}
          handleCreate={this.handleCreateDeck}
          handleRequestClose={this.handleCloseNewDeckLightbox}
        />
        <SpeciesSearchLightbox
          isOpen={this.state.speciesSearchOpen}
          handleClose={this.handleSpeciesSearchClose}
          handleCreate={this.handleCreateCard}
          deckFilterItems={this.deckFilterItemsForNewCard()}
          handleDeckSelect={this.handleSpeciesSearchDeckSelect}
          selectedDeckId={this.state.speciesSearchDeckId}
          handleCreateCard={this.handleCreateCard}
        />
        <div className={styles.lLeftRail}>
          <div className={styles.cardsHdr}>
            <h2>Cards logo goes here</h2>
          </div>
          <div className={styles.ctrls}>
            <div className={styles.new} ref={(node) => { this.setMenuNode('new', node) }}>
              <div 
                className={styles.btn}
                onClick={() => this.toggleMenu('new')}
              >{I18n.t('react.card_maker.new_upper')}</div>
              {this.state.menus.new.open &&
                <ul className={styles.menu} >
                  <li onClick={this.handleSpeciesSearchOpen}>{I18n.t('react.card_maker.card')}</li>
                  <li onClick={this.handleOpenNewDeckLightbox}>{I18n.t('react.card_maker.deck')}</li>
                </ul>
              }
            </div>
            {this.libCtrls()}
            <input 
              type='search' 
              className={styles.search} 
              placeholder='search decks...'
              onChange={this.handleDeckSearchChange}
              value={this.state.deckSearchVal}
            />
          </div>
          <ul className={styles.decks}>
            {this.deckItem(allCardsDeck, null)}
            {this.deckItems()}
          </ul>
        </div>
        <div className={styles.lResources}>
          <div className={[styles.bar, styles.barMenu].join(' ')}>
            <div 
              className={styles.barMenuAnchorContain}
              ref={node => this.setMenuNode('deck', node)}
            >
              <div 
                className={styles.menuAnchor}
                onClick={this.toggleDeckMenu}
                dangerouslySetInnerHTML={{__html: this.deckMenuContents()}}
              />
              {this.state.menus.deck.open &&
                <ul className={[styles.menu, styles.deckMenu].join(' ')}>
                  { false && <li>{I18n.t('react.card_maker.rename')}</li> }
                  <li
                    onClick={this.handleDescBtnClick} 
                  >
                  {this.state.selectedDeck.desc ? 
                      I18n.t('react.card_maker.edit_desc') :
                      I18n.t('react.card_maker.add_desc')
                  }
                  </li>
                  <li
                    onClick={this.makeDeckPdf}
                  >{I18n.t('react.card_maker.print')}</li>
                  {
                    this.props.user.admin && 
                    <li onClick={this.toggleDeckPublic}>
                      {
                        this.state.selectedDeck.public ? 
                        I18n.t('react.card_maker.make_deck_private') :
                        I18n.t('react.card_maker.make_deck_public')
                      }
                    </li> &&
                    <li onClick={() => {this.setState({ deckUsersOpen: true })}}
                    >{I18n.t('react.card_maker.manage_deck_users')}</li>
                  }
                </ul>
              }
            </div>
            <div className={styles.barMenuCount}>
              {this.selectedResourceCount(resourceResult)}
            </div>
          </div>
          <div className={styles.desc}>
            {this.deckDescElements()} 
          </div>
          <UserResources
            resources={resourceResult.resources}
            resourceType={resourceResult.resourceType}
            handleCardDeckSelect={this.assignCardDeck}
            handleEditCard={this.props.handleEditCard}
            handleDeckSelect={this.handleDeckSelect}
            handleDestroyCard={this.handleDestroyCard}
            handleDestroyDeck={this.handleDestroyDeck}
            handleNewCard={this.handleSpeciesSearchOpen}
            handleNewDeck={this.HandleOpenNewDeckLightbox}
            makeDeckPdf={this.makeDeckPdf}
            editable={this.state.library === 'user'}
          />
        </div>
      </div>
    );
  }
}

export default CardManager
