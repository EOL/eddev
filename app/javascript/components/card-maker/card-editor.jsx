import React from 'react'

import ladybugIcon from 'images/card_maker/icons/ladybug.png'
import rotateIcon from 'images/card_maker/icons/rotate.png'
import flipHorizIcon from 'images/card_maker/icons/flip_horiz.png'
import flipVertIcon from 'images/card_maker/icons/flip_vert.png'

class CardEditor extends React.Component {
  render() {
    return (
      <div id='CardGeneratorWrap' className='card-generator-wrap'>
        <div className='hdr-spacer green'></div>
        <div id='CardGenerator' className='card-generator card-screen'>
          <div className='screen-inner'>
            <div className='welcome-block generator-welcome-block'>
              <div className='manager-btn' onClick={this.props.handleCloseClick}>
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
                <div className='preview'>
                  <div className='img-select'></div>
                  <div className='controls-card-wrap'>
                    <div className='img-controls'>
                      <div className='txt tip'></div>
                      <div className='btns ctrl img-btns'>
                        <img src={rotateIcon} className='btn top' />
                        <img src={flipHorizIcon} className='btn mid' />
                        <img src={flipVertIcon} className='btn bot' />
                      </div>
                      <div className='sep'></div>
                      <div className='zoom-controls'>
                        <div className='zoom-txt txt'></div>
                        <div className='zoom ctrl'>
                          <div className='dir plus noselect'>+</div>
                          <div className='stem'>
                            <div className='lft'></div>
                            <div className='rt'></div>
                            <div className='knob'></div>
                          </div>
                          <div className='dir minus noselect'>&ndash;</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='card-box'>
                    <canvas id='CardCanvas' className='card-canvas' />
                    <a href='#' target='_blank' className='eol-link'>
                      <span>Open</span>
                      <i className='icon-eol-logo' />
                      <span>taxon page</span>
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
              <div className='right-col'>
                <div className='col-head-box'>
                  <div className='col-head-txt'>Card Form</div>
                  <div className='col-head-sub-txt'>
                    (enter information that will appear on the card)
                  </div>
                </div>
                <div className='card-fields-wrap'>
                  <div className='card-fields'>

                  </div>
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
