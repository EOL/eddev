import React from 'react'
import ReactModal from 'react-modal'

import Page from 'components/shared/page'
import SimpleManager from './simple-manager'
import CardManager from './card-manager'
import CardEditor from './card-editor'
import {cardMakerUrl} from 'lib/card-maker/url-helper'
import newImmutableCardInstance from 'lib/card-maker/immutable-card'

import styles from 'stylesheets/card_maker/card_maker';

import backgroundImage from 'images/card_maker/editor_bg_tree.jpg'
import eolLogoHdr from 'images/card_maker/icons/eol_logo_hdr.png'

function ascSort(field) {
  return function(a, b) {
    if (a.templateName !== 'trait' && b.templateName === 'trait') {
      return -1; 
    }

    if (a.templateName === 'trait' && b.templateName !== 'trait') {
      return 1;
    }

    if (a[field] <= b[field]) {
      return -1;
    } 

    return 1;
  }
}

function descSort(field) {
  return function(a, b) {
    if (a[field] > b[field]) {
      return -1;
    }

    return 1;
  }
}

const allDecksDeck = { // unused for now
        id: -1,
        name: I18n.t('react.card_maker.all_decks'),
      }
    , allCardsDeck = {
        id: -2,
        name: I18n.t('react.card_maker.all_cards'),
      }
    , unassignedCardsDeck = {
        id: -3,
        name: I18n.t('react.card_maker.unassigned'),
      }
    , sorts = {
        commonAsc: {
          fn: ascSort('commonName'),
          label: I18n.t('react.card_maker.sorts.common_a_z')
        },
        commonDesc: { 
          fn: descSort('commonName'),
          label: I18n.t('react.card_maker.sorts.common_z_a')
        },
        sciAsc: {
          fn: ascSort('sciName'),
          label: I18n.t('react.card_maker.sorts.sci_a_z')
        },
        sciDesc: {
          fn: descSort('sciName'),
          label: I18n.t('react.card_maker.sorts.sci_z_a')
        },
        recent: {
          fn: descSort('updatedAt'),
          label: I18n.t('react.card_maker.sorts.recent'),
          pure: true
        },
        taxonGroupAsc: {
          fn: ascSort('taxonGroup'),
          label: I18n.t('react.card_maker.sorts.taxon_group_a_z')
        },
        taxonGroupDesc: {
          fn: descSort('taxonGroup'),
          label: I18n.t('react.card_maker.sorts.taxon_group_z_a')
        }
      }
    , userSorts = buildSorts([
        'recent',
        'commonAsc',
        'commonDesc',
        'sciAsc',
        'sciDesc',
        'taxonGroupAsc',
        'taxonGroupDesc',
      ])
    , publicSorts = buildSorts([
        'commonAsc',
        'commonDesc',
        'sciAsc',
        'sciDesc',
        'taxonGroupAsc',
        'taxonGroupDesc',
      ])
    ;

function buildSorts(keys) {
  return keys.map((key) => {
    return {
      key: key,
      label: sorts[key].label
    };
  });
}

class CardMaker extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      userCards: [],
      userDecks: [],
      publicCards: [],
      publicDecks: [],
      selectedDeck: null,
      library: 'public',
      screen: 'manager',
      sort: sorts[publicSorts[0].key],
      showLoadingOverlay: false,
      loadingOverlayOnCancel: false,
      userRole: null
    }
  }

  componentDidMount() {
    const that = this
      , hashParams = EolUtil.parseHashParams()
      ;

    window.addEventListener('popstate', (event) => {
      that.handleHistoryStateChange(event.state);
    });

    that.showLoadingOverlay(null, null, (closeFn) => {
      $.getJSON('/user_sessions/user_info', (userInfo) => {
        that.setState({
          userRole: userInfo.role
        }, () => {
          if (hashParams.deck_id) {
            if (that.state.userRole) {
              // user decks are needed in both libraries, for example, for copying 
              // public cards to a deck
              that.reloadResource('user', 'decks', () => {
                that.reloadCurLibResourcesSetDeck(hashParams.deck_id, closeFn);
              });
            } else {
              that.reloadCurLibResourcesSetDeck(hashParams.deck_id, closeFn);
            }
          } else {
            // If that is a page refresh, and the editor was previously open,
            // open it now.
            that.handleHistoryStateChange(history.state); 

            if (that.state.userRole) {
              that.setLibrary('user', closeFn);
            } else {
              that.reloadCurLibResources(closeFn);
            }
          }
        });
      });
    });

    // TODO: is this the right place??
    // Module initialization
    CardWrapper.setDataPersistence({
      save: function(card, cb) {
        const url = cardMakerUrl('/cards/' + card.id + '/save');

        $.ajax({
          url: url,
          method: 'PUT',
          data: JSON.stringify({ data: card.data, userData: card.userData }),
          contentType: 'application/json',
          success: function() {
            cb()
          },
          error: function() {
            //TODO: log error?
            cb(new Error('Failed to save card'));
          }
        });
      }
    });

    CardWrapper.setTemplateSupplier({
      supply: function(name, version, locale, cb) {
        $.ajax({
          url: cardMakerUrl('templates/' + name + '/' + version),
          success: function(data) {
            cb(null, data);
          },
          error: function() {
            cb(new Error('Failed to retrieve template'));
          }
        });
      }
    });
  }

  reloadCurLibResources = (cb) => {
    this.reloadCurLibResourcesSetDeck(null, cb);
  }

  reloadCurLibResourcesSetDeck = (deckOverrideId, cb) => {
    const that = this;

    that.reloadResource(that.state.library, 'cards', () => {
      that.reloadResource(that.state.library, 'decks', (decks) => {
        let selectedDeck = decks.find((deck) => {
          return deck.id === (deckOverrideId || (that.state.selectedDeck && that.state.selectedDeck.id));
        });

        that.setState({
          selectedDeck: selectedDeck
        }, () => {
          if (cb) {
            cb();
          }
        });
      });
    });
  }

  reloadResource = (lib, type, cb) => {
    const that = this;
    let keyExt
      , path
      ;
    
    if (type === 'cards') {
      keyExt = 'Cards';
    } else if (type === 'decks') {
      keyExt = 'Decks';
    } else {
      throw new TypeError('invalid type: ' + type);
    }

    if (lib === 'user') {
      path = type;
    } else if (lib === 'public') {
      path = 'public/' + type;
    } else {
      throw new TypeError('Invalid lib: ' + lib);
    }

    $.ajax({
      url: cardMakerUrl(path),
      method: 'GET',
      success: (resources) =>  {
        that.setState({
          [lib + keyExt]: resources
        }, () => cb(resources));
      }
    });
  }

  handleHistoryStateChange = (state) => {
    if (state && state.editorCardId) {
      this.loadCard(state.editorCardId, (err, card) => {
        if (err) throw err; // TODO: graceful handling
        this.setState({
          screen: 'editor',
          editorCard: card,
        });
      });
    } else if (this.state.screen === 'editor') {
      this.closeIfSafe(state);
    }
  }

  closeIfSafe = (state) => {
    let proceed = true;

    if (this.state.editorCard && this.state.editorCard.isDirty()) {
      proceed = confirm(I18n.t('react.card_maker.are_you_sure_unsaved'));
    }

    if (proceed) {
      this.setState({
        screen: 'manager'
      }, this.reloadCurLibResources);
    } else {
      window.history.pushState(state, '');
    }
  }

  loadCard(cardId, cb) {
    const cardUrl = cardMakerUrl('cards/' + cardId + '.json')
        , that = this
        ;

    $.ajax(cardUrl, {
      method: 'GET',
      success: (card) => {
        newImmutableCardInstance(card, cb)
      },
      error: cb
    });
  }

  handleEditCard = (card) => {
    const state = {
      editorCardId: card.id,
    }

    window.history.pushState(state, '');
    this.handleHistoryStateChange(state);
  }

  updateEditorCard = (mapFn, cb) => {
    this.setState((prevState) => {
      return {
        editorCard: mapFn(prevState.editorCard),
      }
    }, cb);
  }

  handleEditorCloseRequest = () => {
    window.history.back();
  }

  setSelectedDeck = (deck, cb) => {
    this.setState({
      selectedDeck: deck
    }, cb);
  }

  ensureUser = () => {
    if (!this.state.userRole) {
      window.location = './login';
      return false;
    }

    return true;
  }

  // always reloads resources
  setLibrary = (newLib, cb) => {
    const that = this
      , reloadFn = () => {
          that.reloadCurLibResources(cb); 
        }
      ;

    if (!newLib === 'user' && !this.ensureUser()) {
      return; 
    }

    if (that.state.library !== newLib) {
      that.setState((prevState) => {
        return {
          library: newLib,
          selectedDeck: null,
          sort: sorts[that.sortsForLib(newLib)[0].key]
        };
      }, reloadFn);
    } else {
      reloadFn();
    }
  }

  setSort = (key) => {
    this.setState({
      sort: sorts[key]
    });
  }

  sortsForLib = (lib) => {
    return lib === 'user' ? userSorts : publicSorts;
  }

  handleReloadCard = (cb) => {
    this.loadCard(this.state.editorCard.id(), (err, card) => {
      if (err) {
        return cb(err);
      }

      this.setState({
        editorCard: card
      }, cb);
    })
  }

  screenComponent = () => {
    const commonProps = {
      showLoadingOverlay: this.showLoadingOverlay,
      hideLoadingOverlay: this.hideLoadingOverlay,
      userRole: this.state.userRole
    }

    let component;

    if (this.state.screen === 'manager') {
      component = (
        <SimpleManager
          allCardsDeck={allCardsDeck}
          backPath={this.props.backPath}
          cards={this.state.library === 'user' ? this.state.userCards : this.state.publicCards}
          decks={this.state.library === 'user' ? this.state.userDecks : this.state.publicDecks}
          userDecks={this.state.userDecks}
          unassignedCardsDeck={unassignedCardsDeck}
          userRole={this.state.userRole}
          onRequestEditCard={this.handleEditCard}
          library={this.state.library}
          reloadCurLibResources={this.reloadCurLibResources}
          setLibrary={this.setLibrary}
          selectedDeck={this.state.selectedDeck}
          setSelectedDeck={this.setSelectedDeck}
          setSort={this.setSort}
          sort={this.state.sort}
          sorts={this.sortsForLib(this.state.library)}
          onRequestPublicCardsForTaxon={this.handleRequestPublicCardsForTaxon}
          {...commonProps}
          ensureUser={this.ensureUser}
        />
      )
    } else if (this.state.screen === 'editor') {
      component = (
        <CardEditor
          card={this.state.editorCard}
          updateCard={this.updateEditorCard}
          handleRequestClose={this.handleEditorCloseRequest}
          requestReloadCard={this.handleReloadCard}
          {...commonProps}
        />
      )
    }

    return component;
  }

  showLoadingOverlay = (text, onCancel, cb) => {
    const that = this;

    this.setState({
      showLoadingOverlay: true,
      loadingOverlayText: text,
      loadingOverlayOnCancel: onCancel
    }, () => {
      cb(this.hideLoadingOverlay);
    });
  }

  cancelLoadingOverlay = () => {
    const loadingOverlayOnCancel = this.state.loadingOverlayOnCancel;
    this.hideLoadingOverlay(loadingOverlayOnCancel);
  }

  hideLoadingOverlay = (cb) => {
    this.setState({
      showLoadingOverlay: false,
      loadingOverlayText: null,
      loadingOverlayOnCancel: null
    }, cb);
  }

  handleRequestPublicCardsForTaxon = (id) => {
    return this.state.publicCards.filter((card) => {
      return card.templateName === 'trait' && card.speciesId === id;
    });
  }

  render() {
    return (
      <div className={styles.cardMaker}>
        <ReactModal
          isOpen={this.state.showLoadingOverlay}
          parentSelector={() => {return document.getElementById('Page')}}
          contentLabel='Loading spinner'
          className='global-loading lightbox'
          overlayClassName='fixed-center-wrap disable-overlay'
          bodyOpenClassName='noscroll'
        >
          <i className='fa fa-spin fa-spinner fa-4x' />
          {
            this.state.loadingOverlayText &&
            <div>{this.state.loadingOverlayText}</div>
          }
          {
            this.state.loadingOverlayOnCancel != null &&
            <button 
              onClick={this.cancelLoadingOverlay}
            >{I18n.t('react.card_maker.cancel')}</button>
          }
        </ReactModal>
        {this.screenComponent()}
        {/*
        <Page noMainCol={true}>{this.screenComponent()}</Page>
        */}
      </div>
    )
  }
}

export default CardMaker

