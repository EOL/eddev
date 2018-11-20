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

  render() {
    return (
      <div>
        <ManagerModals 
          openModal={this.state.openModal} 
          selectedDeck={this.props.selectedDeck}
          closeModal={this.closeModal}
          onRequestSaveDeckDesc={this.handleSaveDeckDesc}
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

