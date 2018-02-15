import React from 'react'
import update from 'immutability-helper'

import UserResources from './user-resources'
import NewResourceBtn from './new-resource-btn'
import UserResourceFilter from './user-resource-filter'
import Card from './card'
import SpeciesSearchLightbox from './species-search-lightbox'
import NewDeckLightbox from './new-deck-lightbox'
import DeckUsersLightbox from './deck-users-lightbox'
import Search from './search'
import {cardMakerUrl} from 'lib/card-maker/url-helper'
import LeftRail from './manager-left-rail'

import ladybugIcon from 'images/card_maker/icons/ladybug.png'
import eolHdrIcon from 'images/card_maker/icons/eol_logo_sub_hdr.png'
import newCardIcon from 'images/card_maker/icons/new_card.png'
import managerLogo from 'images/card_maker/icons/card_manager_logo.png'
import newDeckIcon from 'images/card_maker/icons/new_deck.png'
import iguanaBanner from 'images/card_maker/iguana_banner.png' /* TODO: convert to jpg */

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
      cardSearchVal: '',
      library: 'public',
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

    this.req = $.ajax({
      url: cardMakerUrl(decksUrl),
      method: 'GET',
      success: (decks) => {
        this.req = $.ajax({
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
    if (this.req) {
      this.req.abort();
      this.req = null;
    }

    document.removeEventListener('click', this.handleDocClick);
  }

  componentDidMount() {
    if (this.props.userRole) {
      this.setState({
        library: 'user'
      }, this.reloadResources);
    } else {
      this.reloadResources();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.userRole && nextProps.userRole) {
      this.setLibrary('user');
    }
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
    this.toggleMenu('deck');
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

    this.closeMenu('deck');

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
        alert(I18n.t('react.card_maker.unexpected_error_msg'));
        that.props.hideLoadingOverlay();
      }
    })
  }

  openNewDeckLightbox = () => {
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

      if (this.state.library === 'user') {
        resources = resources.slice(0).sort((a, b) => {
          if (a.updatedAt < b.updatedAt) {
            return 1;
          } else {
            return -1;
          }
        });
      } else {
        resources = resources.slice(0).sort((a, b) => {
          if (a.commonName <= b.commonName) {
            return -1;
          } else {
            return 1;
          }
        });
      }
    }

    return {
      resources: resources,
      resourceType: resourceType,
    };
  }

  showDeck = (id) => {
    var deck = this.state.decks.find((deck) => {
      return deck.id === id;
    });

    if (deck) {
      this.setState({
        selectedDeck: deck 
      });
    }
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
      },
      error: function() {
        cb(new Error('failed to populate deck'));
      }
    });
  }

  pollCollectionJob = (jobId, cb) => {
    const that = this;

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
          }
        ;

    that.props.showLoadingOverlay();

    $.ajax({
      url: cardMakerUrl('decks'),
      method: 'POST',
      data: JSON.stringify({ name: deckName }),
      success: (data) => {
        const cb = (err) => { 
          if (err) {
            console.log(err);
            that.props.hideLoadingOverlay();
            alert(I18n.t('react.card_maker.unexpected_error_msg'));
          } else {
            that.reloadResourcesWithCb(() => {
              that.showDeck(data.id);
              that.props.hideLoadingOverlay();
            })
          }
        }

        if (colId != null && colId.length) {
          that.populateDeckFromCollection(data.id, colId, cb);
        } else {
          cb();
        }
      },
      error: function(err) {
        var alertMsg = '';

        that.props.hideLoadingOverlay();

        if (err.status === 422 &&
            err.responseJSON &&
            err.responseJSON.errors
        ) { // Validation error
          alertMsg = err.responseJSON.errors.join('\n');
        } else {
          alertMsg = I18n.t('react.card_maker.unexpected_error_msg')
        }

        alert(alertMsg);
      }
    });
  }

  handleSpeciesSearchDeckSelect = (id) => {
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

  descInput = () => {
    return [
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
        <ul 
          className={styles.descBtns}
          key='1'
        >
          <li 
            className={styles.descBtn}
            onClick={this.handleSetDescBtnClick}
          >{I18n.t('react.card_maker.save_desc')}</li>
          <li 
            className={styles.descBtn}
            onClick={this.closeAndClearDescInput}
          >{I18n.t('react.card_maker.cancel')}</li>
        </ul>
      ),
    ];
  }

  deckDesc = () => {
    let inner = null
      , result = null
      ; 

    if (this.state.showDescInput) {
      inner = this.descInput();
    } else if (this.state.selectedDeck !== allCardsDeck) {
      if (this.state.selectedDeck.desc) {
        inner = this.state.selectedDeck.desc;
      } else if (this.state.library === 'user') {
        inner = (
          <div
            className={styles.descAdd}
            onClick={this.handleDescBtnClick}
          >
            <i className='fa fa-lg fa-edit' />
            <span>{I18n.t('react.card_maker.add_desc')}</span>
          </div>
        );
      }
    }

    if (inner) {
      result = (
        <div className={styles.lDesc}>
          <div className={styles.desc}>
            {inner} 
          </div>
        </div>
      );
    }

    return result;
  }

  setMenuNode = (name, node) => {
    this.menuNodes[name] = node;
  }

  allDecksName = () => {
    return this.state.library === 'user' ? 
      I18n.t('react.card_maker.all_my_cards') :
      I18n.t('react.card_maker.all_public_cards');
  }

  deckMenuAnchor = () => {
    let isMenu = this.state.selectedDeck !== allCardsDeck
      ,  name = isMenu ? 
          this.state.selectedDeck.name :
          this.allDecksName()
      ;


    return (
      <div 
        className={[
          styles.menuAnchor,
          (isMenu ? styles.isClickable : '')
        ].join(' ')}
        onClick={isMenu ? this.toggleDeckMenu : null}
      >
        <div className={styles.menuDeckName}>{name}
        </div>
        {isMenu && <i className={`${styles.menuCaret} fa fa-caret-down`} />}
      </div>
    );
  }

  toggleDeckPublic = () => {
    var action = this.state.selectedDeck.public ?
          'make_private' :
          'make_public'
      , proceed = confirm(
          this.state.selectedDeck.public ?
          I18n.t('react.card_maker.confirm_make_private') :
          I18n.t('react.card_maker.confirm_make_public')
        )
      ;

    if (proceed) {
      $.ajax({
        url: cardMakerUrl('decks/' + this.state.selectedDeck.id + '/' + action),
        method: 'POST',
        success: () => {
          this.reloadResources();
        }
      });
    }
  }

  libCtrls = () => {
    let yourCards   = I18n.t('react.card_maker.my_cards')
      , publicCards = I18n.t('react.card_maker.public_cards')
      , faIcon
      , active
      , inactive
      ;

    if (this.state.library === 'user') {
      active = yourCards;
      inactive = publicCards;
      faIcon = 'users';
    } else {
      active = publicCards;
      inactive = yourCards;
      faIcon = 'user';
    }

    return (
      <div className={styles.libCtrls} >
        <div className={`${styles.lib} ${styles.activeLib}`}>{active}</div>
        <div 
          className={`${styles.lib} ${styles.altLib}`}
          onClick={this.toggleLibrary}
        >
          <i className={`fa fa-${faIcon}`} />
          <span>{inactive}</span>
        </div>
      </div>
    );
  }
    
  toggleLibrary = () => {
    if (!this.props.userRole) {
      window.location = './login';
      return;
    }

    let newLib;

    if (this.state.library === 'user') {
      newLib = 'public';
    } else {
      newLib = 'user';
    }

    this.setLibrary(newLib);
  }

  setLibrary = (newLib) => {
    if (this.state.library !== newLib) {
      this.setState({
        library: newLib,
        selectedDeck: allCardsDeck
      }, this.reloadResources);
    }
  }

  isUserLib = () => {
    return this.state.library === 'user';
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
        <img src={iguanaBanner} className={styles.banner} />
        <LeftRail
          library={this.state.library}
          handleToggleLibrary={this.toggleLibrary}
          handleDeckSelect={this.handleDeckSelect}
          handleNewDeck={this.openNewDeckLightbox}
          selectedDeck={this.state.selectedDeck}
          decks={this.state.decks}
          allCardsDeck={allCardsDeck}
        />
        <div className={styles.lResources}>
          <div className={styles.lDeckMenu}>
            <div 
              className={styles.menuWrap}
              ref={node => this.setMenuNode('deck', node)}
            >
              {this.deckMenuAnchor()}
              {this.state.menus.deck.open &&
                <ul className={[styles.menu, styles.deckMenu].join(' ')}>
                  { false && <li>{I18n.t('react.card_maker.rename')}</li> }
                  <li
                    onClick={this.makeDeckPdf}
                    key='print'
                  >{I18n.t('react.card_maker.print')}</li>
                  {
                    this.isUserLib() && [
                      <li
                        onClick={this.handleDescBtnClick} 
                        key='desc'
                      >
                        {
                          this.state.selectedDeck.desc ? 
                          I18n.t('react.card_maker.edit_desc') :
                          I18n.t('react.card_maker.add_desc')
                        }
                      </li>,
                      <li 
                        onClick={() => this.handleDestroyDeck(this.state.selectedDeck.id)}
                        key='destroy'
                      >delete deck</li>
                    ]
                  }
                  {
                    this.props.userRole === 'admin' && this.isUserLib() && [
                      <li 
                        onClick={this.toggleDeckPublic}
                        key='public'
                      >
                        {
                          this.state.selectedDeck.public ? 
                          I18n.t('react.card_maker.make_deck_private') :
                          I18n.t('react.card_maker.make_deck_public')
                        }
                      </li>,
                      <li 
                        onClick={() => {this.setState({ deckUsersOpen: true })}}
                        key='users'
                      >{I18n.t('react.card_maker.manage_deck_users')}</li>
                    ]
                  }
                </ul>
              }
            </div>
            {this.deckDesc()}
          </div>
          {/*
          <div className={[styles.bar, styles.barMenu].join(' ')}>
            </div>
            <div className={styles.barMenuCount}>
              {this.selectedResourceCount(resourceResult)}
            </div>
          </div>
          */}
          {/*
          */}
          <div className={styles.resourceFilterBar}>
            {/*
            <Search 
              handleChange={(val) => this.setState({ cardSearchVal: val})}
              extraClass={styles.searchCard}
              placeholder='search cards' 
              value={this.state.cardSearchVal}
            />
            */}
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
            handleNewDeck={this.openNewDeckLightbox}
            makeDeckPdf={this.makeDeckPdf}
            editable={this.state.library === 'user'}
          />
        </div>
      </div>
    );
  }
}

export default CardManager
