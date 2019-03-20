import React from 'react'

import ImageControlButtons from './image-control-buttons'
import ImageZoomControls from './image-zoom-controls'
import PreviewCanvas from './preview-canvas'
import SaveExitBtns from './save-exit-btns'

import styles from 'stylesheets/card_maker/card_editor'

class CardPreview extends React.Component {
  imageSelectItems = () => {
    if (!this.props.card) {
      return [];
    }

    const imgFields = this.props.card.imageFields()
        , items = []
        ;

    for (const field of imgFields) {
      let val = this.props.card.resolvedDataForField(field)
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
          <div className='img-title'>{field.uiLabel}</div>
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
    const eolLinkAttrs = this.props.card && this.props.card.templateName() === 'trait' ?
            this.eolLinkAttrs() : 
            null
        , hasImg = this.props.card.imageFields().length > 0
        , cardBoxClasses = [styles.cardBox]
        ;

    if (!hasImg) {
      cardBoxClasses.push(styles.cardBoxNoImg);
    }

    return (
      <div className='preview' ref={this.props.setRootNode} style={this.props.rootStyle}>
        { /* <div className='img-select'>{this.imageSelectItems()}</div> */ }
        <div className='controls-card-wrap'>
          {
            hasImg && (
              <div className='img-controls'>
                <ImageControlButtons
                  {...this.imageDataFns()}
                />
                <div className='sep'></div>
                <ImageZoomControls
                  {...this.imageDataFns()}
                />
              </div>
            )
          }
          <div className={cardBoxClasses.join(' ')}>
            <PreviewCanvas
              card={this.props.card}
              selectedImgId={this.props.selectedImgId}
              {...this.imageDataFns()}
            />
            {
              eolLinkAttrs != null &&
              <a
                href={eolLinkAttrs.href} target={eolLinkAttrs.target}
                className={styles.cardEolLink}
                dangerouslySetInnerHTML={{
                  __html: I18n.t('react.card_maker.open_eol_taxon_page_html', {
                    iconClass: 'edu-icon-eol-logo'
                  })
                }}
              />
            }
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
