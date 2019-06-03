import React from 'react'

import styles from 'stylesheets/card_maker/new_card_lightbox'

function TemplateSelect(props) {
  return (
    <div className={styles.templateSelect}>
      <ul className={styles.templates}>
        {
          props.cardTypes.map((type, i) => {
            return (
              <li onClick={() => props.onTemplateSelect(type.key)} className={styles.template} key={type.key}>
                <img src={type.img} />
                <div>{I18n.t('react.card_maker.' + type.nameKey)}</div>
                <input type='radio' name='template' value={type.key} readOnly={true} checked={type.selected}/>
              </li>
            );
          })
        }
      </ul>
      <div 
        className={[styles.btn, styles.btnNewCard].join(' ')}
        onClick={props.onSubmit}
      >{props.buttonText}</div>
    </div>
  );
}

export default TemplateSelect;

