import React from 'react'
import DeckNameLightbox from './deck-name-lightbox'

class CopyDeckLightbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      copyName: this.deckCopyName(this.props.deck)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.deck !== nextProps.deck) {
      this.setState({
        copyName: this.deckCopyName(nextProps.deck)
      });
    }
  }

  deckCopyName = (deck) => {
    let num = 2
      , baseName
      , name
      ;

    if (!deck) {
      return '';
    }

    if (this.props.upgradedInName) {
      baseName = I18n.t('react.card_maker.name_updated', {
        name: deck.name
      });
    } else {
      baseName = I18n.t('react.card_maker.copy_of_name', {
        name: deck.name 
      });
    }

    name = baseName;
  
    while (this.props.deckNames.has(name) && num < 10) {
      name = `${baseName} (${num++})`;
    }

    if (this.props.deckNames.has(name)) {
      name = null;
    }

    return name;
  }

  render() {
    return (
      <DeckNameLightbox
        isOpen={this.props.isOpen}
        contentLabel={this.props.submitLabel}
        submitLabel={this.props.submitLabel}
        handleSubmit={this.props.handleCopy}
        handleRequestClose={this.props.handleRequestClose}
        deckNames={this.props.deckNames}
        name={this.state.copyName}
        message={this.props.message}
      />
    );
  }
}

export default CopyDeckLightbox;

