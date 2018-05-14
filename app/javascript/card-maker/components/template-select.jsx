import React from 'react'

import styles from 'stylesheets/card_maker/card_manager'
import bioCard from 'images/card_maker/sample_cards/biodiversity.png'
import titleCard from 'images/card_maker/sample_cards/title.png'

class TemplateSelect extends React.Component {
  item = (options) => {
    return (
      <li className={styles.cardTemplate}>
        <img src={options.img} />
        <div>{I18n.t('react.card_maker.' + options.nameKey)}</div>
        <button
          className={[styles.createBtn, styles.createBtnTempl].join(' ')}
          type='button'
          onClick={() => this.props.handleSelect(options.template)}
        >{I18n.t('react.card_maker.create')}</button>
      </li>
    );
  }

  render() {
    return (
      <ul className={styles.cardTemplates}>
        {
          this.item({ 
            img: bioCard,
            nameKey: 'bio_card',
            template: 'trait'
          })
        }
        {
          this.item({
            img: titleCard,
            nameKey: 'title_card',
            template: 'title'
          })
        }
        {
          this.item({
            img: 'foo',
            nameKey: 'key_card',
            template: 'key'
          })
        }
      </ul>
    );
  }
}

export default TemplateSelect;
