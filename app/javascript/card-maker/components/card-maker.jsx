import React from 'react'
import ReactModal from 'react-modal'

import CardManager from './card-manager'
import CardEditor from './card-editor'
import {cardMakerUrl} from 'lib/card-maker/url-helper'
import newImmutableCardInstance from 'lib/card-maker/immutable-card'

import styles from 'stylesheets/card_maker/card_maker'

import eolLogoHdr from 'images/card_maker/icons/eol_logo_hdr.png'

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
          fn: (a, b) => {
            if (a.commonName <= b.commonName) {
              return -1;
            } else {
              return 1;
            }
          },
          label: I18n.t('react.card_maker.sorts.common_a_z')
        },
        commonDesc: { 
          fn: (a, b) => {
            if (a.commonName > b.commonName) {
              return -1;
            } else {
              return 1;
            }
          },
          label: I18n.t('react.card_maker.sorts.common_z_a')
        },
        sciAsc: {
          fn: (a, b) => {
            if (a.sciName <= b.sciName) {
              return -1;
            } else {
              return 1;
            }
          },
          label: I18n.t('react.card_maker.sorts.sci_a_z')
        },
        sciDesc: {
          fn: (a, b) => {
            if (a.sciName > b.sciName) {
              return -1;
            } else {
              return 1
            }
          },
          label: I18n.t('react.card_maker.sorts.sci_z_a')
        },
        recent: {
          fn: (a, b) => {
            if (a.updatedAt < b.updatedAt) {
              return 1;
            } else {
              return -1;
            }
          },
          label: I18n.t('react.card_maker.sorts.recent')
        }
      }
    , userSorts = buildSorts([
        'recent',
        'commonAsc',
        'commonDesc',
        'sciAsc',
        'sciDesc'
      ])
    , publicSorts = buildSorts([
        'commonAsc',
        'commonDesc',
        'sciAsc',
        'sciDesc'
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
      selectedDeck: allCardsDeck,
      library: 'public',
      screen: 'manager',
      sort: sorts[publicSorts[0].key],
      showLoadingOverlay: false,
      userRole: null
    }
  }

  componentDidMount() {
    var hashParams = EolUtil.parseHashParams();

    window.addEventListener('popstate', (event) => {
      this.handleHistoryStateChange(event.state);
    });

    $.getJSON('/user_sessions/user_info', (userInfo) => {
      this.setState({
        userRole: userInfo.role
      }, () => {
        if (hashParams.deck_id) {
          this.reloadAllResources(hashParams.deck_id);
        } else {
          // If this is a page refresh, and the editor was previously open,
          // open it now.
          this.handleHistoryStateChange(history.state); 

          if (this.state.userRole) {
            this.setLibrary('user')
          } 

          this.reloadAllResources(null);
        }
      });
    });
  }

  reloadResourcesWithCb = (cb) => {
    this.reloadResourcesHelper(this.props.library, null, cb);
  }

  reloadResources = () => {
    this.showLoadingOverlay();
    this.reloadResourcesWithCb(this.hideLoadingOverlay);
  }

  reloadResourcesHelper = (lib, deckIdOverride, cb) => {
    let that = this
      , decksUrl
      , cardsUrl
      , cardsKey
      , decksKey
      ;

    if (lib === 'user') {
      decksUrl = 'decks';
      cardsUrl = 'card_summaries';
      cardsKey = 'userCards';
      decksKey = 'userDecks';
    } else {
      decksUrl = 'public/decks';
      cardsUrl = 'public/cards';
      cardsKey = 'publicCards';
      decksKey = 'publicDecks';
    }

    this.req = $.ajax({
      url: cardMakerUrl(decksUrl),
      method: 'GET',
      success: (decks) => {
        this.req = $.ajax({
          url: cardMakerUrl(cardsUrl),
          method: 'GET',
          success: (cards) => {
            let selectedDeck = decks.find((deck) => {
              return deck.id === (deckIdOverride || this.state.selectedDeck.id);
            });

            if (!selectedDeck) {
              selectedDeck = allCardsDeck;
            }

            that.setState({
              [cardsKey]: cards,
              [decksKey]: decks,
              showDescInput: false
            }, () => {
              if (lib === this.state.library) {
                that.setSelectedDeck(selectedDeck);  
              }

              if (cb) {
                cb();
              }
            });
          }
        });
      }
    });
  }

  reloadAllResources = (deckIdOverride) => {
    var that = this;

    that.showLoadingOverlay();
    that.reloadResourcesHelper('public', deckIdOverride, () => {
      if (that.state.userRole) {
        that.reloadResourcesHelper('user', deckIdOverride, that.hideLoadingOverlay);
      } else {
        that.hideLoadingOverlay();
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
      });
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

  handleEditCard = (cardId) => {
    const state = {
      editorCardId: cardId,
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

  setSelectedDeck = (deck) => {
    this.setState({
      selectedDeck: deck
    });
  }

  setLibrary = (newLib, cb) => {
    if (this.state.library !== newLib) {
      this.setState((prevState) => {
        return {
          library: newLib,
          selectedDeck: allCardsDeck,
          sort: sorts[this.sortsForLib(newLib)[0].key]
        };
      }, cb);
    } else {
      cb();
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

  screenComponent = () => {
    const commonProps = {
      showLoadingOverlay: this.showLoadingOverlay,
      hideLoadingOverlay: this.hideLoadingOverlay,
    }

    let component;

    if (this.state.screen === 'manager') {
      component = (
        <CardManager
          allCardsDeck={allCardsDeck}
          cards={this.state.library === 'user' ? this.state.userCards : this.state.publicCards}
          decks={this.state.library === 'user' ? this.state.userDecks : this.state.publicDecks}
          userDecks={this.state.userDecks}
          unassignedCardsDeck={unassignedCardsDeck}
          handleEditCard={this.handleEditCard}
          userRole={this.state.userRole}
          library={this.state.library}
          reloadResources={this.reloadResources}
          reloadAllResources={this.reloadAllResources}
          reloadResourcesWithCb={this.reloadResourcesWithCb}
          setLibrary={this.setLibrary}
          selectedDeck={this.state.selectedDeck}
          setSelectedDeck={this.setSelectedDeck}
          setSort={this.setSort}
          sort={this.state.sort}
          sorts={this.sortsForLib(this.state.library)}
          {...commonProps}
        />
      )
    } else if (this.state.screen === 'editor') {
      component = (
        <CardEditor
          card={this.state.editorCard}
          updateCard={this.updateEditorCard}
          handleRequestClose={this.handleEditorCloseRequest}
          {...commonProps}
        />
      )
    }

    return component;
  }

  showLoadingOverlay = (text) => {
    this.setState({
      showLoadingOverlay: true,
      loadingOverlayText: text
    });
  }

  hideLoadingOverlay = () => {
    this.setState({
      showLoadingOverlay: false,
      loadingOverlayText: null
    });
  }

  render() {
    return (
      <div className='card-maker'>
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
        </ReactModal>

        <div className={styles.lPage}>
          <div className={styles.lMainCol}>
            {this.screenComponent()}
          </div>
        </div>
      </div>
    )
  }
}

export default CardMaker
