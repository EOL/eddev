import React from 'react'

import ImageControlButtons from './image-control-buttons'
import ImageZoomControls from './image-zoom-controls'
import PreviewCanvas from './preview-canvas'

class CardPreview extends React.Component {
  imageSelectItems = () => {
    if (!this.props.card) {
      return [];
    }

    const imgFields = this.props.card.imageFields()
        , items = []
        ;

    for (const field of imgFields) {
      let val = this.props.card.resolvedFieldData(field)
        , url = val.thumbUrl
        , thumbClass = 'thumb'
        ;

      if (this.props.selectedImgId === field.id) {
        thumbClass += ' selected';
      }

      items.push((
        <div key={field.id}
          className='img-wrap'
          onClick={() => this.props.setSelectedImgId(field.id)}
        >
          <div className='img-title'>{field.label}</div>
          <img className={thumbClass} src={url} />
        </div>
      ))
    }

    return items;
  }

  setImageData = (attr, val) => {
    this.props.setCardData(this.props.selectedImgId, attr, val);
  }

  getImageData = (attr, defaultVal) => {
    return this.props.getCardData(this.props.selectedImgId, attr, defaultVal);
  }

  imageDataFns = () => {
    const fns = {};

    if (this.props.selectedImgId) {
      if (this.props.setCardData) {
        fns.setImageData = this.setImageData;
      }

      if (this.props.getCardData) {
        fns.getImageData = this.getImageData;
      }
    }

    return fns;
  }

  render() {
    return (
      <div className='preview'>
        <div className='img-select'>{this.imageSelectItems()}</div>
        <div className='controls-card-wrap'>
          <div className='img-controls'>
            <ImageControlButtons
              {...this.imageDataFns()}
            />
            <div className='sep'></div>
            <ImageZoomControls
              {...this.imageDataFns()}
            />
          </div>
          <div className='card-box'>
            <PreviewCanvas
              card={this.props.card}
              selectedImgId={this.props.selectedImgId}
              {...this.imageDataFns()}
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
