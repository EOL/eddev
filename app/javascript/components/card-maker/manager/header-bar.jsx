import React from 'react'

import LibButton from './lib-button'

import styles from 'stylesheets/card_maker/simple_manager'

function HeaderBar(props) {
  let headerText
    , backText
    , backHandler
    , backIcon
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

  if (props.selectedDeck == null) {
    backText = I18n.t('react.card_maker.back_to_site');
    backHandler = () => {
      window.location = props.backToSitePath;
    }
    backIcon = 'close'
  } else {
    backText = I18n.t('react.card_maker.back_to_decks'); 
    backHandler = () => {
      props.setSelectedDeck(null)
    }
    backIcon = 'angle-left';
  }

  return (
    <div className={[styles.bar, styles.headerBar].join(' ')}>
      <div className={[styles.barInner, styles.barInnerHeader].join(' ')}>
        <div 
          className={[styles.headerText, styles.headerBack].join(' ')}
          onClick={backHandler}
        >
          <i className={`fa fa-${backIcon} fa-2x`} />
          <span>{backText}</span>
        </div>
        <h1 className={styles.headerTitle}>
          <span className={[styles.headerText, styles.headerTitleText].join(' ')}>{headerText}</span>
          {
            props.selectedDeck != null && props.library == 'user' && !props.isAllCards &&
              <i className={`fa fa-edit ${styles.editBtn} ${styles.editBtnHdr}`} onClick={props.onRequestEditDeckName}/>
          }
        </h1>
        {
          props.selectedDeck == null && 
          <LibButton {...props} extraClass={styles.btnLibHeader} />
        }
      </div>
    </div>
  );
}

export default HeaderBar;

