import React from 'react'
import DeckNameLightbox from './deck-name-lightbox'

import styles from 'stylesheets/card_maker/card_manager'

function RenameDeckLightbox(props) {
  return (
    <DeckNameLightbox
      contentLabel={I18n.t('react.card_maker.rename_deck')}
      submitLabel={I18n.t('react.card_maker.rename_deck')}
      handleSubmit={props.handleRename}
      {...props}
    />
  );
}

export default RenameDeckLightbox;
