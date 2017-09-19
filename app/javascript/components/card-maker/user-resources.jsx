import React from 'react'

import Card from './card'
import Deck from './deck'

const resourceTypes = {
  card: Card
}

class UserResources extends React.Component {
  buildResources() {
    var resourceMapFn;

    if (this.props.resourceType === 'card') {
      resourceMapFn = (resource) => {
        return (
          <Card
            data={resource}
            decks={this.props.decks}
            key={resource.id}
            handleDeckSelect={this.props.handleCardDeckSelect.bind(null, resource.id)}
          />
        )
      }
    } else if (this.props.resourceType === 'deck') { // deck
      resourceMapFn = (resource) => {
        return (
          <Deck
            name={resource.name}
            titleCardId={resource.titleCardId}
            key={resource.id}
          />
        )
      }
    }

    return this.props.resources.map(resourceMapFn);
  }

  render() {
    return <div className='user-resources'>{this.buildResources()}</div>;
  }
}

export default UserResources
