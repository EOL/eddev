import React from 'react'

import SuggestionsMenu from './suggestions-menu'

import fieldWrapper from './field-wrapper'

class KeyValListField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusIndex: null,
      focusTarget: null,
    }
  }

  handleInputChange = (index, keyOrVal, event) => {
    this.props.setKeyValText(keyOrVal, index, event.target.value);
  }

  handleInputBlur = (index) => {
    this.props.enableCol();
    this.setState(() => {
      return {
        focusIndex: null,
        focusTarget: null,
      }
    })
  }

  handleInputFocus = (index, event) => {
    const target = event.target;

    this.props.disableCol();
    this.setState(() => {
      return {
        focusIndex: index,
        focusTarget: target,
      }
    })
  }

  handleSuggestionsSelect = (text) => {
    this.props.setKeyValText('key', this.state.focusIndex, text);
    this.state.focusTarget.blur();
  }

  buildItems = () => {
    const items = new Array(this.props.field.max);

    for (let i = 0; i < items.length; i++) {
      let curKey = ''
        , curVal = ''
        , keyClassName = 'key text-input text-entry key-val-field'
        , valClassName = 'val text-input text-entry key-val-field'
        ;

      if (i < this.props.value.length) {
        curKey = this.props.value[i].key.text;
        curVal = this.props.value[i].val.text;
      }

      if (i === this.state.focusIndex) {
        keyClassName += ' disable-exempt';
      }

      items[i] = (
        <li className='key-val-row' key={i}>
          <input
            type='text'
            className={keyClassName}
            value={curKey}
            onChange={(event) => this.handleInputChange(i, 'key', event)}
            onFocus={(event) => this.handleInputFocus(i, event)}
            onBlur={() => this.handleInputBlur(i)}
          />
          {i === this.state.focusIndex &&
            <SuggestionsMenu
              anchor={this.state.focusTarget}
              items={this.props.choices.map((choice) => {return choice.text})}
              handleSelect={this.handleSuggestionsSelect}
            />
          }
          <input
            type='text'
            className={valClassName}
            value={curVal}
            onChange={(event) => this.handleInputChange(i, 'val', event)}
          />
        </li>
      )
    }

    return items;
  }

  render() {
    return (
      <ul className='key-val-fields'>
        {this.buildItems()}
      </ul>
    )
  }
}

export default fieldWrapper(KeyValListField)
