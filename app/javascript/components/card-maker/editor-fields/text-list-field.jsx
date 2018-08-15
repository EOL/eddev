import React from 'react'

import ColorMenu from './color-menu'
import SuggestionsMenu from './suggestions-menu'
import fieldWrapper from './field-wrapper'

import styles from 'stylesheets/card_maker/card_editor'

class TextListField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  buildItems = () => {
    const items = new Array(this.props.field.max);

    for (let i = 0; i < items.length; i++) {
      let curVal = i < this.props.value.length ? this.props.value[i].text : '';

      items[i] = (
        <li key={i}>
          <textarea
            type='text'
            className={[styles.textEntry, styles.textEntryTextList].join(' ')}
            onChange={(e) => this.props.setTextListData(i, e.target.value)}
            value={curVal}
          />
        </li>
      )
    }

    return items;
  }

  render() {
    return (
      <ul className={styles.keyValFields}>
        {this.buildItems()}
      </ul>
    )
  }
}

export default fieldWrapper(TextListField)
