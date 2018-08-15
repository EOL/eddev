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

    this.state = {
      cardLoaded: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.card !== nextProps.card) {
      this.setState({
        cardLoaded: false
      });
    }

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

  handleRequestCardLoaded = () => {
    this.setState({
      cardLoaded: true
    });
  }

  handleArrowClick = (dir) => {
    if (this.state.cardLoaded) {
      if (dir === 'next') {
        this.props.requestNext();
      } else if (dir === 'prev') {
        this.props.requestPrev();
      } else {
        throw new TypeError('invalid dir parameter');
      }
    }
  }

  render() {
    var arrowBaseClasses = ['fa', 'fa-4x', styles.zoomArrow];

    if (!this.state.cardLoaded) {
      arrowBaseClasses.push(styles.isZoomArrowDisabled)  
    }

    return (
      <CloseButtonModal
        isOpen={this.props.card !== null}
        contentLabel={I18n.t('react.card_maker.card_preview_lightbox')}
        parentSelector={() => {return document.getElementById('Page')}}
        overlayClassName={styles.lOverlay}
        className={[styles.lightbox, styles.lightboxNoGlow].join(' ')}
        bodyOpenClassName='noscroll'
        onRequestClose={this.props.handleRequestClose}
        shouldCloseOnOverlayClick={false}
        fullScreenOverlay={true}
      >
        <div className={styles.cardZoom}>
          {
            this.props.hasPrev &&
            <i 
              className={`${arrowBaseClasses.join(' ')} fa-angle-left ${styles.zoomArrowLeft}`} 
              onClick={() => this.handleArrowClick('prev')}
            />
          }
          {
            this.props.card != null &&
            <div className={styles.imageZoom}>
              <LoadingSpinnerImage 
                src={hiResCardImageUrl(this.props.card)} 
                requestLoaded={this.handleRequestCardLoaded}
                loaded={this.state.cardLoaded}
              />
            </div>
          }
          <button onClick={() => this.handlePngClick(this.props.card.id)}>{I18n.t('react.card_maker.download_png')}</button>
          {
            this.props.hasNext &&
            <i 
              className={`${arrowBaseClasses.join(' ')} fa-angle-right ${styles.zoomArrowRight}`}
              onClick={() => this.handleArrowClick('next')}
            />
          }
        </div>

      </CloseButtonModal>
    );
  }
}

export default CardZoomLightbox;

