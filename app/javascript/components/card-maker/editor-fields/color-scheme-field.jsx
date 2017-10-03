import React from 'react'

import fieldWrapper from './field-wrapper'

class ColorSchemeField extends React.Component {
  setChoiceKey = (key) => {
    this.props.setChoiceKey(key);
  }

  buildColorElmts = () => {
    const items = [];

    if (this.props.choices) {
      for (let i = 0; i < this.props.choices.length; i++) {
        let choice = this.props.choices[i]
          , choiceTip = this.props.choiceTips &&
              i < this.props.choiceTips.length &&
              this.props.choiceTips[i] ?
              this.props.choiceTips[i] :
              '—'
          , style = {
              backgroundColor: choice.bg,
              color: choice.text
            }
          , key = choice.choiceKey
          ;

        items.push((
          <li
            key={i}
            className='color-scheme'
            style={style}
            onClick={() => this.setChoiceKey(key)}
          >
            {choiceTip}
          </li>));
      }
    }

    return items;
  }

  render() {
    return (
      <ul className='color-schemes'>
        {this.buildColorElmts()}
      </ul>
    )
  }
}

export default fieldWrapper(ColorSchemeField, true);
