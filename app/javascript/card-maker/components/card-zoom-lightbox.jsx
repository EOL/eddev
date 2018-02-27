import React from 'react' // Actually necessary to fix transpiled code :(
import ReactModal from 'react-modal'

import {cardMakerUrl} from 'lib/card-maker/url-helper'

import styles from 'stylesheets/card_maker/card_manager'

import {hiResCardImageUrl} from 'lib/card-maker/url-helper'

function handlePngClick(cardId) {
  window.open(cardMakerUrl(`cards/${cardId}.png`));
}

function CardZoomLightbox(props) {
  return (
    <ReactModal
      isOpen={props.card != null}
      contentLabel={I18n.t('react.card_maker.card_preview_lightbox')}
      parentSelector={() => {return document.getElementById('Page')}}
      overlayClassName='fixed-center-wrap disable-overlay'
      className={[styles.lightbox, styles.lLightboxZoom].join(' ')}
      bodyOpenClassName='noscroll'
      onRequestClose={props.handleRequestClose}
    >
      <img className='image' src={props.card ? hiResCardImageUrl(props.card) : ''} />
      <button onClick={() => handlePngClick(props.card.id)}>{I18n.t('react.card_maker.download_png')}</button>
    </ReactModal>
  );
}

export default CardZoomLightbox;
