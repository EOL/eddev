import React from 'react'
import DeckDescModal from './deck-desc-modal'
import NewDeckLightbox from './new-deck-lightbox'
//import SpeciesSearchLightbox from './species-search-lightbox'
import SimpleNewCardLightbox from './simple-new-card-lightbox'
import RenameDeckLightbox from './rename-deck-lightbox'
import PrintLightbox from './print-lightbox'
import CopyDeckLightbox from './copy-deck-lightbox'
import DeckUrlLightbox from './deck-url-lightbox'
import DeckUsersLightbox from './deck-users-lightbox'
import CardZoomLightbox from './card-zoom-lightbox'
import {deckUrl} from 'lib/card-maker/url-helper'

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
      {/*
      <SpeciesSearchLightbox
        isOpen={props.openModal === 'newCard'}
        handleClose={props.closeModal}
        handleCreate={props.onRequestCreateCard}
        onRequestPublicCardsForTaxon={props.onRequestPublicCardsForTaxon}
        selectedDeckId={props.selectedDeck ? props.selectedDeck.id : null}
      />
      */}
      <SimpleNewCardLightbox
        isOpen={props.openModal === 'newCard'}
        onRequestClose={props.closeModal}
      />
      <RenameDeckLightbox
        isOpen={props.openModal === 'renameDeck'}
        handleRequestClose={props.closeModal}
        handleRename={props.onRequestRenameDeck}
        name={props.selectedDeck ? props.selectedDeck.name : ''}
        deckNames={deckNamesMinusCur}
      />
      <CopyDeckLightbox
        isOpen={props.openModal === 'copyDeck'}
        handleRequestClose={props.closeModal}
        handleCopy={props.onRequestCopyDeck}
        deckNames={props.userDeckNames}
        upgradedInName={false}
        message={null}
        submitLabel={I18n.t('react.card_maker.copy_deck')}
        deck={props.selectedDeck}
      />
      <CopyDeckLightbox
        isOpen={props.openModal === 'upgradeDeck'}
        handleRequestClose={props.closeModal}
        handleCopy={props.onRequestUpgradeDeck}
        deckNames={props.userDeckNames}
        upgradedInName={true}
        message={I18n.t('react.card_maker.update_deck_msg')}
        submitLabel={I18n.t('react.card_maker.update_deck')}
        deck={props.selectedDeck}
      />
      <PrintLightbox
        isOpen={props.openModal === 'print'}
        onRequestClose={props.closeModal}
        handleSubmit={props.onRequestMakePdf}
      />
      <DeckUrlLightbox
        isOpen={props.openModal === 'deckUrl'}
        handleRequestClose={props.closeModal}
        deckUrl={props.selectedDeck ? deckUrl(props.selectedDeck) : ''}
      />
      <DeckUsersLightbox
        isOpen={props.openModal === 'deckUsers'}
        handleRequestClose={props.closeModal}
        deck={props.selectedDeck}
      />
      <CardZoomLightbox
        isOpen={props.openModal === 'cardZoom'}
        card={props.zoomCard}
        requestNext={props.onRequestNextZoomCard}
        requestPrev={props.onRequestPrevZoomCard}
        handleRequestClose={props.closeModal}
        hasNext={props.hasNextZoomCard}
        hasPrev={props.hasPrevZoomCard}
      />
    </div>
  );
}

export default ManagerModals;

