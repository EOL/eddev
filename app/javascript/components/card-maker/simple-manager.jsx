import React from 'react';

import ManagerModals from './manager-modals'
import LoadingSpinnerImage from './loading-spinner-image'
import {cardMakerUrl, loResCardImageUrl, createCardUrl} from 'lib/card-maker/url-helper'
import HeaderBar from './header-bar'
import Toolbar from './toolbar'
import styles from 'stylesheets/card_maker/simple_manager'

const pollIntervalMillis = 1000
    , specialCardOrder = {
        'title': 0,
        'desc': 1,
        'vocab': 2,
        'key': 3,
      }
    ;

function DescPart(props) {
  let inner;

  if (props.library == 'public') {
    let text; 

    if (props.selectedDeck) {
      text = props.selectedDeck.desc;
    } else {
      text = 'Welcome to the public biodiversity card library! You can browse and print our pre-made decks here, or create your own by switching to your library.';
    }

    return <p className={styles.desc}>{text}</p>;
  } else {
    if (props.selectedDeck) {
      if (props.selectedDeck.desc) {
        return (
          <p className={styles.desc}>
            {props.selectedDeck.desc} 
            <i onClick={props.onRequestEditDesc} className={'fa fa-edit'} />
          </p>
        );
      } else {
        return (
          <div 
            className={[styles.btn, styles.btnDesc].join(' ')}
            onClick={props.onRequestEditDesc}
          >add a description</div>
        );
      }
    }
  }

  return null;
}

class SimpleManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: null,
      zoomCardIndex: null
    }
  }

  deckItem = (deck) => {
    var inner;

    if (deck.titleCardId) {
      let card = this.props.cards.find((card) => {
        return card.id === deck.titleCardId;
      });

      inner = <LoadingSpinnerImage src={loResCardImageUrl(card)} />
    } else {
      inner = <div className={styles.deckText}>{deck.name}</div>
    }

    return (
      <li 
        className={styles.deck}
        key={deck.id}
        onClick={() => this.props.setSelectedDeck(deck)}
      >{inner}</li>
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

    that.props.showLoadingOverlay(null, (closeFn) => {
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

  cardItem = (card, i) => {
    return (
      <li
        className={styles.card}
        key={card.id}
      >
        <LoadingSpinnerImage src={loResCardImageUrl(card)} load={true}/>
        <div className={styles.resourceOverlay}>
          {
            this.props.library === 'user' &&
            <i
              className='fa fa-edit fa-3x edit-btn'
              onClick={() => this.props.onRequestEditCard(card)}
            />
          }
          <i
            className='fa fa-expand fa-3x'
            onClick={() => this.handleCardZoomClick(i)}
          />
          {
            this.props.library === 'user' && 
            <i
              className='fa fa-trash-o fa-3x'
              onClick={() => this.handleDestroyCard(card)}
            />
          }
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
        <div>
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
    return this.props.selectedDeck ? 
      this.props.cards.filter((card) => {
        return card.deck === this.props.selectedDeck.id;
      }).sort(this.deckCardSort) :
      [];
  }

  deckCardSort = (a, b) => {
    if (a.locale === I18n.locale && b.locale !== I18n.locale) {
      return -1;
    }

    if (a.locale !== I18n.locale && b.locale === I18n.locale) {
      return 1;
    }

    if (a.templateName === 'trait' && b.templateName !== 'trait') {
      return 1;
    }

    if (a.templateName !== 'trait' && b.templateName === 'trait') {
      return -1
    }

    if (a.templateName !== 'trait' && b.templateName !== 'trait') {
      return (specialCardOrder[a.templateName] || -1) - (specialCardOrder[b.templateName] || -1);
    }

    return this.props.sort.fn(a, b)
  }

  resources = (cards) => {
    let resources;

    if (this.props.selectedDeck) {
      resources = cards.map((card, i) => {
        return this.cardItem(card, i);
      });
    } else {
      resources = this.props.decks.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        } else {
          return 1;
        }
      }).map((deck) => {
        return this.deckItem(deck);
      });
    }

    if (this.props.library === 'user') {
      if (this.props.selectedDeck) {
        resources = [this.newCardElmt()].concat(resources);
      } else {
        resources = [this.newDeckElmt()].concat(resources);
      }
    }

    return resources;
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
    that.props.showLoadingOverlay(null, (close) => {
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

  createDeckHelper = (deckName, colId, copyFrom, upgrade) => {
    const that = this
        , showUpgradedNotice = upgrade
        , data = {
            name: deckName,
            copyFrom: copyFrom,
            upgradeTemplates: upgrade
          }
        ;

    that.props.showLoadingOverlay(null, (closeFn) => {
      $.ajax({
        url: cardMakerUrl('decks'),
        method: 'POST',
        data: JSON.stringify(data),
        success: (deck) => {
          const cb = (err) => { 
            if (err) {
              closeFn();
              alert(I18n.t('react.card_maker.unexpected_error_msg'));
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
      this.props.setSelectedDeck(deck, cb);
    } else if (cb) {
      cb();
    }
  }

  createOrCopyCard = (data, deck) => {
    let that = this;

    that.props.showLoadingOverlay(null, (closeFn) => {
      $.ajax({
        url: createCardUrl(deck),
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

  handleCopyCard = (deckId) => {
    this.closeModal();
    this.createOrCopyCard({ 
      copyFrom: this.state.copyCardId 
    }, deckId);
  }

  handleCreateCard = (template, params) => {
    const data = {
            templateName: template,
            templateParams: params,
          }
        ;

    this.closeModal();
    this.createOrCopyCard(data, this.props.selectedDeck);
  }

  handleRenameDeck = (name) => {
    const that = this;

    that.props.showLoadingOverlay(null, (closeFn) => {
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

  handleMakePdf = (cardBackId) => {
    const that = this;

    that.closeModal();

    that.props.showLoadingOverlay(
      I18n.t('react.card_maker.print_loading_msg'), 
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

    $.getJSON(cardMakerUrl(baseUrl + '/' + jobId + '/status'), (result) => {
      if (result.status === 'done') {
        overlayCloseFn();
        window.open(cardMakerUrl(baseUrl + '/downloads/' + result.resultFileName));
      } else if (result.status === 'running') {
        setTimeout(() => {
          that.pollJob(baseUrl, jobId, overlayCloseFn)
        }, pollIntervalMillis)
      } else {
        overlayCloseFn();
        alert(I18n.t('react.card_maker.unexpected_error_msg'));
      }
    });
  }

  pollPdfJob = (id, overlayCloseFn) => {
    this.pollJob('deck_pdfs', id, overlayCloseFn);
  }

  createDeckPngs = () => {
    const that = this;

    that.props.showLoadingOverlay(
      I18n.t('react.card_maker.it_may_take_a_few_mins'),
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

  render() {
    const hasToolbar = this.props.selectedDeck != null
      , managerClasses = [styles.simpleManager]
      , deckCards = this.deckCards()
      , resources = this.resources(deckCards)
      ;

    if (hasToolbar) {
      managerClasses.push(styles.simpleManagerWToolbar);
    }

    console.log(this.state);

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
        />
        <HeaderBar
          selectedDeck={this.props.selectedDeck}
          setSelectedDeck={this.props.setSelectedDeck}
          library={this.props.library}
          setLibrary={this.props.setLibrary}
          onRequestEditDeckName={() => this.setState({ openModal: 'renameDeck' })}
        />
        {
          hasToolbar && 
          <Toolbar 
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
          />
        }
        <div className={styles.managerMain}>
          <DescPart
            library={this.props.library}
            selectedDeck={this.props.selectedDeck}
            onRequestEditDesc={() => this.setState({ openModal: 'deckDesc' })}
          />
          <ul className={styles.decks}>
            {resources}
          </ul>
        </div>
      </div>
    );
  }
}

export default SimpleManager;

