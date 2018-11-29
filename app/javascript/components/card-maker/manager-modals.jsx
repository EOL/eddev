import React from 'react'
import DeckDescModal from './deck-desc-modal'
import NewDeckLightbox from './new-deck-lightbox'
import SpeciesSearchLightbox from './species-search-lightbox'
import RenameDeckLightbox from './rename-deck-lightbox'
import PrintLightbox from './print-lightbox'

function ManagerModals(props) {
  const deckNamesMinusCur = new Set([...props.userDeckNames]);

  if (props.selectedDeck) {
    deckNamesMinusCur.delete(props.selectedDeck.name);
  }

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
      <RenameDeckLightbox
        isOpen={props.openModal === 'renameDeck'}
        handleRequestClose={props.closeModal}
        handleRename={props.onRequestRenameDeck}
        name={props.selectedDeck ? props.selectedDeck.name : ''}
        deckNames={deckNamesMinusCur}
      />
        <PrintLightbox
          isOpen={props.openModal === 'print'}
          onRequestClose={props.closeModal}
          handleSubmit={props.onRequestMakePdf}
        />
    </div>
  );
}

export default ManagerModals;

