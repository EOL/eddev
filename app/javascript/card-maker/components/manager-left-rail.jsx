import React from 'react'
import Search from './search'
import styles from 'stylesheets/card_maker/card_manager'
import eolLogo from 'images/welcome/eol_logo.png'


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
    let searchVal = this.state.deckSearchVal
      , baseItems = [
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
          this.deckItem(this.props.allCardsDeck, ''),
        ]
      ;

    if (this.props.library === 'user') {
      baseItems.push(this.deckItem(this.props.unassignedCardsDeck, ''));
    }

    return baseItems.concat(
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
          {/* <img src={eolLogo} className={styles.cardsHdrEolLogo}/> */}
          <i className={`cm-icon-two-cards ${styles.cardsHdrTwoCards}`} />
          <div className={styles.cardsHdrTxt} dangerouslySetInnerHTML={{__html: I18n.t('react.card_maker.card_maker_html')}} />
        </div>
        <ul className={styles.libs} >
          {this.lib(I18n.t('react.card_maker.my_cards'), 'user', 'user')}
          {this.lib(I18n.t('react.card_maker.public_cards'), 'users', 'public')}
        </ul>
        {
          this.props.decks.length > 0 && 
          <div className={styles.searchContain}>
            <Search 
              placeholder={I18n.t('react.card_maker.search_decks')}
              handleChange={val => this.setState({ deckSearchVal: val })}
              value={this.state.deckSearchVal}
            />
          </div>
        }
        <ul className={styles.decks}>
          {this.deckItems()}
        </ul>
      </div>
    );
  }
}

export default ManagerLeftRail;
