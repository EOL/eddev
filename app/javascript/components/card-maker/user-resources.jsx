import React from 'react'

import Card from './card'
import Deck from './deck'
import CreateButtonResource from './create-button-resource'
import ResourcePlaceholder from './resource-placeholder'
import AdjustsForScrollbarContainer from './adjusts-for-scrollbar-container'
import CardZoomLightbox from './card-zoom-lightbox'
import DeckDesc from './deck-desc'

import styles from 'stylesheets/card_maker/card_manager'

const numCardsLoading = 10 // Don't load more than this many card images at a given time
    , cardWidth = 160 // XXX: not great, but makes things a lot easier. Update when necessary.
    , minSpaceBetweenCards = cardWidth / 10 // minimum px between cards (and between cards and the edge of the container)
    ; 

class UserResources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoomCardIndex: null,
      cardLoadIndex: numCardsLoading - 1,
      cardMargin: null
    };
  }

  componentDidMount() {
    $(window).resize(this.computeCardMargin);
  }

  componentWillUnmount() {
    $(window).off('resize', this.computeCardMargin);
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
        style={{marginBottom: this.state.cardMargin, marginLeft: this.state.cardMargin}}
        key='0'
      />
    )];
  }

  buildResources = () => {
    if (!this.state.cardMargin) {
      return []
    }

    let resources = this.props.editable ? 
          [this.createBtnResource()] :
          []
      , placeholderKey = 0
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
          style={{ marginLeft: this.state.cardMargin, marginBottom: this.state.cardMargin }}
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

  computeCardMargin = () => {
    if (this.resourcesNode) {
      let width = $(this.resourcesNode).width()
        , cardsPerRow = Math.floor((width - minSpaceBetweenCards) / (cardWidth + minSpaceBetweenCards))
        , cardMargin = (width - cardsPerRow * cardWidth) / (cardsPerRow + 1)
        ;

      this.setState({
        cardMargin: cardMargin
      });
    }
  }

  resourcesRef = (node) => {
    if (node) { 
      this.resourcesNode = node; 
      this.computeCardMargin();
    }
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
        {
          this.props.showDesc &&
          <DeckDesc
            handleInputChange={this.props.onDescInputChange}
            handleRequestSave={this.props.onRequestDescSave}
            handleRequestClose={this.props.onRequestDescClose}
            showInput={this.props.showDescInput}
            editable={this.props.editable}
            handleRequestInput={this.props.onRequestDescInput}
            value={this.props.descValue}
          />
        }
        <div
          className={styles.resources}
          ref={this.resourcesRef}
          style={{paddingBottom: this.state.cardMargin}}
        >
          {this.buildResources()}
        </div>
      </div>
    );
  }
}

export default UserResources
