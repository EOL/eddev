import React from 'react';

import LabeledTextDropdown from './labeled-text-dropdown'
import fieldWrapper from './field-wrapper'
import styles from 'stylesheets/card_maker/card_editor'

class LabeledTextField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestionsOpen: false,
      colorsOpen: false,
      bgColorChoices: []
    }
  }

  componentDidMount() {
    /* determine if there is a custom value and set the tab if so */
    let found = false;

    if (
      !this.props.field.allowCustom || 
      (
        !(this.props.value.text && this.props.value.text.length) && 
        !(this.props.value.label && this.props.value.label.length)
      )
    ) {
      return;
    }

    for (let i = 0; i < this.props.choices.length && !found; i++) {
      let choice = this.props.choices[i];

      if (
        this.props.value.text === choice.text && 
        this.props.value.bgColor === choice.bgColor &&
        this.props.value.label === choice.label
      ) {
        found = true;
      }
    }

    if (!found) {
      this.props.requestFieldTab('custom');
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeColors);
  }

  componentWillReceiveProps(nextProps) {
    let bgColorChoices = nextProps.choices ? 
              [ 
                ...new Set(nextProps.choices.map((choice) => {
                  return choice.bgColor.toLowerCase()
                }))
              ].sort((a, b) => {
                if (a < b) {
                  return 1;
                }

                if (a > b) {
                  return -1;
                }

                return 0;
              }) :
            []
      ;

    this.setState({
      bgColorChoices: bgColorChoices
    });
  
    if (nextProps.fieldTab === 'custom' && !nextProps.value.bgColor && bgColorChoices.length) {
      this.props.setDataAttr('bgColor', bgColorChoices[0]);
    } else if (this.props.fieldTab === 'custom' && nextProps.fieldTab !== 'custom') {
      this.props.setChoiceKey(this.props.choiceKey);
    }
  }

  handleChange = (event) => {
    this.props.setDataAttr('text', event.target.value);
  }

  closeColors =  () => {
    this.setState({
      colorsOpen: false
    }, this.props.enableCol);

    document.removeEventListener('click', this.closeColors)
  }

  openColors = () => {
    this.setState({
      colorsOpen: true
    }, this.props.disableCol);

    document.addEventListener('click', this.closeColors);
  }

  toggleColors = () => {
    if (this.state.colorsOpen) {
      this.closeColors();
    } else {
      this.openColors();
    }
  }

  buildCustomInput = (textInputClasses) => {
    const elmts = [
            (
              <input
                type='text'
                key='customInput'
                onChange={this.handleChange}
                className={`${styles.textInput} ${styles.textInputTextField} ${styles.textEntry}`}
                value={this.props.value.text || ''}
              />
            )
          ]
        , colorBtnClasses = [styles.textInputColorBtn]
        ;

    if (this.state.colorsOpen) {
      colorBtnClasses.push(styles.isDisableExempt);
    }

    if (this.state.bgColorChoices.length) {
      elmts.push((
        <div
          className={colorBtnClasses.join(' ')}
          key='colorSuggestBtn'
          style={{
            backgroundColor: (this.props.value.bgColor || '#fff'),
          }}
          onClick={this.toggleColors}
        >
          <i 
            className='cm-icon-sug-arrow-down' 
            style={{ 
              color: this.props.fieldColor, 
            }}
          />
        </div>
      ));
    }

    return (
      <div className={styles.textInputWColors}>
        <div className={textInputClasses.join(' ')}>
          {elmts}
        </div>
        {
          this.state.colorsOpen &&
          <ul 
            key='colorChoices'
            className={`${styles.colorChoices} ${styles.isDisableExempt}`}
          >
            {
              this.state.bgColorChoices.map((color) => {
                return (
                  <li
                    key={color}
                    onClick={() => this.props.setDataAttr('bgColor', color)}
                    style={{ backgroundColor: color }}
                  />
                );
              })
            }
          </ul>
        }
      </div>
    );
  }

  render() {
    let textInputClasses = [styles.lTextInput]
      , result
      ;

    if (this.state.suggestionsOpen) {
      textInputClasses.push(styles.isDisableExempt);
    }

    if (this.props.fieldTab === 'custom') {
      textInputClasses.push(styles.lTextInputCustom);

      result = (
        <div className={styles.lField}>
          <input 
            type="text" 
            className={styles.labelText} 
            value={this.props.value.label || ''}
            onChange={(e) => this.props.setDataAttr('label', e.target.value)}
            placeholder={I18n.t('react.card_maker.enter_text')}
          />
          {this.buildCustomInput(textInputClasses)}
        </div>
      );
    } else {
      result = (
        <LabeledTextDropdown
          {...this.props}
        />
      );
    }

    return result;
  }
}

export default fieldWrapper(LabeledTextField);
