import React from 'react'

import fieldWrapper from './field-wrapper'

class ColorSchemeField extends React.Component {
  setChoiceIndex = (i) => {
    this.props.setChoiceIndex(i);
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
          ;

        items.push((
          <li
            key={i}
            className='color-scheme'
            style={style}
            onClick={() => this.setChoiceIndex(i)}
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
