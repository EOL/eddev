import React from 'react'

const noDeckId = -1;

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgLoaded: false,
      showOverlay: false
    }
  }

  imgUrl() {
    return 'card_maker_ajax/cards/' + this.props.data.id + '/svg';
  }

  imgLoaded = () => {
    this.setState({
      imgLoaded: true,
      showOverlay: this.state.showOverlay
    })
  }

  handleMouseEnter = () => {
    this.setState({
      imgLoaded: this.state.imgLoaded,
      showOverlay: true
    })
  }

  handleMouseLeave = () => {
    this.setState({
      imgLoaded: this.state.imgLoaded,
      showOverlay: false
    })
  }

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
      selectedText: 'No deck assigned',
      openText: 'Assign to deck',
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
    var imgClass = 'user-resource'
      , spinClass = 'fa fa-spinner fa-spin fa-2x img-placeholder'
      , overlayClass = 'card-overlay resource-overlay'
      ;

    if (this.state.imgLoaded) {
      spinClass += ' hidden';
    } else {
      imgClass += ' hidden';
    }

    if (!this.state.showOverlay) {
      overlayClass += ' hidden';
    }

    return (

      <div className='resource-wrap'
           onMouseEnter={this.handleMouseEnter}
           onMouseLeave={this.handleMouseLeave}
      >
        <DeckAssignSelect
          items={this.deckAssignItems()}
          selectedId={this.selectedDeckId()}
          handleSelect={this.handleDeckSelect}
        />
        <div className='resource-frame'>
          <i className={spinClass} />
          <img
            className={imgClass}
            src={this.imgUrl()}
            onLoad={this.imgLoaded}
          />
          <div className={overlayClass}>
            <i className='i fa fa-edit fa-3x edit-btn btn' />
            <i className='i fa fa-trash-o fa-3x trash-btn btn' />
          </div>
        </div>
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

export default Card;
