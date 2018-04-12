import React from 'react';

import SuggestionsMenu from './suggestions-menu'
import fieldWrapper from './field-wrapper'
import styles from 'stylesheets/card_maker/card_editor'

class TextField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontSizeOpen: false,
      suggestBtnNode: null,
      suggestionsOpen: false,
    }
  }

  setFontSizeNode = (node) => {
    this.fontSizeNode = node;
  }

  setFontSizeSelectNode = (node) => {
    this.fontSizeSelectNode = node;
  }

  handleChange = (event) => {
    this.props.setDataAttr('text', event.target.value);
  }

  setFontSize = (sz) => {
    this.props.setDataAttrNotDirty('fontSz', sz);
    this.committed = false;
  }

  closeFontSize = () => {
    document.removeEventListener('click', this.closeFontSize)
    this.props.enableCol();

    if (!this.committed) {
      this.setFontSize(this.realFontSz);
    }

    this.setState((prevState, props) => {
      return {
        fontSizeOpen: false,
      }
    });
  }

  handleFontSizeClick = () => {
    const open = !this.state.fontSizeOpen;

    if (open) {
      this.realFontSz = this.props.value.fontSz;

      this.props.disableCol();
      document.addEventListener('click', this.closeFontSize);

      this.setState((prevState, props) => {
        return {
          fontSizeOpen: open,
        }
      });
    }
  }

  handleFontSizeSelectMouseOut = () => {
    this.setFontSize(this.realFontSz);
  }

  commitFontSize = () => {
    this.realFontSz = this.props.value.fontSz;
    this.committed = true;
    this.props.forceCardDirty();
  }

  fontSizePart = () => {
    let elmt = '';

    if (this.props.field.fontSizes) {
      let fontSizeElmts = this.props.field.fontSizes.map((sz) => {
            let className = 'font-size-option';

            if (sz === this.props.value.fontSz) {
              className += ' selected';
            }

            return (
              <div
                key={sz}
                className={className}
                onMouseEnter={() => this.setFontSize(sz)}
                onClick={() => {this.commitFontSize()}}
              >
                {sz}
              </div>
            )
          })
      , selectClass = 'font-size-select'
      , fontSizeClass = 'font-size'
      ;

      if (this.state.fontSizeOpen) {
        selectClass += ' disable-exempt';
        fontSizeClass += ' active disable-exempt';
      } else {
        selectClass += ' hidden';
      }

      elmt = (
        <div className='font-size-box'>
          <div className='font-size-label'>{I18n.t('react.card_maker.font_size')}</div>
          <div
            className={fontSizeClass}
            onClick={this.handleFontSizeClick}
            ref={this.setFontSizeNode}
          >
            {this.props.value.fontSz}
          </div>
          <div
            className={selectClass}
            ref={this.setFontSizeSelectNode}
            onMouseOut={this.handleFontSizeSelectMouseOut}
          >
            {fontSizeElmts}
          </div>
        </div>
      )
    }

    return elmt;
  }

  setSuggestBtnNode = (node) => {
    this.setState((prevState, props) => {
      return {
        suggestBtnNode: node,
      }
    })
  }

  closeSuggestions = () => {
    this.props.enableCol();
    document.removeEventListener('click', this.closeSuggestions);

    this.setState((prevState, props) => {
      return {
        suggestionsOpen: false,
      }
    });
  }

  handleSuggestBtnClick = () => {
    if (!this.state.suggestionsOpen) {
      this.props.disableCol();
      document.addEventListener('click', this.closeSuggestions);

      this.setState((prevState, props) => {
        return {
          suggestionsOpen: true,
        }
      })
    }
  }

  handleSuggestionSelect = (item) => {
    this.props.setChoiceKey(item.key);
  }

  buildInput = (extraClass) => {
    const elmts = [];

    elmts.push((
      <input
        key='input'
        onChange={this.handleChange}
        className={`${styles.textInput} ${styles.textInputTextField} ${styles.textEntry}`}
        type='text'
        value={this.props.value.text || ''}
      />
    ));

    if (this.props.choices) {
      elmts.push((
        <div
          className='text-input-btn'
          ref={this.setSuggestBtnNode}
          onClick={this.handleSuggestBtnClick}
          key='suggestBtn'
        >
          <i className='cm-icon-sug-arrow-down suggestion-icon'></i>
        </div>
      ))

      if (this.state.suggestionsOpen) {
        elmts.push((
          <SuggestionsMenu
            key='suggestMenu'
            items={
              this.props.choices.map((choice) => {
                return {
                  value: choice.text,
                  key: choice.choiceKey,
                };
              })
            }
            anchor={this.state.suggestBtnNode}
            handleSelect={this.handleSuggestionSelect}
          />
        ))
      }
    }

    return elmts;
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
          <div className={textInputClasses.join(' ')}>
            {this.buildInput(styles.lTextInputCustom)}
          </div>
          {this.fontSizePart()}
        </div>
      );
    } else {
      result = (
        <div className={styles.lTextField}>
          <div className={textInputClasses.join(' ')}>
            {this.buildInput()}
          </div>
          {this.fontSizePart()}
        </div>
      );
    }

    return result;
  }
}

export default fieldWrapper(TextField);
