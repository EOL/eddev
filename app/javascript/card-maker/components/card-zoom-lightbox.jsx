import React from 'react' // Actually necessary to fix transpiled code :(
import ReactModal from 'react-modal'

import {cardImageUrl} from 'lib/card-maker/url-helper'

function CardZoomLightbox(props) {
  return (
    <ReactModal
      isOpen={props.cardId != null}
      contentLabel={I18n.t('react.card_maker.card_preview_lightbox')}
      parentSelector={() => {return document.getElementById('Page')}}
      overlayClassName='fixed-center-wrap disable-overlay'
      className='card-zoom-lightbox lightbox'
      bodyOpenClassName='noscroll'
      onRequestClose={props.handleRequestClose}
    >
      <img className='image' src={cardImageUrl(props.cardId)} />
    </ReactModal>
  );
}

export default CardZoomLightbox;
