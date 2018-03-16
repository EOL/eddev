import React from 'react'
import ReactModal from 'react-modal'

import deckLightboxWrapper from './deck-lightbox-wrapper'

import styles from 'stylesheets/card_maker/card_manager'

class DeckNameLightbox extends React.Component {
  componentWillReceiveProps(newProps) {
    if (!this.props.shouldSubmit && newProps.shouldSubmit) {
      this.props.handleRename(this.props.name.trim());
      this.props.handleSubmitted();
    }
  }

  render() {
    return null;
  }
}


export default deckLightboxWrapper(DeckNameLightbox, {
  contentLabel: I18n.t('react.card_maker.rename_deck'),
  submitLabel: I18n.t('react.card_maker.rename_deck')
});
