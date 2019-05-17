import React from 'react'
import styles from 'stylesheets/card_maker/simple_manager'

function DeckSidebar(props) {
  const classNames = [styles.deckSidebar]
      , angleDir = props.open ? 'left' : 'right'
      , handleFn = props.open ? props.onRequestClose : props.onRequestOpen
      ;

  if (props.open) {
    classNames.push(styles.isDeckSidebarVisible);
  }

  return (
    <div className={classNames.join(' ')}>
      <h3>Jump to deck:</h3>
      <ul className={styles.sidebarDecks}>
        {props.decks.map((deck) => {
          const classNames = [styles.sidebarDeck];
          let handleClick = () => props.onDeckSelect(deck);

          if (deck === props.selectedDeck) {
            classNames.push(styles.isSidebarDeckSelected);
            handleClick = null;
          }

          return (
            <li 
              onClick={handleClick}
              key={deck.id}
              className={classNames.join(' ')}
            >{deck.name}</li>  
          )
        })}
      </ul>
      <div className={styles.deckSidebarHandle} onClick={handleFn}>
        <i className={`fa fa-angle-${angleDir} fa-2x`} />
      </div>
    </div>
  );
}

export default DeckSidebar;

