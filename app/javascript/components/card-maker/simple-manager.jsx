import React from 'react';

import ManagerModals from './manager-modals'
import LoadingSpinnerImage from './loading-spinner-image'
import {cardMakerUrl, loResCardImageUrl} from 'lib/card-maker/url-helper'
import HeaderBar from './header-bar'
import styles from 'stylesheets/card_maker/simple_manager'

function DescPart(props) {
  let inner;

  if (props.library == 'public') {
    let text; 

    if (props.selectedDeck) {
      text = desc;
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
      openModal: null
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

  cardItem = (card) => {
    return (
      <li
        className={styles.card}
        key={card.id}
      >
        <LoadingSpinnerImage src={loResCardImageUrl(card)} />
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

  resources = () => {
    let resources;

    if (this.props.selectedDeck) {
      let deckCards = this.props.cards.filter((card) => {
        return card.deck === this.props.selectedDeck.id;
      });

      resources = deckCards.map((card) => {
        return this.cardItem(card);
      });
    } else {
      resources = this.props.decks.map((deck) => {
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

  render() {
    return (
      <div>
        <ManagerModals 
          openModal={this.state.openModal} 
          selectedDeck={this.props.selectedDeck}
          closeModal={this.closeModal}
          onRequestSaveDeckDesc={this.handleSaveDeckDesc}
          userDeckNames={new Set(this.props.userDecks.map((deck) => deck.name))}
          onRequestCreateDeck={this.handleCreateDeck}
        />
        <HeaderBar
          selectedDeck={this.props.selectedDeck}
          setSelectedDeck={this.props.setSelectedDeck}
          library={this.props.library}
          setLibrary={this.props.setLibrary}
        />
        <DescPart
          library={this.props.library}
          selectedDeck={this.props.selectedDeck}
          onRequestEditDesc={() => this.setState({ openModal: 'deckDesc' })}
        />
        <ul className={styles.decks}>
          {this.resources()}
        </ul>
      </div>
    );
  }
}

export default SimpleManager;

