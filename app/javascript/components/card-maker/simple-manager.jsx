import React from 'react';

import ManagerModals from './manager-modals'
import LoadingSpinnerImage from './loading-spinner-image'
import {cardMakerUrl, loResCardImageUrl, createCardUrl} from 'lib/card-maker/url-helper'
import HeaderBar from './header-bar'
import CardToolbar from './card-toolbar'
import DeckToolbar from './deck-toolbar'
import DeckSidebar from './deck-sidebar'
import SimpleCard from './simple-card'
import Poller from 'lib/card-maker/poller'
import styles from 'stylesheets/card_maker/simple_manager'

import deckSvg from 'images/card_maker/deck.svg'

const pollIntervalMillis = 1000
    , specialCardOrder = {
        'title': 0,
        'desc': 1,
        'vocab': 2,
        'key': 3,
      }
    , newDeckId = -100
    ;

function DescPart(props) {
  let elmts = [];

  if (props.selectedDeck && props.cardSearchVal) {
    elmts.push("Showing cards matching '" + props.cardSearchVal + "'");
  } else if (!props.selectedDeck && props.deckSearchVal) {
    elmts.push("Showing decks matching '" + props.deckSearchVal + "'");
  } else if (!props.isAllCards) {
    if (props.selectedDeck) {
      if (props.library === 'user' && !props.selectedDeck.desc) {
        return (
          <div 
            className={[styles.btn, styles.btnDesc].join(' ')}
            onClick={props.onRequestEditDesc}
          >add a description</div>
        );
      } else if (props.selectedDeck.desc){
        elmts.push(props.selectedDeck.desc);

        if (props.library === 'user') {
          elmts.push(<i onClick={props.onRequestEditDesc} className={'fa fa-edit'} />)
        }
      }
    } else if (props.library === 'public') {
      elmts.push('Welcome to the public biodiversity card library! You can browse and print our pre-made decks here, or create your own by switching to your library.')
    }
  }
  
  if (elmts.length) {
    return (
      <div className={styles.descOuter}>
        <p className={styles.desc}>
          {elmts}
        </p>
      </div>
    );
  } else {
    return null;
  }
}

class SimpleManager extends React.Component {
  constructor(props) {
    super(props);

    this.poller = new Poller();
    this.state = {
      openModal: null,
      zoomCardIndex: null,
      deckDrawerOpen: false,
      cardSearchVal: '',
      deckSearchVal: '',
      copyCardId: null,
      sidebarOpen: false
    }
  }

  deckItem = (deck) => {
    var inner;

    if (deck.titleCardId) {
      let card = this.props.cards.find((card) => {
        return card.id === deck.titleCardId;
      });

      inner = [
        <div className={styles.deckImage} key='deckImg'>
          <LoadingSpinnerImage src={loResCardImageUrl(card)} load={true} />
        </div>,
        <div className={styles.deckText} key='deckTxt'>{deck.name}</div>
      ]
    } else {
      inner = <div className={styles.deckText}>{deck.name}</div>
    }

    return (
      <li 
        className={styles.deck}
        key={deck.id}
        onClick={() => this.setSelectedDeck(deck)}
      >
        <div className={[styles.cardImg, styles.cardImgBehind, styles.cardImgBehind2].join(' ')} />
        <div className={[styles.cardImg, styles.cardImgBehind, styles.cardImgBehind1].join(' ')} />
        <div className={[styles.cardImg, styles.cardImgBehind, styles.cardImgBehind0].join(' ')} />
        <div className={styles.cardImg}>
          {inner}
        </div>
      </li>
    );
  }

  handleCardZoomClick = (i) => {
    this.setState({
      openModal: 'cardZoom',
      zoomCardIndex: i
    });
  }

  handleDestroyResource = (confirmMsg, resourceType, id) => {
    const that = this
        , shouldDestroy = confirm(confirmMsg)
        ;

    if (!shouldDestroy) return;

    that.props.showLoadingOverlay(null, null, (closeFn) => {
      $.ajax({
        url: cardMakerUrl(resourceType + '/' + id),
        method: 'DELETE',
        success: () => {
          that.props.reloadCurLibResources(closeFn);
        }
      });
    });
  }

  handleDestroyCard = (card) => {
    this.handleDestroyResource(
      I18n.t('react.card_maker.are_you_sure_delete_card'),
      'cards',
      card.id
    );
  }

  handleDestroyDeck = (deck) => {
    this.handleDestroyResource(
      I18n.t('react.card_maker.are_you_sure_delete_deck'),
      'decks',
      deck.id
    );
  }

  openCopyModal = (cardId) => {
    if (this.props.ensureUser()) {
      this.setState({ 
        openModal: 'copyCard',
        copyCardId: cardId
      });
    }
  }

  cardItem = (card, i) => {
    return (
      <SimpleCard
        card={card}
        library={this.props.library}
        onRequestEditCard={() => this.props.onRequestEditCard(card)}
        onRequestZoom={() => this.handleCardZoomClick(i)}
        onRequestCopy={() => this.openCopyModal(card.id)}
        onRequestDestroy={() => this.handleDestroyCard(card)}
      />
    );
  }

  allCardsElmt = () => {
    return (
      <li
        className={[styles.card].join(' ')}
        onClick={() => this.setSelectedDeck(this.props.allCardsDeck)}
        key='showall'
      >
        <div className={styles.cardImg}>
          <img src={deckSvg} className={styles.showAllIcon} />
          <div>show all cards</div>
        </div>
      </li>
    );
  }

  newElmt = (text, onClick) => {
    return (
      <li
        className={[styles.card, styles.cardNew].join(' ')}
        onClick={onClick}
        key='new'
      >
        <div className={styles.cardImg}>
          <i className='fa fa-plus fa-3x' />
          <div>{text}</div>
        </div>
      </li>
    );
  }

  newCardElmt = () => {
    return this.newElmt(
      'new card', 
      () => this.setState({ openModal: 'newCard' })
    );
  }

  newDeckElmt = () => {
    return this.newElmt(
      'new deck', 
      () => this.setState({ openModal: 'newDeck' })
    );
  }

  deckCards = () => {
    if (this.props.selectedDeck) {
      let cards;

      if (this.isAllCards()) {
        cards = this.props.cards;
      } else {
        cards = this.props.cards.filter((card) => {
          return card.deck === this.props.selectedDeck.id;
        });
      }

      return cards.sort(this.deckCardSort);
    }

    return [];
  }

  deckCardSort = (a, b) => {
    if (!this.props.sort.pure) {
      if (a.locale === I18n.locale && b.locale !== I18n.locale) {
        return -1;
      }

      if (a.locale !== I18n.locale && b.locale === I18n.locale) {
        return 1;
      }

      if (a.templateName === 'trait' && b.templateName !== 'trait') {
        return (this.regDeckSelected() ? 1 : -1);
      }

      if (a.templateName !== 'trait' && b.templateName === 'trait') {
        return (this.regDeckSelected() ? -1 : 1);
      }

      if (a.templateName !== 'trait' && b.templateName !== 'trait') {
        return (specialCardOrder[a.templateName] || -1) - (specialCardOrder[b.templateName] || -1);
      }
    }

    return this.props.sort.fn(a, b)
  }

  regDeckSelected = () => {
    return this.props.selectedDeck !== this.props.allCardsDeck;
  }

  resources = (deckCards) => {
    let resources
      , type
      ;

    if (this.props.selectedDeck) {
      resources = deckCards;
      type = 'cards';

      if (this.state.cardSearchVal) {
        let lowerSearchVal = this.state.cardSearchVal.toLowerCase();
        resources = deckCards.filter((card) => {
          return card.commonName.toLowerCase().includes(lowerSearchVal) ||
            card.sciName.toLowerCase().includes(lowerSearchVal)
        });
      }
    } else {
      type = 'decks';
      resources = this.props.decks.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        } else {
          return 1;
        }
      });

      if (this.state.deckSearchVal) {
        let lowerSearchVal = this.state.deckSearchVal.toLowerCase();
        resources = resources.filter((deck) => {
          return deck.name.toLowerCase().includes(lowerSearchVal);
        });
      }
    }

    return {
      type: type,
      items: resources
    };
  }

  resourceElmts = (resources) => {
    let elmts;

    if (resources.type === 'cards') {
      elmts = resources.items.map((card, i) => {
        return this.cardItem(card, i);
      });

      if (this.props.library === 'user' && !this.state.cardSearchVal && !this.isAllCards()) {
        elmts = [this.newCardElmt()].concat(elmts);
      }
    } else {
      elmts = resources.items.map((deck) => {
        return this.deckItem(deck);
      });

      if (!this.state.deckSearchVal) {
        if (this.props.library === 'user') {
          elmts = [this.newDeckElmt(), this.allCardsElmt()].concat(elmts);
        } else {
          elmts = [this.allCardsElmt()].concat(elmts);
        }
      }
    }

    return elmts;
  }

  isAllCards = () => {
    return this.props.selectedDeck === this.props.allCardsDeck;
  }

  closeModal = () => {
    this.setState({
      openModal: null
    });
  }

  handleSaveDeckDesc = (desc) => {
    const that = this
      , url = cardMakerUrl(
            'decks/' +
            this.props.selectedDeck.id +
            '/desc'
          )
        ;

    that.closeModal();
    that.props.showLoadingOverlay(null, null, (close) => {
      $.ajax({
        method: 'POST',
        data: desc,
        url: url,
        success: () => {
          that.props.reloadCurLibResources(close);
        },
        error: close
      });
    });
  }

  handleCreateDeck = (deckName, colId) => {
    this.createDeckHelper(deckName, colId, null, false);
  }

  handleUpgradeDeck = (deckName) => {
    this.createDeckHelper(deckName, null, this.props.selectedDeck.id, true);
  }

  createDeckHelper = (deckName, colId, copyFrom, upgrade, afterCreate) => {
    const that = this
        , showUpgradedNotice = upgrade
        , data = {
            name: deckName,
            copyFrom: copyFrom,
            upgradeTemplates: upgrade
          }
        ;

    that.props.showLoadingOverlay(null, null, (closeFn) => {
      $.ajax({
        url: cardMakerUrl('decks'),
        method: 'POST',
        data: JSON.stringify(data),
        success: (deck) => {
          const cb = (err) => { 
            if (err) {
              closeFn();
              alert(I18n.t('react.card_maker.unexpected_error_msg'));
            } else if (afterCreate) {
              afterCreate(deck.id, closeFn);
            } else {
              that.props.setLibrary('user', () => {
                that.showDeck(deck.id, closeFn);

                if (showUpgradedNotice) {
                  that.openModal(modals.deckUpgradedNotice);
                }
              });
            }
          }

          if (colId != null && colId.length) {
            that.populateDeckFromCollection(deck.id, colId, cb);
          } else {
            cb();
          }
        },
        error: function(err) {
          var alertMsg = '';

          closeFn();

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
    });
  }

  showDeck = (id, cb) => {
    var deck = this.props.decks.find((deck) => {
      return deck.id === id;
    });

    if (deck) {
      this.setSelectedDeck(deck, cb);
    } else if (cb) {
      cb();
    }
  }

  createCardUrl = (deckId) => {
    return (deckId !== this.props.allCardsDeck.id && deckId != null) ?
      cardMakerUrl('decks/' + deckId + '/cards') :
      cardMakerUrl('cards');
  }

  createOrCopyCard = (data, deckId) => {
    let that = this;

    that.props.showLoadingOverlay(null, null, (closeFn) => {
      $.ajax({
        url: this.createCardUrl(deckId),
        data: JSON.stringify(data),
        contentType: 'application/json',
        method: 'POST',
        success: (card) => {
          that.props.reloadCurLibResources(() => {
            closeFn();
            if (!data.copyFrom) {
              that.props.onRequestEditCard(card);
            }
          })
        },
        error: () => {
          alert(I18n.t('react.card_maker.unexpected_error_msg'));
          closeFn();
        }
      });
    });
  }

  handleCopyCard = (deckId, deckName) => {
    const that = this;

    that.closeModal();

    if (deckId === newDeckId) {
      if (!deckName) {
        throw new TypeError('deck name required');
      }
      that.createDeckHelper(deckName, null, null, false, (deckId, close) => {
        that.createOrCopyCard({ 
          copyFrom: that.state.copyCardId 
        }, deckId);
      });
    } else {
      that.createOrCopyCard({ 
        copyFrom: that.state.copyCardId 
      }, deckId);
    }
  }

  handleCreateCard = (template, params) => {
    const data = {
            templateName: template,
            templateParams: params,
          }
        ;

    this.closeModal();
    this.createOrCopyCard(data, this.props.selectedDeck ? this.props.selectedDeck.id : null);
  }

  handleRenameDeck = (name) => {
    const that = this;

    that.props.showLoadingOverlay(null, null, (closeFn) => {
      $.ajax({
        url: cardMakerUrl(`decks/${this.props.selectedDeck.id}/name`),
        method: 'POST',
        data: name,
        success: () => {
          that.props.reloadCurLibResources(closeFn);
        }
      });
    })
  }

  cancelPolling = () => {
    this.poller.cancel();
    this.props.hideLoadingOverlay();
  }

  handleMakePdf = (cardBackId) => {
    const that = this;

    that.closeModal();

    that.props.showLoadingOverlay(
      I18n.t('react.card_maker.print_loading_msg'), 
      this.cancelPolling,
      (closeFn) => {
        $.ajax({
          url: cardMakerUrl('deck_pdfs'),
          data: JSON.stringify({
            deckId: that.props.selectedDeck.id,
            backId: cardBackId
          }),
          method: 'POST',
          success: (result) => {
            that.pollPdfJob(result.jobId, closeFn);
          }
        });
      }
    );
  }

  pollJob = (baseUrl, jobId, overlayCloseFn) => {
    const that = this;

    that.poller.start(
      cardMakerUrl(baseUrl + '/' + jobId + '/status'),
      (result) => {
        overlayCloseFn();
        window.open(cardMakerUrl(baseUrl + '/downloads/' + result.resultFileName));
      },
      () => {
        overlayCloseFn();
        alert(I18n.t('react.card_maker.unexpected_error_msg'));
      }
    );
  }

  pollPdfJob = (id, overlayCloseFn) => {
    this.pollJob('deck_pdfs', id, overlayCloseFn);
  }

  createDeckPngs = () => {
    const that = this;

    that.props.showLoadingOverlay(
      I18n.t('react.card_maker.it_may_take_a_few_mins'),
      this.cancelPolling,
      (closeFn) => {
        $.ajax({
          url: cardMakerUrl('deck_pngs'),
          data: JSON.stringify({
            deckId: that.props.selectedDeck.id
          }),
          method: 'POST',
          success: (result) => {
            that.pollJob('deck_pngs', result.jobId, closeFn);
          },
          error: closeFn
        })
      }
    )
  }

  handleCopyDeck = (deckName) => {
    this.createDeckHelper(deckName, null, this.props.selectedDeck.id, this.state.upgradeDeckOnCopy); 
  }

  toggleDeckPublic = () => {
    const that = this 
      , action = that.props.selectedDeck.public ?
          'make_private' :
          'make_public'
      , proceed = confirm(
          that.props.selectedDeck.public ?
          I18n.t('react.card_maker.confirm_make_private') :
          I18n.t('react.card_maker.confirm_make_public')
        )
      ;

    if (proceed) {
      that.props.showLoadingOverlay(null, (closeFn) => {
        $.ajax({
          url: cardMakerUrl('decks/' + that.props.selectedDeck.id + '/' + action),
          method: 'POST',
          success: () => {
            that.props.reloadCurLibResources(closeFn);
          }
        });
      });
    }
  }

  updateZoomCardIndex = (updater) => {
    this.setState((prevState, props) => {
      return {
        zoomCardIndex: prevState.zoomCardIndex === null ? 
          null : 
          updater(prevState.zoomCardIndex)
      }
    });
  }

  clearSearchValues = (cb) => {
    this.setState({
      deckSearchVal: '',
      cardSearchVal: '',
      sidebarOpen: false
    }, cb);
  }

  setSelectedDeck = (deck, cb) => {
    this.clearSearchValues(() => this.props.setSelectedDeck(deck, cb))
  }

  setLibrary = (lib, cb) => {
    this.clearSearchValues(() => this.props.setLibrary(lib, cb))
  }

  sortItems = () => {
    return this.props.sorts.map((sort) => {
      return {
        handleClick: () => { this.props.setSort(sort.key) },
        label: sort.label
      }
    });
  }

  render() {
    const managerClasses = [styles.simpleManager, styles.simpleManagerWToolbar]
      , deckCards = this.deckCards()
      , resources = this.resources(deckCards)
      , resourceElmts = this.resourceElmts(resources)
      , sidebarDecks = [this.props.allCardsDeck].concat(this.props.decks)
      ;

    return (
      <div className={managerClasses.join(' ')}>
        <ManagerModals 
          openModal={this.state.openModal} 
          selectedDeck={this.props.selectedDeck}
          closeModal={this.closeModal}
          onRequestSaveDeckDesc={this.handleSaveDeckDesc}
          userDeckNames={new Set(this.props.userDecks.map((deck) => deck.name))}
          onRequestCreateDeck={this.handleCreateDeck}
          onRequestCreateCard={this.handleCreateCard}
          onRequestRenameDeck={this.handleRenameDeck}
          onRequestMakePdf={this.handleMakePdf}
          onRequestCopyDeck={this.handleCopyDeck}
          onRequestUpgradeDeck={this.handleUpgradeDeck}
          zoomCard={this.state.openModal == 'cardZoom' ? deckCards[this.state.zoomCardIndex] : null}
          onRequestNextZoomCard={() => {
            this.updateZoomCardIndex((index) => {
              return (index + 1) % deckCards.length;
            });
          }}
          onRequestPrevZoomCard={() => {
            this.updateZoomCardIndex((index) => {
              var updated = (index - 1) % deckCards.length;
              if (updated < 0) { 
                updated = deckCards.length + updated;
              }
              return updated;
            });
          }}
          hasNextZoomCard={this.state.zoomCardIndex != null && this.state.zoomCardIndex < deckCards.length - 1}
          hasPrevZoomCard={this.state.zoomCardIndex != null && this.state.zoomCardIndex > 0}
          onRequestPublicCardsForTaxon={this.props.onRequestPublicCardsForTaxon}
          handleCopyCard={this.handleCopyCard}
          userDecks={this.props.userDecks}
          newDeckId={newDeckId}
        />
        {
          this.state.sidebarOpen && 
          <div className={styles.sidebarOpenOverlay} />
        }
        {
          sidebarDecks.length > 1 &&
          <DeckSidebar 
            decks={sidebarDecks}
            selectedDeck={this.props.selectedDeck}
            allCardsDeck={this.props.allCardsDeck}
            onRequestOpen={() => this.setState({ sidebarOpen: true })}
            onRequestClose={() => this.setState({ sidebarOpen: false })}
            onDeckSelect={this.setSelectedDeck}
            open={this.state.sidebarOpen}
          />
        }
        <div className={styles.managerHead}>
          <HeaderBar
            selectedDeck={this.props.selectedDeck}
            setSelectedDeck={this.setSelectedDeck}
            isAllCards={this.isAllCards()}
            library={this.props.library}
            setLibrary={this.props.setLibrary}
            onRequestEditDeckName={() => this.setState({ openModal: 'renameDeck' })}
          />
          {
            this.props.selectedDeck != null ?
            <CardToolbar 
              onRequestPrint={() => this.setState({ openModal: 'print' })} 
              onRequestPngDownload={this.createDeckPngs}
              userRole={this.props.userRole}
              library={this.props.library}
              selectedDeck={this.props.selectedDeck}
              onRequestCopy={() => this.setState({ openModal: 'copyDeck'})}
              onRequestUpgrade={() => this.setState({ openModal: 'upgradeDeck' })}
              onRequestShowUrl={() => this.setState({ openModal: 'deckUrl' })}
              onRequestToggleDeckPublic={this.toggleDeckPublic}
              onRequestOpenDeckUsers={() => this.setState({ openModal: 'deckUsers' })}
              onRequestDestroyDeck={() => this.handleDestroyDeck(this.props.selectedDeck)}
              onRequestUpdateSearchValue={(newVal) => {
                this.setState({ cardSearchVal: newVal })
              }}
              searchValue={this.state.cardSearchVal}
              isAllCards={this.isAllCards()}
              sortLabel={this.props.sort.label}
              sortItems={this.sortItems()}
            /> : 
            <DeckToolbar 
              autocompleteItems={this.state.deckSearchVal ? resources.items : []}
              onAutocompleteSelect={(value, deck) => this.setSelectedDeck(deck)}
              searchValue={this.state.deckSearchVal} 
              onRequestUpdateSearchValue={(newVal) => {
                this.setState({ deckSearchVal: newVal })
              }}
            />
          }
        </div>
        <div className={styles.managerMain}>
          <DescPart
            library={this.props.library}
            selectedDeck={this.props.selectedDeck}
            onRequestEditDesc={() => this.setState({ openModal: 'deckDesc' })}
            cardSearchVal={this.state.cardSearchVal}
            deckSearchVal={this.state.deckSearchVal}
            isAllCards={this.isAllCards()}
          />
          <ul className={[styles.decks, styles.lDecksCol].join(' ')}>
            {resourceElmts}
          </ul>
        </div>
      </div>
    );
  }
}

export default SimpleManager;

