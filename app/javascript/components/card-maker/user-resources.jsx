import React from 'react'

import Card from './card'
import Deck from './deck'
import EmptyResourcesPlaceholder from './empty-resources-placeholder'

const resourceTypes = {
  card: Card
}

class UserResources extends React.Component {
  buildResources() {
    let resources;

    if (this.props.resources.length) {
      let resourceMapFn;

      if (this.props.resourceType === 'card') {
        resourceMapFn = (resource) => {
          return (
            <Card
              data={resource}
              decks={this.props.decks}
              key={resource.id}
              handleDeckSelect={this.props.handleCardDeckSelect.bind(null, resource.id)}
              handleEditClick={() => this.props.handleEditCard(resource.id)}
            />
          )
        }
      } else if (this.props.resourceType === 'deck') {
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

      resources = this.props.resources.map(resourceMapFn);
    } else {
      let emptyMsg
        , createMsg
        , handleCreate
        ;

      if (this.props.resourceType === 'card') {
        emptyMsg = "You don't have any cards yet.";
        createMsg = 'Create a card';
        handleCreate = this.props.handleNewCard;
      } else if (this.props.resourceType === 'deck') {
        emptyMsg = "You don't have any decks yet";
        createMsg = 'Create a deck';
        handleCreate = this.props.handleNewDeck;
      }

      resources = [(
        <EmptyResourcesPlaceholder
          createMsg={createMsg}
          emptyMsg={emptyMsg}
          handleCreate={handleCreate}
        />
      )]
    }

    return resources;
  }

  render() {
    return <div className='user-resources'>{this.buildResources()}</div>;
  }
}

export default UserResources
