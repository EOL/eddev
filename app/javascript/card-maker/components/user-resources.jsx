import React from 'react'

import Card from './card'
import Deck from './deck'
import EmptyResourcesPlaceholder from './empty-resources-placeholder'
import AdjustsForScrollbarContainer from './adjusts-for-scrollbar-container'
import CardZoomLightbox from './card-zoom-lightbox'

import styles from 'stylesheets/card_maker/card_manager'

const resourcesPerRow = 4
   ;

class UserResources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
        resourceMapFn = (resource) => {
          return (
            <Card
              data={resource}
              key={resource.id}
              handleDeckSelect={this.props.handleCardDeckSelect.bind(null, resource.id)}
              handleEditClick={() => this.props.handleEditCard(resource.id)}
              handleDestroyClick={() => this.props.handleDestroyCard(resource.id)}
              handleZoomClick={() => this.handleCardZoomClick(resource.id)}
              editable={this.props.editable}
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
              handlePdfClick={() => this.props.handleDeckPdf(resource.id)}
            />
          )
        }
      }

      resources = this.props.resources.map(resourceMapFn);
    } else if (this.props.editable) {
      resources = this.buildEmptyResourcesPlaceholder();
    } else {
      resources = null;
    }

    return resources;
  }

  handleCardZoomClick = (cardId) => {
    this.setState({
      cardZoomId: cardId });
  }

  handleCardZoomRequestClose = () => {
    this.setState({
      cardZoomId: null
    });
  }

  render() {
    this.resourceCount = this.props.resources.length;
    
    return (
      <AdjustsForScrollbarContainer
        className={styles.resources}
        itemsPerRow={resourcesPerRow}
      >
        {this.buildResources()}
      </AdjustsForScrollbarContainer>
    );
    /*
    return (
      <div>
        <CardZoomLightbox
          cardId={this.state.cardZoomId}
          handleRequestClose={this.handleCardZoomRequestClose}
        />
        <AdjustsForScrollbarContainer
          className={styles.resources}
          itemsPerRow={resourcesPerRow}
        >
          {this.buildResources()}
        </AdjustsForScrollbarContainer>
      </div>
    );
    */
  }
}

export default UserResources
