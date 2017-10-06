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
              handleDestroyClick={() => this.props.handleDestroyCard(resource.id)}
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
              handleDestroyClick={() => this.props.handleDestroyDeck(resource.id)}
              handleOpenClick={() => this.props.handleDeckSelect(resource.id)}
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
        emptyMsg = I18n.t('react.card_maker.no_cards_yet');
        createMsg = I18n.t('react.card_maker.create_a_card');
        handleCreate = this.props.handleNewCard;
      } else if (this.props.resourceType === 'deck') {
        emptyMsg = I18n.t('react.card_maker.no_decks_yet')
        createMsg = I18n.t('react.card_maker.create_a_deck');
        handleCreate = this.props.handleNewDeck;
      }

      resources = [(
        <EmptyResourcesPlaceholder
          createMsg={createMsg}
          emptyMsg={emptyMsg}
          handleCreate={handleCreate}
          key='0'
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
