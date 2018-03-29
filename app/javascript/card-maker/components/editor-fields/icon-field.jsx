import React from 'react'
import fieldWrapper from './field-wrapper'
import styles from 'stylesheets/card_maker/card_editor'

class IconField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      choiceIndex: 0,
    }
  }

  componentDidMount() {
    let choiceIndex = null
      , labelMatch = false
      , choices = this.choices()
      ;

    // determine tab
    for (let i = 0; i < choices.length && choiceIndex === null; i++) {
      let choice = choices[i];

      if (this.props.value.url == choice.url) {
        choiceIndex = i;

        if (this.props.value.label == choice.label) {
          labelMatch = true;
        }
      }
    }

    if (!labelMatch) {
      this.props.requestFieldTab('custom'); 
    }

    if (choiceIndex !== null) {
      this.setState({ choiceIndex: choiceIndex });
    }
  }

  componentWillReceiveProps(newProps) {
    let sameChoices = this.props.choices.length === newProps.choices.length
      , choiceIndex = this.state.choiceIndex
      ;

    if (sameChoices) {
      for (let i = 0; i < this.props.choices.length && sameChoices; i++) {
        let curChoice = this.props.choices[i]
          , newChoice = newProps.choices[i]
          ;
        
        sameChoices = curChoice.url === newChoice.url && curChoice.label === newChoice.label;
      }
    }

    if (!sameChoices) {
      choiceIndex = 0;
      this.setState({
        choiceIndex: choiceIndex
      });
    }

    if (this.props.fieldTab === 'custom' && newProps.fieldTab === 'default') {
      let choice = this.choices()[choiceIndex];
      this.props.setChoiceKey(this.choices()[choiceIndex].choiceKey)
    }
  }

  closeMenu = () => {
    document.removeEventListener('click', this.closeMenu);
    this.props.enableCol();
    this.setState({
      open: false
    });
  }

  handleMenuClick = () => {
    if (!this.state.open) {
      this.props.disableCol();
      document.addEventListener('click', this.closeMenu);

      this.setState({
        open: true
      });
    }
  }

  handleLabelChange = (e) => {
    this.props.setDataAttr('label', e.target.value);
  }

  label = () => {
    let result
      ;

    if (this.props.fieldTab === 'custom') {
      result = (
        <input 
          type='text' 
          className={[styles.iconText].join(' ')} 
          value={this.props.value.label || ''}
          onChange={this.handleLabelChange}
          placeholder={I18n.t('react.card_maker.enter_text')}
        />
      );
    } else {
      let text = this.props.value.label ? 
        this.props.value.label :
        I18n.t('react.card_maker.select_an_icon');

      result = <div className={[styles.iconText, styles.iconTextStatic].join(' ')}>{text}</div>
    }

    return result;
  }

  setIcon = (index, item) => {
    this.setState({ choiceIndex: index });

    if (this.props.fieldTab === 'custom') {
      this.props.setDataAttr('url', item.url); 
    } else {
      this.props.setChoiceKey(item.choiceKey);
    }
  }

  choices = () => {
    return [{
      url: null,
      label: null,
    }].concat(this.props.choices);
  }

  iconSelect = () => {
    return (
      <ul className={[styles.iconChoices].join(' ')}>
        {this.choices().map((choice, index) => {
          return (
            <li
              className={[
                styles.iconChoice,
                (this.state.choiceIndex === index ? styles.isIconChoiceSelected : null),
              ].join(' ')}
              onClick={() => this.setIcon(index, choice)}
              key={index}
            >
              {
                this.props.fieldTab !== 'custom' && choice.label &&
                <div>{choice.label}</div>
              }
              {
                choice.url != null &&
                <img src={choice.url} />
              }
            </li>
          )
        })}
      </ul>
    );
  }

  render() {
    return (
      <div 
        className={[
          styles.lIconField,
          (this.state.open ? styles.isDisableExempt : '')
        ].join(' ')}
      >
        {this.label()}
        <div className={styles.iconSelect}>
          <div className={styles.iconSelection}
            onClick={this.handleMenuClick}>
            {
              this.props.value.url != null &&
              <img src={this.props.value.url} />
            }

            <i className='cm-icon-sug-arrow-down' /> 
          </div>
          {
            this.state.open && this.iconSelect()
          }
        </div>
      </div>
    );
  }
}

export default fieldWrapper(IconField, { customTab: true });
