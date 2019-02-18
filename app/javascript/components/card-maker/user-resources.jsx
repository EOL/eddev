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
    , resourceHeight = 213.3 // TODO: these REALLY shouldn't just be hard-coded.
    , containerHeight = 600
    , resourceMarginTop = 10
    , numImagesLoading = 3 // load this many images concurrently
    ;

class UserResources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containerScrollTop: null,
      resourceSliceIndex: 0,
      imageLoadIndex: numImagesLoading - 1,
      zoomCardIndex: null
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
        resourceSliceIndex: 0, 
        imageLoadIndex: numImagesLoading - 1
      }, this.updateResourceSliceIndex);
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
          loadImage={this.state.imageLoadIndex >= i}
          onImageLoad={this.incrImageLoadIndex}
        />
      )
    }
    
    resources = resources.concat(
      this.props.resources.map(resourceMapFn)
    );

    if (this.props.editable) {
      minPlaceholders = resourcesPerRow + 
        Math.min((resourcesPerRow - (resources.length % resourcesPerRow)), resourcesPerRow - 1);

      while (resources.length < minResources || placeholderKey < minPlaceholders) {
        resources.push(<ResourcePlaceholder key={placeholderKey++} />);
      }
    }

    return resources;
  }

  incrImageLoadIndex = () => {
    this.setState((prevState, props) => {
      return {
        imageLoadIndex: prevState.imageLoadIndex + 1
      }
    });
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

  updateResourceSliceIndex = () => {
    if (this.containerNode) {
      let rows = Math.ceil(
            ($(this.containerNode).scrollTop() + containerHeight) /
            (resourceMarginTop + resourceHeight)
          )
        , sliceIndex = rows * resourcesPerRow
        ;

      if (sliceIndex > this.state.resourceSliceIndex) {
        this.setState({
          resourceSliceIndex: sliceIndex
        });
      }
    }
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
        <AdjustsForScrollbarContainer
          className={styles.resources}
          itemsPerRow={resourcesPerRow}
          handleScroll={this.updateResourceSliceIndex}
          handleRef={this.handleContainerRef}
        >
          {this.buildResources().slice(0, this.state.resourceSliceIndex)}
        </AdjustsForScrollbarContainer>
      </div>
    );
  }
}

export default UserResources
