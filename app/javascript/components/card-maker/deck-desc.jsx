import React from 'react'
import styles from 'stylesheets/card_maker/card_manager'

const maxDescLength = 540
function DeckDesc(props) {
  function descInput() {
    return [
      (
        <textarea 
          className={styles.descInput} 
          value={props.value}
          onChange={props.handleInputChange}
          key='0'
          ref={node => node && node.focus()}
          maxLength={maxDescLength}
        ></textarea>
      ),
      (
        <ul 
          className={styles.descBtns}
          key='1'
        >
          <li 
            className={styles.descBtn}
            onClick={props.handleRequestSave}
          >{I18n.t('react.card_maker.save_desc')}</li>
          <li 
            className={styles.descBtn}
            onClick={props.handleRequestClose}
          >{I18n.t('react.card_maker.cancel')}</li>
        </ul>
      ),
    ];
  }

  let inner = null
    , result = null
    ; 

  if (props.showInput) {
    inner = descInput();
  } else {
    if (props.value) {
      inner = props.value;
    } else if (props.library === 'user') {
      inner = (
        <div
          className={styles.descAdd}
          onClick={props.handleRequestInput}
        >
          <i className='fa fa-lg fa-edit' />
          <span>{I18n.t('react.card_maker.add_desc')}</span>
        </div>
      );
    }
  }

  if (inner) {
    result = (
      <div className={styles.lDesc}>
        <div className={styles.desc}>
          {inner} 
        </div>
      </div>
    );
  }

  return result;
}

export default DeckDesc; 

