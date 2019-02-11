import React from 'react'

import Card from './card'
import Deck from './deck'
import CreateButtonResource from './create-button-resource'
import ResourcePlaceholder from './resource-placeholder'
import AdjustsForScrollbarContainer from './adjusts-for-scrollbar-container'
import CardZoomLightbox from './card-zoom-lightbox'

import styles from 'stylesheets/card_maker/card_manager'

const numCardsLoading = 10; // Don't load more than this many card images at a given time

class UserResources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoomCardIndex: null,
      cardLoadIndex: numCardsLoading - 1
    };
  }

  componentWillReceiveProps(nextProps) {
    let changed = this.props.editable !== nextProps.editable ||
      this.props.resources.length !== nextProps.resources.length;

    for (let i = 0; i < this.props.resources.length && !changed; i++) {
      if (
        this.props.resources[i].id !== nextProps.resources[i].id ||
        this.props.resources[i].updatedAt !== nextProps.resources[i].updatedAt
      ) {
        changed = true;
      }
    }

    if (changed) {
      this.setState({
        cardLoadIndex: numCardsLoading - 1
      })
    }
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

    let resourceMapFn = (resource, i) => {
      return (
        <Card
          data={resource}
          key={resource.id}
          handleDeckSelect={this.props.handleCardDeckSelect.bind(null, resource.id)}
          handleEditClick={() => this.props.handleEditCard(resource.id)}
          handleCopyClick={() => this.props.handleCopyCard(resource.id)}
          handleDestroyClick={() => this.props.handleDestroyCard(resource.id)}
          handleZoomClick={() => this.handleCardZoomClick(i)}
          editable={this.props.editable}
          showCopy={this.props.showCopyCard}
          load={this.state.cardLoadIndex >= i}
          onLoad={this.handleCardLoad}
        />
      )
    }
    
    resources = resources.concat(
      this.props.resources.map(resourceMapFn)
    );

    /*
    if (this.props.editable) {
      minPlaceholders = resourcesPerRow + 
        Math.min((resourcesPerRow - (resources.length % resourcesPerRow)), resourcesPerRow - 1);

      while (resources.length < minResources || placeholderKey < minPlaceholders) {
        resources.push(<ResourcePlaceholder key={placeholderKey++} />);
      }
    }
    */

    return resources;
  }

  handleCardZoomClick = (i) => {
    this.setState({
      zoomCardIndex: i
    });
  }

  handleCardZoomRequestClose = () => {
    this.setState({
      zoomCardIndex: null
    });
  }

  handleContainerRef = (node) => {
    this.containerNode = node;

    if (node) {
      this.updateResourceSliceIndex();
    }  
  }

  updateZoomCardIndex = (updater) => {
    this.setState((prevState, props) => {
      return {
        zoomCardIndex: prevState.zoomCardIndex === null ? null : updater(prevState.zoomCardIndex, props.resources.length)
      }
    });
  }

  hasNext = () => {
    return this.state.zoomCardIndex !== null &&
      this.state.zoomCardIndex < this.props.resources.length - 1;
  }

  hasPrev = () => {
    return this.state.zoomCardIndex !== null &&
      this.state.zoomCardIndex > 0;
  }

  handleCardLoad = () => {
    this.setState((prevState, props) => ({
      cardLoadIndex: prevState.cardLoadIndex + 1
    }));
  }

  render() {
    this.resourceCount = this.props.resources.length;
    
    return (
      <div>
        <CardZoomLightbox
          card={this.state.zoomCardIndex === null ? null : this.props.resources[this.state.zoomCardIndex]}
          requestNext={() => {
            this.updateZoomCardIndex((index, length) => {
              return (index + 1) % length;
            });
          }}
          requestPrev={() => {
            this.updateZoomCardIndex((index, length) => {
              var updated = (index - 1) % length;
              if (updated < 0) { 
                updated = length + updated;
              }
              return updated;
            });
          }}
          hasNext={this.hasNext()}
          hasPrev={this.hasPrev()}
          handleRequestClose={this.handleCardZoomRequestClose}
        />
        <div
          className={styles.resources}
        >
          {this.buildResources()}
        </div>
      </div>
    );
  }
}

export default UserResources
