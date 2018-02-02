import React from 'react'

import Card from './card'
import Deck from './deck'
import CreateButtonResource from './create-button-resource'
import ResourcePlaceholder from './resource-placeholder'
import AdjustsForScrollbarContainer from './adjusts-for-scrollbar-container'
import CardZoomLightbox from './card-zoom-lightbox'

import styles from 'stylesheets/card_maker/card_manager'

const resourcesPerRow = 4
    , initRows = 3 
    , minResources = resourcesPerRow * initRows
    ;

class UserResources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createBtnResource = () => {
    let createMsg
      , handleCreate
      ;

    if (this.props.resourceType === 'card') {
      createMsg = I18n.t('react.card_maker.new_card_lc');
      handleCreate = this.props.handleNewCard;
    } else if (this.props.resourceType === 'deck') {
      createMsg = I18n.t('react.card_maker.new_deck_lc');
      handleCreate = this.props.handleNewDeck;
    }

    return [(
      <CreateButtonResource
        createMsg={createMsg}
        handleCreate={handleCreate}
        key='0'
      />
    )];
  }

  buildResources = () => {
    let resources = this.props.editable ? 
          [this.createBtnResource()] :
          []
      , placeholderKey = 0
      , minPlaceholders
      ;

    let resourceMapFn = (resource) => {
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
    
    /*else if (this.props.resourceType === 'deck') {
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
    }*/

    resources = resources.concat(
      this.props.resources.map(resourceMapFn)
    );

    minPlaceholders = resourcesPerRow + 
      Math.min((resourcesPerRow - (resources.length % resourcesPerRow)), resourcesPerRow - 1);

    while (resources.length < minResources || placeholderKey < minPlaceholders) {
      resources.push(<ResourcePlaceholder key={placeholderKey++} />);
    }

    return resources;
  }

  handleCardZoomClick = (cardId) => {
    this.setState({
      cardZoomId: cardId 
    });
  }

  handleCardZoomRequestClose = () => {
    this.setState({
      cardZoomId: null
    });
  }

  render() {
    this.resourceCount = this.props.resources.length;
    
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
  }
}

export default UserResources
