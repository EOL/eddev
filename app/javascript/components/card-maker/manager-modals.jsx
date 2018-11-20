import React from 'react'
import DeckDescModal from './deck-desc-modal'

function ManagerModals(props) {
  return (
    <DeckDescModal
      desc={props.selectedDeck ? props.selectedDeck.desc : null}
      isOpen={props.openModal === 'deckDesc'}
      onRequestClose={props.closeModal}
      onRequestSave={props.onRequestSaveDeckDesc}
    />
  );
}

export default ManagerModals;

