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

  render() {
    return (
      <div>
        <div className='txt tip'>{this.state.tipText}</div>
        <div className='btns ctrl img-btns'>
          <img
            src={rotateIcon}
            className='btn top'
            onMouseEnter={this.handleButtonMouseEnter.bind(null, 'Rotate 90°')}
            onMouseLeave={this.handleButtonMouseLeave}
          />
          <img
            src={flipHorizIcon}
            className='btn mid'
            onMouseEnter={this.handleButtonMouseEnter.bind(null, 'Flip horizontal')}
            onMouseLeave={this.handleButtonMouseLeave}
          />
          <img
            src={flipVertIcon}
            className='btn bot'
            onMouseEnter={this.handleButtonMouseEnter.bind(null, 'Flip vertical')}
            onMouseLeave={this.handleButtonMouseLeave}
          />
        </div>
      </div>
    )
  }
}

export default ImageControlButtons
