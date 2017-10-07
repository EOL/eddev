import React from 'react'

import Card from './card'
import Deck from './deck'
import EmptyResourcesPlaceholder from './empty-resources-placeholder'

const resourceTypes = {
       card: Card
     }
   , resourcesPerRow = 4
   ;

class UserResources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceMarginRight: {}
    };
  }

  // Set margin of resources dynamically to account for scrollbar weirdness
  // once all node refs are in
  updateResourceMarginRight = () => {
    if (
      this.rootNode &&
      this.resourceNode &&
      this.resourceRefCount === this.resourceCount
    ) {
      const scrollbarWidth = this.rootNode.offsetWidth - this.rootNode.clientWidth
          , innerWidth = $(this.rootNode).width()
          , resourceWidth = $(this.resourceNode).outerWidth()
          , marginRight = (innerWidth - scrollbarWidth - resourceWidth * resourcesPerRow) /
              (resourcesPerRow - 1)
          ;

      this.setState({
        resourceMarginRight: marginRight,
      });
    }
  }

  resourceRef = (node) => {
    this.resourceRefCount++;
    this.resourceNode = node;
    this.updateResourceMarginRight();
  }

  setRootNode = (node) => {
    this.rootNode = node;
    this.updateResourceMarginRight();
  }

  buildEmptyResourcesPlaceholder = () => {
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

    return [(
      <EmptyResourcesPlaceholder
        createMsg={createMsg}
        emptyMsg={emptyMsg}
        handleCreate={handleCreate}
        key='0'
      />
    )];
  }

  buildResources = () => {
    let resources;

    if (this.props.resources.length) {
      let resourceMapFn;

      if (this.props.resourceType === 'card') {
        resourceMapFn = (resource, style) => {
          return (
            <Card
              data={resource}
              decks={this.props.decks}
              key={resource.id}
              handleDeckSelect={this.props.handleCardDeckSelect.bind(null, resource.id)}
              handleEditClick={() => this.props.handleEditCard(resource.id)}
              handleDestroyClick={() => this.props.handleDestroyCard(resource.id)}
              setRef={this.resourceRef}
              style={style}
            />
          )
        }
      } else if (this.props.resourceType === 'deck') {
        resourceMapFn = (resource, style) => {
          return (
            <Deck
              name={resource.name}
              titleCardId={resource.titleCardId}
              key={resource.id}
              handleDestroyClick={() => this.props.handleDestroyDeck(resource.id)}
              handleOpenClick={() => this.props.handleDeckSelect(resource.id)}
              setRef={this.resourceRef}
              style={style}
            />
          )
        }
      }

      resources = this.props.resources.map((resource, i) => {
        const style = {};

        // Apply resourceMarginRight to all except the last item in each row
        if ((i + 1) % resourcesPerRow !== 0) {
          style.marginRight = this.state.resourceMarginRight;
        }

        return resourceMapFn(resource, style);
      });
    } else {
      resources = this.buildEmptyResourcesPlaceholder();
    }

    return resources;
  }

  render() {
    this.resourceCount = this.props.resources.length;
    this.resourceRefCount = 0;
    return (
      <div
        className='user-resources'
        ref={this.setRootNode}
      >
        {this.buildResources()}
      </div>
    );
  }
}

export default UserResources
