import React from 'react'
import Card from './card'

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
    }

    return this.props.resources.map(resourceMapFn);
  }

  render() {
    return <div className='user-resources'>{this.buildResources()}</div>;
  }
}

export default UserResources
