import React from 'react'

import newImmutableCardInstance from 'lib/card-maker/immutable-card'
import CardFields from './card-fields'
import CardPreview from './card-preview'
import { cardMakerUrl } from 'lib/card-maker/url-helper'

import ladybugIcon from 'images/card_maker/icons/ladybug.png'
import eolHdrIcon from 'images/card_maker/icons/eol_logo_sub_hdr.png'


class CardEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      card: null,
      selectedImgId: this.firstImgIdFromCard(),
      rightColDisabled: false,
      previewStyle: {},
    }
  }

  setRightColNode = (node) => {
    this.rightColNode = node;
  }

  disableRightCol = () => {
    this.setState((prevState, props) => {
      return {
        rightColDisabled: true,
      }
    });
  }

  enableRightCol = () => {
    this.setState((prevState, props) => {
      return {
        rightColDisabled: false,
      }
    });
  }

  getCardData = (fieldName, attr, defaultVal) => {
    var data;

    if (this.props.card) {
      data = this.props.card.getDataAttr(fieldName, attr, defaultVal);
    } else {
      data = null;
    }

    return data;
  }

  setCardData = (fieldName, attr, value) => {
    this.props.updateCard((card) => {
      return card.setDataAttr(fieldName, attr, value)
    });
  }

  setCardChoiceKey = (fieldName, key) => {
    this.props.updateCard((card) => {
      return card.setChoiceKey(fieldName, key)
    });
  }

  setCardUserDataAttr = (fieldName, bucket, key, value) => {
    this.props.updateCard((card) => {
      return card.setUserDataAttr(fieldName, bucket, key, value);
    });
  }

  setCardUserDataRef = (fieldName, key) => {
    this.props.updateCard((card) => {
      return card.setUserDataRef(fieldName, key);
    });
  }

  setCardDataNotDirty = (fieldName, attr, value) => {
    this.props.updateCard((card) => {
      return card.setDataAttrNotDirty(fieldName, attr, value);
    });
  }

  setCardKeyValData = (fieldName, keyOrVal, index, attr, value) => {
    this.props.updateCard((card) => {
      return card.setKeyValData(fieldName, keyOrVal, index, attr, value);
    });
  }

  setCardKeyValChoiceKey = (fieldName, keyValIndex, choiceKey) => {
    this.props.updateCard((card) => {
      return card.setKeyValChoiceKey(fieldName, keyValIndex, choiceKey);
    });
  }

  setCardTextListData = (fieldName, i, text) => {
    this.props.updateCard((card) => {
      return card.setTextListData(fieldName, i, text);
    });
  }

  forceDirty = () => {
    this.props.updateCard((card) => {
      return card.forceDirty();
    });
  }

  firstImgIdFromCard = () => {
    var imgId = null;
    const imageFields = this.props.card.imageFields();

    if (imageFields.length) {
      imgId = imageFields[0].id
    }

    return imgId;
  }

  setSelectedImgId = (imageId) => {
    this.setState((prevState, props) => {
      return {
        selectedImgId: imageId,
      }
    });
  }

  handleClose = () => {
    this.props.handleRequestClose();
  }

  saveWithCb = (cb) => {
    if (this.props.card) {
      this.props.showLoadingOverlay(null, null, (closeFn) => {
        this.props.card.save((err, newCard) => {
          cb(err, newCard, closeFn)
        });
      });
    }
  }

  handleSave = () => {
    this.saveWithCb((err, newCard, closeFn) => {
      if (err) {
        closeFn();
        throw err;
      }

      this.props.updateCard(() => {
        return newCard
      }, closeFn);
    });
  }

  handleSaveAndExit = () => {
    const that = this;

    that.saveWithCb((err, newCard, closeFn) => {
      if (err) {
        closeFn();
        throw err;
      }

      this.props.updateCard(() => {
        return newCard
      }, () => {
        closeFn();
        that.props.handleRequestClose();        
      })
    });
  }

  setPreviewNode = (node) => {
    this.previewNode = node;
    this.setPreviewStyle();
  }

  setLeftColNode = (node) => {
    this.leftColNode = node;
    this.setPreviewStyle();
  }

  setPreviewStyle = () => {
    if (!(this.previewNode && this.leftColNode)) {
      return;
    }

    let scrollTop = $(document).scrollTop()
      , $preview = $(this.previewNode)
      , $col = $(this.leftColNode)
      , $header = $('.js-navbar') // This is a no-no, but the nav bar isn't part of this React app, so...
      , headHeight = $header.outerHeight()
      , colOffsetTop = $col.offset().top
      , colViewOffset = colOffsetTop - scrollTop - headHeight
      , colHeight = $col.outerHeight()
      , previewHeight = $preview.outerHeight()
      , top
      , position
      ;

    if (colViewOffset < 0) {
      if (colHeight - previewHeight < -colViewOffset) {
        position = 'absolute';
        top = colHeight - previewHeight;
      } else {
        position = 'fixed';
        top = headHeight;
      }
    } else {
      position = 'absolute';
      top = 0;
    }

    this.setState((prevState, props) => {
      return {
        previewStyle: {
          position: position,
          top: top,
        }
      }
    });
  }

  componentDidMount() {
    document.addEventListener('scroll', this.setPreviewStyle);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.setPreviewStyle);
  }

  render() {
    return (
      <div id='CardGeneratorWrap' className='card-generator-wrap'>
        <div id='CardGenerator' className='card-generator card-screen'>
          <div className='screen-inner'>
            <div className='cols'>
              <div className='col left-col' ref={this.setLeftColNode}>
                <CardPreview
                  card={this.props.card}
                  setCardData={(this.props.card ? this.setCardData : null)}
                  getCardData={(this.props.card ? this.getCardData : null)}
                  selectedImgId={this.state.selectedImgId}
                  setSelectedImgId={this.setSelectedImgId}
                  handleClose={this.handleClose}
                  handleSave={this.handleSave}
                  handleSaveAndExit={this.handleSaveAndExit}
                  setRootNode={this.setPreviewNode}
                  rootStyle={this.state.previewStyle}
                />
              </div>
              <div
                className='col right-col'
                ref={this.setRightColNode}
              >
                {
                  this.state.rightColDisabled &&
                  <div className='disable-overlay'></div>
                }
                <div className='card-fields-wrap'>
                  {this.props.card &&
                    <CardFields
                      card={this.props.card}
                      setCardData={this.setCardData}
                      setCardDataNotDirty={this.setCardDataNotDirty}
                      setCardChoiceKey={this.setCardChoiceKey}
                      setCardUserDataAttr={this.setCardUserDataAttr}
                      setCardUserDataRef={this.setCardUserDataRef}
                      setCardKeyValData={this.setCardKeyValData}
                      setCardKeyValChoiceKey={this.setCardKeyValChoiceKey}
                      setCardTextListData={this.setCardTextListData}
                      forceCardDirty={this.forceDirty}
                      disableCol={this.disableRightCol}
                      enableCol={this.enableRightCol}
                      userRole={this.props.userRole}
                      requestReloadCard={this.props.requestReloadCard}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CardEditor
