import React from 'react'

import LoadingSpinnerImage from './loading-spinner-image'
import resourceWrapper from './resource-wrapper'

class Deck extends React.Component {
  imgPart() {
    if (this.props.titleCardId) {
      return (
        <LoadingSpinnerImage
          src={'/card_maker_ajax/cards/' + this.props.titleCardId + '/svg'}
        />
      )
    } else {
      return <i className='fa fa-image fa-4x title-card-placeholder' />;
    }
  }


  render() {
    return (
      <div>
        <div className='deck-name'>
          <i className='icon-deck' />
          <span> {this.props.name}</span>
        </div>
        <div className='resource-frame user-resource-frame'>
          {this.imgPart()}
        </div>
      </div>
    )
  }
}

export default resourceWrapper(Deck, ['deck-resource'])
