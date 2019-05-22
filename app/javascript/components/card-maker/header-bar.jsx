import React from 'react'

import LibButton from './lib-button'

import styles from 'stylesheets/card_maker/simple_manager'

function HeaderBar(props) {
  let headerText
    ;

  if (props.isAllCards) {
    if (props.library === 'user') {
      headerText = 'All your cards';
    } else {
      headerText = 'All public cards';
    }
  } else if (props.selectedDeck) {
    headerText = props.selectedDeck.name;
  } else {
    if (props.library === 'user') {
      headerText = 'Your decks';
    } else {
      headerText = 'Public decks';
    }
  }

  return (
    <div className={[styles.bar, styles.headerBar].join(' ')}>
      <div className={[styles.barInner, styles.barInnerHeader].join(' ')}>
        {
          props.selectedDeck != null &&
          <i className={`fa fa-angle-left fa-2x ${styles.headerBack}`} onClick={() => props.setSelectedDeck(null)} />
        }
        <h1 className={styles.headerText}>
          {headerText}
          {
            props.selectedDeck != null && props.library == 'user' && !props.isAllCards &&
              <i className={`fa fa-edit ${styles.editBtn}`} onClick={props.onRequestEditDeckName}/>
          }
        </h1>
        <LibButton {...props} extraClass={styles.btnLibHeader} />
      </div>
    </div>
  );
}

export default HeaderBar;

