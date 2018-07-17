import React from 'react' // Actually necessary to fix transpiled code :(
import CloseButtonModal from './close-button-modal'
import LoadingSpinnerImage from './loading-spinner-image'
import {cardMakerUrl, hiResCardImageUrl} from 'lib/card-maker/url-helper'
import styles from 'stylesheets/card_maker/card_manager'

function handlePngClick(cardId) {
  window.open(cardMakerUrl(`cards/${cardId}.png`));
}

function CardZoomLightbox(props) {
  return (
    <CloseButtonModal
      isOpen={props.card != null}
      contentLabel={I18n.t('react.card_maker.card_preview_lightbox')}
      parentSelector={() => {return document.getElementById('Page')}}
      overlayClassName={[styles.lOverlay, styles.lOverlayManager].join(' ')}
      className={[styles.lightbox, styles.lightboxNoGlow].join(' ')}
      bodyOpenClassName='noscroll'
      onRequestClose={props.handleRequestClose}
      shouldCloseOnOverlayClick={false}
      fullScreenOverlay={true}
    >
      <div className={styles.cardZoom}>
        <i 
          className={`fa fa-angle-left fa-4x ${styles.zoomArrow} ${styles.zoomArrowLeft}`} 
          onClick={props.requestPrev}
        />
        {props.card != null &&
          <div className={styles.imageZoom}>
            <LoadingSpinnerImage src={hiResCardImageUrl(props.card)} />
          </div>
        }
        <button onClick={() => handlePngClick(props.card.id)}>{I18n.t('react.card_maker.download_png')}</button>
        <i 
          className={`fa fa-angle-right fa-4x ${styles.zoomArrow} ${styles.zoomArrowRight}`}
          onClick={props.requestNext}
        />
      </div>

    </CloseButtonModal>
  );
}

export default CardZoomLightbox;

