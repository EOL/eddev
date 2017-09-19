import React from 'react'

import CardManager from './card-manager'

import eolLogoHdr from 'images/card_maker/icons/eol_logo_hdr.png'

class CardMaker extends React.Component {
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
        <CardManager />
      </div>
    )
  }
}

export default CardMaker
