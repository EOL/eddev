import React from 'react'

import newImmutableCardInstance from 'lib/card-maker/immutable-card'
import CardFields from './card-fields'
import CardPreview from './card-preview'
import { cardMakerUrl } from 'lib/card-maker/url-helper'

import ladybugIcon from 'images/card_maker/icons/ladybug.png'

class CardEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      card: null,
      selectedImgId: null,
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

    if (this.state.card) {
      data = this.state.card.getDataAttr(fieldName, attr, defaultVal);
    } else {
      data = null;
    }

    return data;
  }

  setCardData = (fieldName, attr, value) => {
    this.setState((prevState, props) => {
      return {
        card: prevState.card.setDataAttr(fieldName, attr, value),
      }
    });
  }

  setCardChoiceIndex = (fieldName, index) => {
    this.setState((prevState, props) => {
      return {
        card: prevState.card.setChoiceIndex(fieldName, index)
      }
    });
  }

  setCardUserDataAttr = (fieldName, bucket, key, value) => {
    this.setState((prevState, props) => {
      return {
        card: prevState.card.setUserDataAttr(fieldName, bucket, key, value),
      }
    })
  }

  setCardUserDataRef = (fieldName, key) => {
    this.setState((prevState, props) => {
      return {
        card: prevState.card.setUserDataRef(fieldName, key),
      }
    })
  }

  setCardDataNotDirty = (fieldName, attr, value) => {
    this.setState((prevState, props) => {
      return {
        card: prevState.card.setDataAttrNotDirty(fieldName, attr, value),
      }
    });
  }

  setCardKeyValText = (fieldName, keyOrVal, index, value) => {
    this.setState((prevState, props) => {
      return {
        card: prevState.card.setKeyValText(fieldName, keyOrVal, index, value),
      }
    })
  }

  forceDirty = () => {
    this.setState((prevState, props) => {
      return {
        card: prevState.card.forceDirty(),
      }
    });
  }

  firstImgIdFromCard = (card) => {
    var imgId = null;
    const imageFields = card.imageFields();

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

  handleCloseHelper = (force) => {
    var proceed = true;

    if (!force && this.state.card && this.state.card.isDirty()) {
      proceed = confirm(
        'Are you sure you want to leave this page? All unsaved work will be lost.'
      );
    }

    if (proceed) {
      this.props.handleCloseClick();
    }
  }

  handleClose = () => {
    this.handleCloseHelper(false);
  }

  saveWithCb = (cb) => {
    if (this.state.card) {
      this.state.card.save(cb)
    }
  }

  handleSave = () => {
    this.saveWithCb((err, newCard) => {
      if (err) {
        throw err;
      }

      this.setState((prevState, props) => {
        return {
          card: newCard
        }
      });
    });
  }

  handleSaveAndExit = () => {
    this.saveWithCb((err, newCard) => {
      if (err) {
        throw err;
      }

      this.handleCloseHelper(true);
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

  setLeftColHeadBoxNode = (node) => {
    this.leftColHeadBoxNode = node;
    this.setPreviewStyle();
  }

  setPreviewStyle = () => {
    if (!(this.previewNode && this.leftColNode && this.leftColHeadBoxNode)) {
      return;
    }

    let scrollTop = $(document).scrollTop()
      , $preview = $(this.previewNode)
      , $col = $(this.leftColNode)
      , $colHead = $(this.leftColHeadBoxNode)
      , colOffsetTop = $col.offset().top
      , colViewOffset = colOffsetTop - scrollTop
      , colHeadHeight = $colHead.outerHeight()
      , colHeight = $col.outerHeight()
      , innerColViewOffset = colViewOffset + colHeadHeight
      , previewHeight = $preview.outerHeight()
      , top
      , position
      ;

    if (innerColViewOffset < 0) {
      if (colHeight - previewHeight < -colViewOffset) {
        position = 'absolute';
        top = colHeight - previewHeight;
      } else {
        position = 'fixed';
        top = 0;
      }
    } else {
      position = 'absolute';
      top = colHeadHeight;
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
    const cardUrl = cardMakerUrl('cards/' + this.props.cardId + '/json')
        , that = this
        ;

    $.ajax(cardUrl, {
      method: 'GET',
      success: (card) => {
        newImmutableCardInstance(card, (err, wrapped) => {
          var imgId = that.firstImgIdFromCard(wrapped);

          that.setState((prevState, props) => {
            return {
              card: wrapped,
              selectedImgId: imgId,
            }
          });
        });
      }
    })

    document.addEventListener('scroll', this.setPreviewStyle);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.setPreviewStyle);
  }

  render() {
    return (
      <div id='CardGeneratorWrap' className='card-generator-wrap'>
        <div className='hdr-spacer green'></div>
        <div id='CardGenerator' className='card-generator card-screen'>
          <div className='screen-inner'>
            <div className='welcome-block generator-welcome-block'>
              <div className='manager-btn' onClick={this.handleClose}>
                <div className='manager-btn-bg'></div>
                <div className='manager-btn-back-txt'> go back to</div>
                <div className='manager-btn-txt-wrap'>
                  <i className='icon-deck' />
                  <div className='manager-btn-txt'>Card Manager</div>
                </div>
              </div>
              <h3 className='welcome-txt'>
                <span className='big-letter'>W</span>
                <span>elcome to the EOL Card Editor.</span>
              </h3>
              <img src={ladybugIcon} className='ladybug' />
            </div>
            <div className='cols'>
              <div className='col left-col' ref={this.setLeftColNode}>
                <div className='col-head-box' ref={this.setLeftColHeadBoxNode}>
                  <div className='col-head-txt'>Card Preview</div>
                  <div className='col-head-sub-txt'>
                    (Live Preview, Image Controls, Save + Exit Options)
                  </div>
                </div>

                <CardPreview
                  card={this.state.card}
                  setCardData={(this.state.card ? this.setCardData : null)}
                  getCardData={(this.state.card ? this.getCardData : null)}
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
                <div className='col-head-box'>
                  <div className='col-head-txt'>Card Form</div>
                  <div className='col-head-sub-txt'>
                    (enter information that will appear on the card)
                  </div>
                </div>
                <div className='card-fields-wrap'>
                  {this.state.card &&
                    <CardFields
                      card={this.state.card}
                      setCardData={this.setCardData}
                      setCardDataNotDirty={this.setCardDataNotDirty}
                      setCardChoiceIndex={this.setCardChoiceIndex}
                      setCardUserDataAttr={this.setCardUserDataAttr}
                      setCardUserDataRef={this.setCardUserDataRef}
                      setCardKeyValText={this.setCardKeyValText}
                      forceCardDirty={this.forceDirty}
                      disableCol={this.disableRightCol}
                      enableCol={this.enableRightCol}
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
