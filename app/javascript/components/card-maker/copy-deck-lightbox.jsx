import React from 'react'
import DeckNameLightbox from './deck-name-lightbox'

function CopyDeckLightbox(props) {
  return (
    <DeckNameLightbox
      isOpen={props.isOpen}
      contentLabel={props.submitLabel}
      submitLabel={props.submitLabel}
      handleSubmit={props.handleCopy}
      handleRequestClose={props.handleRequestClose}
      deckNames={props.deckNames}
      name={props.name}
      message={props.message}
    />
  );
}

export default CopyDeckLightbox;
