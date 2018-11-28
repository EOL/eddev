import React from 'react'
import DeckDescModal from './deck-desc-modal'
import NewDeckLightbox from './new-deck-lightbox'
import SpeciesSearchLightbox from './species-search-lightbox'

function ManagerModals(props) {
  return (
    <div>
      <DeckDescModal
        desc={props.selectedDeck ? props.selectedDeck.desc : null}
        isOpen={props.openModal === 'deckDesc'}
        onRequestClose={props.closeModal}
        onRequestSave={props.onRequestSaveDeckDesc}
      />
      <NewDeckLightbox
        isOpen={props.openModal === 'newDeck'}
        handleCreate={props.onRequestCreateDeck}
        handleRequestClose={props.closeModal}
        deckNames={props.userDeckNames}
      />
      <SpeciesSearchLightbox
        isOpen={props.openModal === 'newCard'}
        handleClose={props.closeModal}
        handleCreate={props.onRequestCreateCard}
        selectedDeckId={props.selectedDeck ? props.selectedDeck.id : null}
      />
    </div>
  );
}

export default ManagerModals;

