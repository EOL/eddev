import React from 'react'

import LoadingSpinnerImage from './loading-spinner-image'
import resourceWrapper from './resource-wrapper'
import {cardMakerUrl, loResCardImageUrl} from 'lib/card-maker/url-helper'

import styles from "stylesheets/card_maker/card_manager"

const noDeckId = -1;

class Card extends React.Component {
  deckAssignItems() {
    const items = this.props.decks.map((deck) => {
      return {
        menuText: deck.name,
        selectedText: deck.name,
        openText: 'move',
        id: deck.id,
      }
    });

    items.unshift({
      menuText: '—',
      selectedText: I18n.t('react.card_maker.no_deck_assigned'),
      openText: I18n.t('react.card_maker.assign_to_deck'),
      id: noDeckId,
    });

    return items;
  }

  selectedDeckId() {
    return this.props.data.deck ? this.props.data.deck.id : noDeckId;
  }

  handleDeckSelect = (deckId) => {
    this.props.handleDeckSelect(deckId === noDeckId ? null : deckId);
  }

  render() {
    var overlayStyles = [styles.resourceOverlay];

    if (this.props.editable && this.props.showCopy) {
      overlayStyles.push(styles.resourceOverlayTwoCol);
    }

    return (
      <div>
        <LoadingSpinnerImage 
          src={loResCardImageUrl(this.props.data)} 
          load={this.props.loadImage}
          onLoad={this.props.onImageLoad}
        />
        {this.props.showOverlay &&
          <div className={overlayStyles.join(' ')}>
            {
              this.props.editable && 
              <i
                className='fa fa-edit fa-3x edit-btn'
                onClick={this.props.handleEditClick}
              />
            }
            <i
              className='fa fa-expand fa-3x'
              onClick={this.props.handleZoomClick}
            />
            {
              this.props.showCopy && 
              <i
                className='fa fa-copy fa-3x'
                onClick={this.props.handleCopyClick}
              />
            }
            {
              this.props.editable && 
              <i
                className='fa fa-trash-o fa-3x'
                onClick={this.props.handleDestroyClick}
              />
            }
          </div>
        }
      </div>
    )
  }
}

class DeckAssignSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }

  docClickHander = (event) => {
    if (this.state.open &&
      this.node &&
      !this.node.contains(event.target)
    ) {
      this.closeMenu();
    }
  }

  addDocClickCloseHandler = () => {
    document.addEventListener('mousedown', this.docClickHander);
  }

  removeDocClickCloseHandler = () => {
    document.removeEventListener('mousedown', this.docClickHander);
  }

  setNode = (node) => {
    this.node = node;
  }

  componentWillUnmount() {
    this.removeDocClickCloseHandler();
  }

  deckAssignItems() {
    const that = this;

    return this.props.items.map((item) => {
      return (
        <DeckAssignItem
          name={item.menuText}
          key={item.id}
          selected={item.id === that.props.selectedId}
          handleClick={() => that.props.handleSelect(item.id)}
        />
      )
    });
  }

  selectedItem() {
    const that = this;

    return that.props.items.find((deck) => {
      return deck.id === that.props.selectedId
    }) || that.props.items[0];
  }

  handleOpenClick = () => {
    if (!this.state.open) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  openMenu = () => {
    this.setState((prevState, props) => {
      this.addDocClickCloseHandler();

      return {
        open: true
      }
    });
  }

  closeMenu = () => {
    this.setState((prevState, props) => {
      this.removeDocClickCloseHandler();

      return {
        open: false
      }
    });
  }

  render() {
    const selectedDeck = this.selectedItem();

    var menuClassName = 'deck-assign-choices';

    if (!this.state.open) {
      menuClassName += ' hidden';
    }

    return (
      <div className='deck-assign-select' onClick={this.handleOpenClick} ref={this.setNode}>
        <div className='deck-assign-top'>
          <div className='deck-name'>{selectedDeck.selectedText}</div>
          <div className='open-msg'>{selectedDeck.openText}</div>
          <ul className={menuClassName}>{this.deckAssignItems()}</ul>
        </div>
      </div>
    )
  }
}

class DeckAssignItem extends React.Component {
  render() {
    var className = 'deck-assign-choice';

    return (
      <li className={className} onClick={this.props.handleClick}>{this.props.name}</li>
    )
  }
}

export default resourceWrapper(Card, []);
