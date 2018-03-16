import React from 'react'
import ReactModal from 'react-modal'

import deckLightboxWrapper from './deck-lightbox-wrapper'

import styles from 'stylesheets/card_maker/card_manager'

class NewDeckLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colId: ''
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.isOpen && !newProps.isOpen) {
      this.setState({
        colId: ''
      });
    }

    if (!this.props.shouldSubmit && newProps.shouldSubmit) {
      this.props.handleCreate(this.props.name, this.state.colId);
      this.props.handleSubmitted();
    }
  }

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.colId}
          onInput={(e) => this.setState({ colId: e.target.value})}
          placeholder={I18n.t('react.card_maker.enter_collection_id')}
          className={[styles.newInput, styles.newInputTxt, styles.newInputColId].join(' ')}
        />
      </div>
    );
  }
}

export default deckLightboxWrapper(NewDeckLightbox, { 
  contentLabel: I18n.t('react.card_maker.new_deck'),
  submitLabel: I18n.t('react.card_maker.create_deck'),
});
