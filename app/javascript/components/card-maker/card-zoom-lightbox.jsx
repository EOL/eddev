import React from 'react'
import LoadingSpinnerImage from './loading-spinner-image'
import {cardMakerUrl, hiResCardImageUrl} from 'lib/card-maker/url-helper'
import styles from 'stylesheets/card_maker/card_manager'
import Lightbox from 'components/shared/lightbox'

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

  handleRequestCardLoaded = () => {
    this.setState({
      cardLoaded: true
    });
  }

  handlePngClick = (cardId) => {
    window.open(cardMakerUrl(`cards/${cardId}.png`));
  }

  render() {
    return this.props.card ? 
      (
        <Lightbox {...this.props} disableArrows={!this.state.cardLoaded}>
          <div className={styles.cardZoom}>
            <LoadingSpinnerImage 
              src={hiResCardImageUrl(this.props.card)} 
              requestLoaded={this.handleRequestCardLoaded}
              loaded={this.state.cardLoaded}
            />
          </div>
          <button onClick={() => this.handlePngClick(this.props.card.id)}>{I18n.t('react.card_maker.download_png')}</button>
        </Lightbox>
      ) :
      null
    ;
  }
}

export default CardZoomLightbox;

