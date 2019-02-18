import React from 'react'
import LoadingSpinnerImage from './loading-spinner-image'
import LightboxOverlay from 'components/shared/lightbox-overlay'
import {cardMakerUrl, hiResCardImageUrl} from 'lib/card-maker/url-helper'
import styles from 'stylesheets/card_maker/card_manager'

class CardZoomLightbox extends React.Component {
  constructor(props) {
    super(props);

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
  }

  handleCardLoad = () => {
    this.setState({
      cardLoaded: true
    });
  }

  handlePngClick = (cardId) => {
    window.open(cardMakerUrl(`cards/${cardId}.png`));
  }

  componentDidMount() {
    this.bindKeyHandlers();
  }

  componentWillUnmount() {
    this.removeKeyHandlers();
  }

  handleKeypress = (e) => {
    if (e.key === 'ArrowRight' && this.props.hasNext) {
      this.props.requestNext();
    } else if (e.key === 'ArrowLeft' && this.props.hasPrev) {
      this.props.requestPrev();
    }
  }

  removeKeyHandlers = () => {
    document.removeEventListener('keydown', this.handleKeypress);
  }

  bindKeyHandlers = () => {
    document.addEventListener('keydown', this.handleKeypress); 
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
    var arrowBaseClasses = ['fa', 'fa-4x', styles.arrow];

    if (!this.state.cardLoaded) {
      arrowBaseClasses.push(styles.isArrowDisabled)  
    }

    return this.props.card ? 
      (
        <LightboxOverlay
          contentLabel={I18n.t('react.card_maker.card_preview_lightbox')}
          onRequestClose={this.props.handleRequestClose}
        >
          <div className={styles.cardLightbox}>
            {
              this.props.hasPrev &&
              <i 
                className={`${arrowBaseClasses.join(' ')} fa-angle-left ${styles.arrowLeft}`} 
                onClick={() => this.handleArrowClick('prev')}
              />
            }
              <div className={styles.cardLightboxCard}>
                <LoadingSpinnerImage 
                  src={hiResCardImageUrl(this.props.card)} 
                  onLoad={this.handleCardLoad}
                  loaded={this.state.cardLoaded}
                  load={true}
                />
              </div>
              <button onClick={() => this.handlePngClick(this.props.card.id)}>{I18n.t('react.card_maker.download_png')}</button>
            {
              this.props.hasNext &&
              <i 
                className={`${arrowBaseClasses.join(' ')} fa-angle-right ${styles.arrowRight}`}
                onClick={() => this.handleArrowClick('next')}
              />
            }
          </div>
        </LightboxOverlay>
      ) :
      null
    ;
  }
}

export default CardZoomLightbox;

