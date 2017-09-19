import React from 'react'

import CardManager from './card-manager'
import CardEditor from './card-editor'

import eolLogoHdr from 'images/card_maker/icons/eol_logo_hdr.png'

class CardMaker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'manager'
    }
  }

  handleEditCard = (cardId) => {
    this.setState((prevState, props) => {
      return {
        screen: 'editor',
        editCardId: cardId,
      }
    });
  }

  handleManagerClose = () => {
    this.setState((prevState, props) => {
      return {
        screen: 'manager'
      }
    });
  }

  screenComponent = () => {
    var component;

    if (this.state.screen === 'manager') {
      component = (
        <CardManager
          handleEditCard={this.handleEditCard}
        />
      )
    } else if (this.state.screen === 'editor') {
      component = (
        <CardEditor
          cardId={this.state.editCardId}
          handleCloseClick={this.handleManagerClose}
        />
      )
    }

    return component;
  }

  render() {
    return (
      <div className='card-maker'>
        <div className='card-hdr-box'>
          <div className='card-hdr-inner'>
            <div className='left-blur-bg'></div>
            <h2 className='create-card-hdr hdr'>
              <img src={eolLogoHdr} className='hdr-logo' />
              <span> Card Maker</span>
            </h2>
            <div className='right-blur-bg'></div>
          </div>
        </div>
        {this.screenComponent()}
      </div>
    )
  }
}

export default CardMaker
