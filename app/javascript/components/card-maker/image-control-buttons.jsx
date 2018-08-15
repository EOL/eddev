import React from 'react'

import rotateIcon from 'images/card_maker/icons/rotate.png'
import flipHorizIcon from 'images/card_maker/icons/flip_horiz.png'
import flipVertIcon from 'images/card_maker/icons/flip_vert.png'

class ImageControlButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tipText: ''
    }
  }

  handleButtonMouseEnter = (tipText) => {
    this.setState((prevState, props) => {
      return {
        tipText: tipText
      }
    });
  }

  handleButtonMouseLeave = () => {
    this.setState((prevState, props) => {
      return {
        tipText: ''
      }
    });
  }

  handleRotateClick = () => {
    if (this.initialized()) {
      this.props.setImageData('rotate',
        this.props.getImageData('rotate', 360) - 90 % 360
      );
    }
  }

  handleFlipClick = (attr) => {
    if (this.initialized()) {
      this.props.setImageData(attr,
        !this.props.getImageData(attr, false)
      );
    }
  }

  initialized = () => {
    return this.props.setImageData !== null &&
      this.props.getImageData !== null;
  }

  render() {
    return (
      <div>
        <div className='txt tip'>{this.state.tipText}</div>
        <div className='btns ctrl img-btns'>
          <img
            src={rotateIcon}
            className='btn top'
            onMouseEnter={this.handleButtonMouseEnter.bind(null, I18n.t('react.card_maker.rotate_90'))}
            onMouseLeave={this.handleButtonMouseLeave}
            onClick={this.handleRotateClick}
          />
          <img
            src={flipHorizIcon}
            className='btn mid'
            onMouseEnter={this.handleButtonMouseEnter.bind(null, I18n.t('react.card_maker.flip_horiz'))}
            onMouseLeave={this.handleButtonMouseLeave}
            onClick={this.handleFlipClick.bind(null, 'flipHoriz')}
          />
          <img
            src={flipVertIcon}
            className='btn bot'
            onMouseEnter={this.handleButtonMouseEnter.bind(null, I18n.t('react.card_maker.flip_vert'))}
            onMouseLeave={this.handleButtonMouseLeave}
            onClick={this.handleFlipClick.bind(null, 'flipVert')}
          />
        </div>
      </div>
    )
  }
}

export default ImageControlButtons
