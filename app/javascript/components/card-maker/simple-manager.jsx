import React from 'react';

import LoadingSpinnerImage from './loading-spinner-image'
import {loResCardImageUrl} from 'lib/card-maker/url-helper'
import Card from './card'
import styles from 'stylesheets/card_maker/simple_manager'

class SimpleManager extends React.Component {
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

  headerBar = () => {
    var headerText;

    if (this.props.selectedDeck) {
      headerText = this.props.selectedDeck.name;
    } else {
      headerText = 'Browsing All Decks';
    }

    return (
      <div className={styles.headerBar}>
        {
          this.props.selectedDeck != null &&
          <i className='fa fa-arrow-left fa-2x' onClick={() => this.props.setSelectedDeck(null)} />
        }
        <h1>{headerText}</h1>
      </div>
    );
  }

  resources = () => {
    if (this.props.selectedDeck) {
      let deckCards = this.props.cards.filter((card) => {
        return card.deck === this.props.selectedDeck.id;
      });

      return deckCards.map((card) => {
        return this.cardItem(card);
      });
    } else {
      return this.props.decks.map((deck) => {
        return this.deckItem(deck);
      });
    }
  }

  render() {
    return (
      <div>
        {this.headerBar()}
        <ul className={styles.decks}>
          {this.resources()}
        </ul>
      </div>
    );
  }
}

export default SimpleManager;

