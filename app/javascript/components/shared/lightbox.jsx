import React from 'react'
import CloseButtonModal from './close-button-modal'
import styles from 'stylesheets/shared/lightbox'

class Lightbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cardLoaded: false,
    }
  }

  componentDidMount() {
    this.bindKeyHandlers();
  }

  componentWillUnmount() {
    this.removeKeyHandlers();
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


  handleArrowClick = (dir) => {
    if (!this.props.disableArrows) {
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

    if (this.props.disableArrows) {
      arrowBaseClasses.push(styles.isArrowDisabled)  
    }

    return (
      <CloseButtonModal
        isOpen={true}
        contentLabel={I18n.t('react.card_maker.card_preview_lightbox')}
        parentSelector={() => {return document.getElementById('Page')}}
        overlayClassName={styles.overlay}
        className={[styles.lightbox, styles.lightboxNoGlow].join(' ')}
        bodyOpenClassName='noscroll'
        onRequestClose={this.props.handleRequestClose}
        shouldCloseOnOverlayClick={false}
        fullScreenOverlay={true}
      >
        <div className={styles.imageZoom}>
          {
            this.props.hasPrev &&
            <i 
              className={`${arrowBaseClasses.join(' ')} fa-angle-left ${styles.arrowLeft}`} 
              onClick={() => this.handleArrowClick('prev')}
            />
          }
          {this.props.children}
          {
            this.props.hasNext &&
            <i 
              className={`${arrowBaseClasses.join(' ')} fa-angle-right ${styles.arrowRight}`}
              onClick={() => this.handleArrowClick('next')}
            />
          }
        </div>
      </CloseButtonModal>
    );
  }
}

export default Lightbox;

