import React from 'react'
import DeckNameLightbox from './deck-name-lightbox'

class NewDeckLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colId: ''
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.isOpen && !newProps.isOpen) {
      this.setState({
        colId: ''
      });
    }
  }

  fields = () => {
    return [{
      type: 'text',
      value: this.state.colId,
      handleChange: (e) => this.setState({ colId: e.target.value }),
      placeholder: I18n.t('react.card_maker.collection_id_optional')
    }];
  }

  handleSubmit = (name) => {
    this.props.handleCreate(name, this.state.colId)
  }

  render() {
    return (
      <DeckNameLightbox
        isOpen={this.props.isOpen}
        contentLabel={I18n.t('react.card_maker.create_deck')}
        submitLabel={I18n.t('react.card_maker.create_deck')}
        handleSubmit={this.handleSubmit}
        fields={this.fields()}
        handleRequestClose={this.props.handleRequestClose}
        deckNames={this.props.deckNames}
      />
    );
  }
}

export default NewDeckLightbox;
