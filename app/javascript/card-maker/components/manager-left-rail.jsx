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

  lib = (text, faIcon, library) => {
    var classNames = [styles.lib];

    if (this.props.library === library) {
      classNames.push(styles.isLibActive);
    }

    return (
      <li 
        className={classNames.join(' ')} 
        onClick={this.props.library !== library ? this.props.handleToggleLibrary : null}
      >
        <i className={`${styles.libIcon} fa fa-${faIcon}`} />
        <span>{text}</span>
        <i className={`${styles.libCheck} fa fa-check`} />
      </li>
    );
  }

  render() {
    return (
      <div className={styles.lLeftRail}>
        <div className={styles.cardsHdr}>
          <span>LOGO GOES HERE</span>
        </div>
        <ul className={styles.libs} >
          {this.lib(I18n.t('react.card_maker.my_cards'), 'user', 'user')}
          {this.lib(I18n.t('react.card_maker.public_cards'), 'users', 'public')}
        </ul>
        {/*
        <div className={styles.railCtrls}>
          <div className={styles.cardsHdr}>
            <i className="cm-icon-eol" />
            <i className="cm-icon-cards" />
          </div>
          {this.libCtrls()}
        </div>
        <ul className={`${styles.decks} ${styles.decksAll}`}>
          {this.deckItem(this.props.allCardsDeck, null)}
        </ul>
        <Search 
          placeholder='search decks'
          handleChange={val => this.setState({ deckSearchVal: val })}
          value={this.state.deckSearchVal}
        />
        <ul className={styles.decks}>
          {this.deckItems()}
        </ul>
        */}
      </div>
    );
  }
}

export default ManagerLeftRail;
