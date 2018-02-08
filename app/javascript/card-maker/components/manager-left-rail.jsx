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

  highlight = (highlight, name) => {
    var startIndex = name.toLowerCase().indexOf(highlight.toLowerCase())
      , highlighted = name
      ;

    if (startIndex > -1) {
      highlighted = [
        name.slice(0, startIndex), 
        '<strong>', 
        name.slice(startIndex, startIndex + highlight.length),
        '</strong>',
        name.slice(startIndex + highlight.length)
      ].join('');
    }

    return highlighted;
  }

  deckItem = (deck, highlight) => {
    const highlightedName = highlight && highlight.length ?  
            this.highlight(highlight, deck.name) :
            deck.name
        , selected = this.props.selectedDeck === deck 
        ;

    return (
      <li
        key={deck.id}
        onClick={() => this.props.handleDeckSelect(deck)}  
        className={[styles.deck, 
          (selected ? styles.isDeckActive : '')
        ].join(' ')}
      >
        <span className={styles.deckName} dangerouslySetInnerHTML={{ __html: highlightedName }} />
        {selected && <i className={`${styles.checkDeck} fa fa-check`} />}
      </li>
    )
  }

  deckItems = () => {
    let searchVal = this.state.deckSearchVal.trim();

    return [
      ( 
        this.props.library === 'user' &&
        <li 
          key='newdeck_btn' 
          className={[styles.deck, styles.deckNew].join(' ')} 
          onClick={this.props.handleNewDeck}
        >
          <i className={`${styles.deckNewPlus} fa fa-plus`} />
          <span>{I18n.t('react.card_maker.new_deck_lc')}</span>
        </li>
      ),
      this.deckItem(this.props.allCardsDeck, '')
    ].concat(
      this.props.decks.filter((deck) => {
        return deck.name.toLowerCase().includes(searchVal.toLowerCase());
      }).map((deck) => {
        return this.deckItem(deck, searchVal);
      })
    );
  }

  lib = (text, faIcon, library) => {
    var classNames = [styles.lib]
      , selected = this.props.library === library
      ;

    if (selected) {
      classNames.push(styles.isLibActive);
    }

    return (
      <li 
        className={classNames.join(' ')} 
        onClick={selected ? null : this.props.handleToggleLibrary}
      >
        <i className={`${styles.libIcon} fa fa-${faIcon}`} />
        <span>{text}</span>
        {selected && <i className={`${styles.checkLib} fa fa-check`} />}
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
        {
          this.props.decks.length > 0 && 
          <Search 
            placeholder='search decks'
            handleChange={val => this.setState({ deckSearchVal: val })}
            value={this.state.deckSearchVal}
          />
        }
        <ul className={styles.decks}>
          {this.deckItems()}
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
        */}
      </div>
    );
  }
}

export default ManagerLeftRail;
