import React from 'react'

import styles from 'stylesheets/card_maker/card_manager'
import bioCard from 'images/card_maker/sample_cards/biodiversity.png'

class TemplateSelect extends React.Component {
  render() {
    return (
      <ul className={styles.cardTemplates}>
        <li className={styles.cardTemplate}>
          <img src={bioCard} />
          <div>{I18n.t('react.card_maker.bio_card')}</div>
          <button
            className={[styles.createBtn, styles.createBtnTempl].join(' ')}
            type='button'
            onClick={() => this.props.handleSelect('trait')}
          >{I18n.t('react.card_maker.create')}</button>
        </li>
      </ul>
    );
  }
}

export default TemplateSelect;
