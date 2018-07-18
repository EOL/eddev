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
    , resourceHeight = 218.4 // TODO: these shouldn't just be hard-coded..
    , containerHeight = 600
    , resourceMarginTop = 10
    ;

class UserResources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containerScrollTop: null,
      resources: this.buildResources(props),
      resourceSliceIndex: 0,
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
        resources: this.buildResources(nextProps),
        resourceSliceIndex: 0, 
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

  buildResources = (props) => {
    let resources = props.editable ? 
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
          handleDeckSelect={props.handleCardDeckSelect.bind(null, resource.id)}
          handleEditClick={() => props.handleEditCard(resource.id)}
          handleCopyClick={() => props.handleCopyCard(resource.id)}
          handleDestroyClick={() => props.handleDestroyCard(resource.id)}
          handleZoomClick={() => this.handleCardZoomClick(i)}
          editable={props.editable}
          showCopy={this.props.showCopyCard}
        />
      )
    }
    
    resources = resources.concat(
      props.resources.map(resourceMapFn)
    );

    if (props.editable) {
      minPlaceholders = resourcesPerRow + 
        Math.min((resourcesPerRow - (resources.length % resourcesPerRow)), resourcesPerRow - 1);

      while (resources.length < minResources || placeholderKey < minPlaceholders) {
        resources.push(<ResourcePlaceholder key={placeholderKey++} />);
      }
    }

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
          handleRequestClose={this.handleCardZoomRequestClose}
        />
        <AdjustsForScrollbarContainer
          className={styles.resources}
          itemsPerRow={resourcesPerRow}
          handleScroll={this.updateResourceSliceIndex}
          handleRef={this.handleContainerRef}
        >
          {this.state.resources.slice(0, this.state.resourceSliceIndex)}
        </AdjustsForScrollbarContainer>
      </div>
    );
  }
}

export default UserResources
