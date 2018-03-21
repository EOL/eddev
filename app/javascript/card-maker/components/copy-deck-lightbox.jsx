import React from 'react'
import ReactModal from 'react-modal'

import DeckNameLightbox from './deck-name-lightbox'

function CopyDeckLightbox(props) {
  return (
    <DeckNameLightbox
      isOpen={props.isOpen}
      contentLabel={I18n.t('react.card_maker.copy_deck')}
      submitLabel={I18n.t('react.card_maker.copy_deck')}
      handleSubmit={props.handleCopy}
      handleRequestClose={props.handleRequestClose}
      deckNames={props.deckNames}
      name={props.name}
    />
  );
}

export default CopyDeckLightbox;
