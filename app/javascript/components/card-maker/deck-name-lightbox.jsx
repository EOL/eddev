import React from 'react'
import SimpleLightbox from './simple-lightbox'

import styles from 'stylesheets/card_maker/card_manager'

class DeckNameLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name || '',
      nameErr: null
    }
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.isOpen && newProps.isOpen) {
      this.setState({
        nameErr: null,
        name: newProps.name || '',
      });
    }
  }
  
  handleNameChange = (e) => {
    var name = e.target.value
      , err = null
      ;

    if (this.props.deckNames.has(name)) {
      err = I18n.t('react.card_maker.name_taken');
    }

    this.setState({
      name: e.target.value,
      nameErr: err
    });
  }

  handleSubmit = () => {
    var name = this.state.name.trim()
      , success = false
      ;

    if (this.props.hideDeckNameInput || (name.length && !this.state.nameErr)) {
      this.props.handleSubmit(name);
      this.props.handleRequestClose();
      success = true;
    } else if (!name.length) {
      this.setState({
        nameErr: I18n.t('react.card_maker.name_cant_be_blank')
      });
    }

    return success;
  }

  fields = () => {
    let fields = [];
    
    if (!this.props.hideDeckNameInput) {
      fields.push({
        type: 'text',
        value: this.state.name,
        errMsg: this.state.nameErr,
        onChange: this.handleNameChange,
        placeholder: I18n.t('react.card_maker.enter_deck_name')
      });
    }

    if (this.props.fields) {
      fields = fields.concat(this.props.fields);
    }

    return fields;
  }

  render() {
    return (
      <SimpleLightbox
        isOpen={this.props.isOpen}
        contentLabel={this.props.contentLabel}
        onRequestClose={this.props.handleRequestClose}
        fields={this.fields()}
        onSubmit={this.handleSubmit}
        submitLabel={this.props.submitLabel}
        message={this.props.message}
      />
    );
  }
}

export default DeckNameLightbox;
