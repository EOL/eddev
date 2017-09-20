import React from 'react'

import ImageControlButtons from './image-control-buttons'
import ImageZoomControls from './image-zoom-controls'
import PreviewCanvas from './preview-canvas'

const selectedImgId = 'mainPhoto';

class CardPreview extends React.Component {
  getImageData = (attr, defaultVal) => {
    return this.props.getCardData(selectedImgId, attr, defaultVal);
  }

  setImageData = (attr, val) => {
    this.props.setCardData(selectedImgId, attr, val);
  }

  getImageLocation = () => {
    return this.props.card ?
      this.props.card.getImageLocation(selectedImgId)
      : null;
  }

  draw = () => {
    if (this.renderer && this.props.card) {
      this.renderer.draw(this.props.card, function(err) {
        if (err) console.log(err);
      });
    }
  }

  render() {
    this.draw();

    return (
      <div className='preview'>
        <div className='img-select'></div>
        <div className='controls-card-wrap'>
          <div className='img-controls'>
            <ImageControlButtons
              setImageData={this.setImageData}
              getImageData={this.getImageData}
            />
            <div className='sep'></div>
            <ImageZoomControls
              setImageData={this.setImageData}
              getImageData={this.getImageData}
            />
          </div>
          <div className='card-box'>
            <PreviewCanvas
              card={this.props.card}
              imageLocation={this.getImageLocation()}
              setImageData={this.setImageData}
              getImageData={this.getImageData}
            />
            <a href='#' target='_blank' className='eol-link'>
              <span>Open </span>
              <i className='icon-eol-logo' />
              <span> taxon page</span>
            </a>
          </div>
          <div className='preview-btns'>
            <div className='btn close'>
              <div className='btn-txt'>Close</div>
            </div>
            <div className='btn save-exit'>
              <div className='btn-txt'>Save + Exit</div>
            </div>
            <div className='btn save'>
              <div className='btn-txt'>Quick Save</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CardPreview;
