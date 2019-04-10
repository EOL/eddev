import React from 'react'

import ResourceLightbox from './resource-lightbox'
import DeckNameLightbox from './deck-name-lightbox'

class CopyCardLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deckId: null,
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.isOpen && !newProps.isOpen) {
      this.setState({
        deckId: null,
      });
    }
  }

  handleDeckSelect = (id) => {
    this.setState({
      deckId: id
    });
  }

  deckOptions = () => {
    return [
      {
        name: I18n.t('react.card_maker.select_deck'),
        id: null
      },
      {
        name: I18n.t('react.card_maker.create_new_deck'),
        id: this.props.newDeckId
      },
    ].concat(
      this.props.decks.map((deck) => {
        return {
          name: deck.name,
          id: deck.id
        }
      }).sort((a, b) => {
        let aName = a.name.toLowerCase()
          , bName = b.name.toLowerCase()
          ;

        if (aName < bName) {
          return -1;
        }
         
        if (aName > bName) {
          return 1;
        }

        return 0;
      })
    );
  }

  fields = () => {
    return [{
      type: 'select',
      options: this.deckOptions(),
      handleSelect: this.handleDeckSelect,
      selectedId: this.state.deckId
    }];
  }

  handleSubmit = (deckName) => {
    this.props.handleCopy(this.state.deckId, deckName);
  }

  render() {
    let deckNames = new Set(this.props.decks.map((deck) => {
      return deck.name;
    }));

    return (
      <DeckNameLightbox
        isOpen={this.props.isOpen}
        contentLabel={I18n.t('react.card_maker.copy_card')}
        submitLabel={I18n.t('react.card_maker.copy_card')}
        handleRequestClose={this.props.handleRequestClose}
        handleSubmit={this.handleSubmit}
        hideDeckNameInput={this.state.deckId !== this.props.newDeckId}
        fields={this.fields()}
        deckNames={deckNames}
      />
    )
  }

  /*
  <ResourceLightbox
    isOpen={this.props.isOpen}
    contentLabel={I18n.t('react.card_maker.copy_card')}
    submitLabel={I18n.t('react.card_maker.copy_card')}
    fields={this.fields()}
    
    handleRequestClose={this.props.handleRequestClose}
  />
  */
}

export default CopyCardLightbox;
