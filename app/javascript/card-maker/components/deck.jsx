import React from 'react'

import LoadingSpinnerImage from './loading-spinner-image'
import resourceWrapper from './resource-wrapper'
import {cardMakerUrl} from 'lib/card-maker/url-helper'

class Deck extends React.Component {
  imgPart() {
    if (this.props.titleCardId) {
      return (
        <LoadingSpinnerImage
          src={cardMakerUrl('cards/' + this.props.titleCardId + '/svg')}
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
          {this.props.showOverlay &&
            <div className='deck-overlay resource-overlay'>
              <i
                className='fa fa-folder-open-o fa-3x edit-btn btn'
                onClick={this.props.handleOpenClick}
              />
              <i
                className='fa fa-print fa-3x btn'
                onClick={this.props.handlePdfClick}
              />
              <i
                className='fa fa-trash-o fa-3x trash-btn btn'
                onClick={this.props.handleDestroyClick}
              />
            </div>
          }
        </div>
      </div>
    )
  }
}

export default resourceWrapper(Deck, ['deck-resource'])
