import React from 'react'

import ImageControlButtons from './image-control-buttons'
import ImageZoomControls from './image-zoom-controls'
import PreviewCanvas from './preview-canvas'
import SaveExitBtns from './save-exit-btns'

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

  eolLinkAttrs = () => {
    var attrs;

    if (this.props.card) {
      attrs = {
        href: 'http://eol.org/pages/' +
          this.props.card.getTemplateParam('speciesId') + '/overview',
        target: '_blank',
      }
    } else {
      attrs = {
        href:'#',
        target: '',
      }
    }

    return attrs;
  }

  render() {
    console.log(I18n.t('react.card_maker.open_eol_taxon_page_html', {
      iconClass: 'edu-icon-eol-logo'
    }))

    var eolLinkAttrs = this.eolLinkAttrs();

    return (
      <div className='preview' ref={this.props.setRootNode} style={this.props.rootStyle}>
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
            <a
              href={eolLinkAttrs.href} target={eolLinkAttrs.target}
              className='eol-link'
              dangerouslySetInnerHTML={{
                __html: I18n.t('react.card_maker.open_eol_taxon_page_html', {
                  iconClass: 'edu-icon-eol-logo'
                })
              }}
            />
          </div>
          <SaveExitBtns
            dirty={this.props.card && this.props.card.isDirty()}
            handleClose={this.props.handleClose}
            handleSave={this.props.handleSave}
            handleSaveAndExit={this.props.handleSaveAndExit}
          />
        </div>
      </div>
    )
  }
}

export default CardPreview;
