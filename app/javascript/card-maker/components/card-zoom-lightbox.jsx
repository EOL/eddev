import React from 'react' // Actually necessary to fix transpiled code :(
import CloseButtonModal from './close-button-modal'
import LoadingSpinnerImage from './loading-spinner-image'
import {cardMakerUrl, hiResCardImageUrl} from 'lib/card-maker/url-helper'
import styles from 'stylesheets/card_maker/card_manager'

class CardZoomLightbox extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.card !== null) {
      this.bindKeyHandlers();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.card !== null && nextProps.card === null) {
      this.removeKeyHandlers();
    } else if (this.props.card === null && nextProps.card !== null) {
      this.bindKeyHandlers();
    }
  }

  handleKeypress = (e) => {
    if (e.key === 'ArrowRight') {
      this.props.requestNext();
    } else if (e.key === 'ArrowLeft') {
      this.props.requestPrev();
    }
  }

  removeKeyHandlers = () => {
    document.removeEventListener('keydown', this.handleKeypress);
  }

  bindKeyHandlers = () => {
    document.addEventListener('keydown', this.handleKeypress); 
  }

  handlePngClick = (cardId) => {
    window.open(cardMakerUrl(`cards/${cardId}.png`));
  }


  render() {
    return (
      <CloseButtonModal
        isOpen={this.props.card !== null}
        contentLabel={I18n.t('react.card_maker.card_preview_lightbox')}
        parentSelector={() => {return document.getElementById('Page')}}
        overlayClassName={[styles.lOverlay, styles.lOverlayManager].join(' ')}
        className={[styles.lightbox, styles.lightboxNoGlow].join(' ')}
        bodyOpenClassName='noscroll'
        onRequestClose={this.props.handleRequestClose}
        shouldCloseOnOverlayClick={false}
        fullScreenOverlay={true}
      >
        <div className={styles.cardZoom}>
          <i 
            className={`fa fa-angle-left fa-4x ${styles.zoomArrow} ${styles.zoomArrowLeft}`} 
            onClick={this.props.requestPrev}
          />
          {this.props.card != null &&
            <div className={styles.imageZoom}>
              <LoadingSpinnerImage src={hiResCardImageUrl(this.props.card)} />
            </div>
          }
          <button onClick={() => this.handlePngClick(this.props.card.id)}>{I18n.t('react.card_maker.download_png')}</button>
          <i 
            className={`fa fa-angle-right fa-4x ${styles.zoomArrow} ${styles.zoomArrowRight}`}
            onClick={this.props.requestNext}
          />
        </div>

      </CloseButtonModal>
    );
  }
}

export default CardZoomLightbox;

