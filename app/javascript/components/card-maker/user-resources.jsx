import React from 'react'

import Card from './card'
import Deck from './deck'
import CreateButtonResource from './create-button-resource'
import ResourcePlaceholder from './resource-placeholder'
//import AdjustsForScrollbarContainer from './adjusts-for-scrollbar-container'
import CardZoomLightbox from './card-zoom-lightbox'

import styles from 'stylesheets/card_maker/card_manager'

const numImagesLoading = 3 // load this many images concurrently
    , minSpaceBetweenItemsDivisor = 10
    , startingSliceIndex = 1 // Start with one item visible for calculations
    ;

class UserResources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containerScrollTop: null,
      imageLoadIndex: numImagesLoading - 1,
      zoomCardIndex: null,
      margin: null,
      numPlaceholders: 0,
      sliceIndex: startingSliceIndex, // We need to start with one item visible
      itemsPerRow: 0
    };
  }

  componentDidMount() { 
    this.updateItemMargin();
    $(window).resize(this.updateItemMargin);
  }

  componentWillUnmount() {
    $(window).off('resize', this.updateItemMargin);
  }

  componentDidUpdate() {
    this.updateItemMargin();
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
        sliceIndex: startingSliceIndex, 
        imageLoadIndex: numImagesLoading - 1
      }, this.updateSliceIndex);
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
        domRef={this.itemRef}
        style={{ marginLeft: this.state.margin, marginTop: this.state.margin }}
      />
    )];
  }

  itemRef = (node) => {
    console.log('ref', node);
    this.itemNode = node;
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
          domRef={i === 0 && !resources.length ? this.itemRef : null}
          style={{ marginLeft: this.state.margin, marginTop: this.state.margin }}
        />
      )
    }
    
    resources = resources.concat(
      this.props.resources.map(resourceMapFn)
    );

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

  updateSliceIndex = () => {
    if (this.containerNode && this.itemNode) {
      let $containerNode = $(this.containerNode)
        , rowsVisible = Math.ceil(
            ($containerNode.scrollTop() + $containerNode.outerHeight()) /
            (this.state.margin + $(this.itemNode).outerHeight())
          )
        , sliceIndex = rowsVisible * this.state.itemsPerRow
        ;

      if (sliceIndex > this.state.sliceIndex) {
        this.setState({
          sliceIndex: sliceIndex
        });
      }
    }
  }

  handleContainerRef = (node) => {
    this.containerNode = node;

    if (node) {
      this.updateSliceIndex();
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

  // Set margin of resources dynamically to account for scrollbar weirdness
  updateItemMargin = () => {
    if (
      this.containerNode && this.itemNode
    ) {
      const scrollbarWidth = this.containerNode.offsetWidth - this.containerNode.clientWidth
          , innerWidth = $(this.containerNode).width()
          , resourceWidth = $(this.itemNode).outerWidth()
          , minSpaceBetweenItems = resourceWidth / minSpaceBetweenItemsDivisor
          , itemsPerRow = Math.floor((innerWidth - minSpaceBetweenItems) / (resourceWidth + minSpaceBetweenItems))
          , margin = (innerWidth - itemsPerRow * resourceWidth) / (itemsPerRow + 1)
          , numPlaceholders = 0//Math.max(itemsPerRow * this.props.minRows - this.props.children.length, 0)
          ;


      if (margin != this.state.margin) {
        this.setState({
          margin,
          numPlaceholders,
          itemsPerRow
        }, this.updateSliceIndex);
      }
    }
  }

  render() {
    const classes = [styles.userResources];

    if (this.props.extraClass) {
      classes.push(this.props.extraClass);
    }

    return (
      <div className={classes.join(' ')}>
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
        <ul 
          className={styles.resourceList}
          onScroll={this.updateSliceIndex} 
          ref={(node) => { this.containerNode = node }}
          style={{ paddingBottom: this.state.margin }}
        >
          {this.buildResources().slice(0, this.state.sliceIndex)}
        </ul>
      </div>
    );
  }
}

export default UserResources
