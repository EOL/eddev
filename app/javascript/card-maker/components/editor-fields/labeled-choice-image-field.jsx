import React from 'react'

import fieldWrapper from './field-wrapper'

class LabeledChoiceImageField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }

  buildChoiceElmt = (selectedTxt, menuTxt, choiceKey) => {
    return (
      <li
        key={choiceKey}
        className='choice'
        onClick={() => this.props.setChoiceKey(choiceKey)}
      >
        {menuTxt}
      </li>
    )
  }

  buildChoices = () => {
    const elmts = [this.buildChoiceElmt('Select one', '—', null)];

    for (let i = 0; i < this.props.choices.length; i++) {
      let choice = this.props.choices[i];
      elmts.push(this.buildChoiceElmt(choice.label, choice.label, choice.choiceKey));
    }

    return elmts;
  }

  closeMenu = () => {
    document.removeEventListener('click', this.closeMenu);
    this.props.enableCol();
    this.setState((prevState, props) => {
      return {
        open: false,
      }
    });
  }

  handleMenuClick = () => {
    if (!this.state.open) {
      this.props.disableCol();
      document.addEventListener('click', this.closeMenu);

      this.setState((prevState, props) => {
        return {
          open: true,
        }
      });
    }
  }

  render() {
    let rootClassName = 'labeled-choice-drop'
      , choicesClassName = 'choices'
      , displayText = this.props.value.label ? this.props.value.label : '—'
      ;

    if (this.state.open) {
      rootClassName += ' open disable-exempt';
      choicesClassName += ' disable-exempt';
    }

    return (
      <div className={rootClassName} onClick={this.handleMenuClick}>
        <div className='selected-txt-wrap'>
          <div className='selected-txt'>{displayText}</div>
          <i className='cm-icon-sug-arrow-down' />
        </div>
        <ul className={choicesClassName}>
          {this.buildChoices()}
        </ul>
      </div>
    )
  }
}

export default fieldWrapper(LabeledChoiceImageField);
