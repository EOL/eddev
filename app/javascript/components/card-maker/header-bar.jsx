import React from 'react'
import styles from 'stylesheets/card_maker/simple_manager'

function LibButton(props) {
  let buttonText
    , lib
    ;  

  if (props.library === 'user') {
    buttonText = 'switch to public library';  
    lib = 'public';
  } else {
    buttonText = 'switch to your library';
    lib = 'user';
  }

  return (
    <div className={[styles.btn, styles.btnLib].join(' ')} onClick={() => props.setLibrary(lib)}>
      {buttonText}
    </div>
  );
}

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
      <div className={[styles.barInner, styles.lDecksCol].join(' ')}>
        {
          props.selectedDeck != null &&
          <i className={`fa fa-angle-left fa-2x ${styles.headerBack}`} onClick={() => props.setSelectedDeck(null)} />
        }
        <h1 className={styles.headerText}>
          {headerText}
          {
            props.selectedDeck != null && props.library == 'user' && !props.isAllCards &&
              <i className="fa fa-edit" onClick={props.onRequestEditDeckName}/>
          }
        </h1>
        <LibButton {...props} />
      </div>
    </div>
  );
}

export default HeaderBar;

