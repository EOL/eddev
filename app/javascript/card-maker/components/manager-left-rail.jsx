import React from 'react'
import Search from './search'
import styles from 'stylesheets/card_maker/card_manager'


class ManagerLeftRail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deckSearchVal: ''  
    }
  }

  handleDeckSearchChange = val => {
    this.setState({
      deckSearchVal: val
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
        onClick={() => this.props.handleDeckSelect(deck)}  
        className={[styles.deck, 
          (this.props.selectedDeck === deck ? styles.isDeckSel : '')
        ].join(' ')}
        dangerouslySetInnerHTML={{ __html: highlightedName }}
      />
    )
  }

  deckItems = () => {
    let searchVal = this.state.deckSearchVal.trim();

    return this.props.decks.filter((deck) => {
      return deck.name.includes(searchVal);
    }).map((deck) => {
      return this.deckItem(deck, searchVal);
    }); 
  }

  libCtrls = () => {
    let yourCards   = I18n.t('react.card_maker.my_cards')
      , publicCards = I18n.t('react.card_maker.public_cards')
      , faIcon
      , active
      , inactive
      ;

    if (this.props.library === 'user') {
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
          onClick={this.props.handleToggleLibrary}
        >
          <i className={`fa fa-${faIcon}`} />
          <span>{inactive}</span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.lLeftRail}>
        <div className={styles.railCtrls}>
          <div className={styles.newRow}>
            <div className={styles.cardsHdr}>
              <h2>Cards logo goes here</h2>
            </div>
          </div>
          {this.libCtrls()}
        </div>
        <ul className={`${styles.decks} ${styles.decksAll}`}>
          {this.deckItem(this.props.allCardsDeck, null)}
          {/*<li className={`${styles.deck} ${styles.isDisabled}`}>all decks</li>*/}
        </ul>
        <Search 
          placeholder='search decks'
          handleChange={val => this.setState({ deckSearchVal: val })}
          value={this.state.deckSearchVal}
        />
        <ul className={styles.decks}>
          {this.deckItems()}
        </ul>
      </div>
    );
  }
}

export default ManagerLeftRail;
