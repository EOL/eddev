import React from 'react'

import CardFields from './card-fields'
import CardPreview from './card-preview'

import ladybugIcon from 'images/card_maker/icons/ladybug.png'

class CardEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      card: null,
      selectedImgId: null,
      rightColDisabled: false,
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

  setCardDataNotDirty = (fieldName, attr, value) => {
    this.setState((prevState, props) => {
      return {
        card: prevState.card.setDataAttrNotDirty(fieldName, attr, value),
      }
    });
  }

  forceDirty = () => {
    this.setState((prevState, props) => {
      return {
        card: prevState.card.forceDirty(),
      }
    });
  }

  componentDidMount() {
    const cardUrl = '/card_maker_ajax/cards/' + this.props.cardId + '/json'
        , that = this
        ;

    CardWrapper.setTemplateSupplier({
      supply: function(templateName, cb) {
        $.getJSON('/card_maker_ajax/templates/trait', function(data) {
          cb(null, data);
        })
          .fail(function() {
            cb(new Error('Failed to retrieve template'));
          });
      }
    });

    $.ajax(cardUrl, {
      method: 'GET',
      success: (card) => {
        CardWrapper.newInstance(card, (err, wrapped) => {
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
              <div className='col left-col'>
                <div className='col-head-box'>
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
