import React from 'react'

import ColorMenu from './color-menu'
import SuggestionsMenu from './suggestions-menu'
import fieldWrapper from './field-wrapper'

import styles from 'stylesheets/card_maker/card_editor'

class KeyValListField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusIndex: null,
      focusTarget: null,
      colorMenuIndex: null
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeColorMenu);
  }

  handleInputChange = (index, keyOrVal, event) => {
    this.props.setKeyValData(keyOrVal, index, 'text', event.target.value);
  }

  handleInputBlur = () => {
    if (this.state.focusTarget) {
      this.props.enableCol();
      this.setState(() => {
        return {
          focusIndex: null,
          focusTarget: null,
        }
      })
    }
  }

  handleInputFocus = (index, event) => {
    if (this.props.choices && this.props.choices.length) {
      const target = event.target;
      
      this.props.disableCol();
      this.setState(() => {
        return {
          focusIndex: index,
          focusTarget: target,
        }
      });
    }
  }

  handleSuggestionsSelect = (i, item) => {
    this.props.setKeyValChoiceKey(i, item.key);
    this.state.focusTarget.blur();
  }

  openColorMenu = (index) => {
    this.props.disableCol();
    this.setState({
      colorMenuIndex: index
    });
    document.addEventListener('click', this.closeColorMenu);
  }

  closeColorMenu = () => {
    this.props.enableCol();
    document.removeEventListener('click', this.closeColorMenu);
    this.setState({
      colorMenuIndex: null
    });
  }

  buildItems = (keyChoices, keyColorChoices, valChoices, valColorChoices) => {
    const items = new Array(this.props.field.max);

    for (let i = 0; i < items.length; i++) {
      let curKey = ''
        , curVal = ''
        , keyClasses = [styles.textInput, styles.textEntry, styles.keyValField]
        , valClasses = [styles.textInput, styles.textEntry, styles.keyValField]
        , colorAnchorClasses = [styles.keyValColorAnchor]
        , keyBgColor
        , keyTextColor
        ;

      if (i === this.state.focusIndex) {
        keyClasses.push(styles.isDisableExempt)
      }

      if (keyColorChoices.length) {
        keyClasses.push(styles.keyValFieldWColor)
      }

      if (i === this.state.colorMenuIndex) {
        colorAnchorClasses.push(styles.isDisableExempt);
      }

      if (i < this.props.value.length) {
        curKey = this.props.value[i].key.text || ''
        curVal = this.props.value[i].val.text || '';

        if (keyColorChoices.length) {
          keyBgColor = this.props.value[i].key.bgColor;
          keyTextColor = this.props.field.key.color;
        }
      }

      items[i] = (
        <li className={styles.keyValRow} key={i}>
          <span className={[styles.lKeyVal, styles.lFl].join(' ')}>
            <input
              type='text'
              className={keyClasses.join(' ')}
              value={curKey}
              onChange={(event) => this.handleInputChange(i, 'key', event)}
              onFocus={(event) => this.handleInputFocus(i, event)}
              onBlur={() => this.handleInputBlur(i)}
            />
            {
              keyColorChoices.length > 0 && (
                <div 
                  className={colorAnchorClasses.join(' ')}
                  style={{
                    backgroundColor: keyBgColor,
                  }} 
                  onClick={() => this.openColorMenu(i)}
                >
                  <i 
                    className='fa fa-caret-down fa-lg' 
                    style={{
                      color: keyTextColor
                    }}
                  />
                </div>
              )
            }
            {
              this.state.colorMenuIndex === i && 
              <ColorMenu 
                colors={keyColorChoices} 
                handleSelect={(color) => this.props.setKeyValData('key', i, 'bgColor', color)} 
                extraClassName={styles.colorChoicesKeyVal}
              />
            }
          </span>
          {i === this.state.focusIndex && keyChoices.length > 0 &&
            <SuggestionsMenu
              anchor={this.state.focusTarget}
              items={keyChoices}
              handleSelect={(item) => this.handleSuggestionsSelect(i, item)}
            />
          }
          <span className={[styles.lKeyVal, styles.lFr].join(' ')}>
            <input
              type='text'
              className={valClasses.join(' ')}
              value={curVal}
              onChange={(event) => this.handleInputChange(i, 'val', event)}
            />
          </span>
        </li>
      )
    }

    return items;
  }

  render() {
    var keyChoices = []
      , valChoices = []
      , keyColors = []
      , valColors =[]
      ;

    if (this.props.choices) {
      this.props.choices.forEach((choice) => {
        if (choice.key) {
          if (choice.key.text) {
            keyChoices.push({ value: choice.key.text, key: choice.choiceKey });
          }

          if (choice.key.bgColor) {
            keyColors.push(choice.key.bgColor);
          }
        }

        if (choice.val) {
          if (choice.val.text) {
            valChoices.push(choice.val.text); 
          }

          if (choice.val.bgColor) {
            valColors.push(choice.val.bgColor);
          }
        }
      });
    }

    keyColors = keyColors.map((color) => {
      return color.toLowerCase();
    });
    keyColors = [...new Set(keyColors)];
    keyColors = keyColors.sort((a, b) => {
      if (a < b) {
        return -1;
      } 

      if (a > b) {
        return 1;
      }

      return 0;
    });

    return (
      <ul className={styles.keyValFields}>
        {this.buildItems(keyChoices, keyColors, valChoices, valColors)}
      </ul>
    )
  }
}

export default fieldWrapper(KeyValListField)
