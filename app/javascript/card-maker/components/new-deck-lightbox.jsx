import React from 'react'
import DeckNameLightbox from './deck-name-lightbox'

class NewDeckLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colId: '',
      locale: I18n.locale
    }
  }

  componentDidMount() {
    this.setState({
      locale: I18n.locale
    });
  }

  componentWillReceiveProps(newProps) {
    if (this.props.isOpen && !newProps.isOpen) {
      this.setState({
        colId: ''
      });
    }
  }

  fields = () => {
    return [
      {
        type: 'text',
        value: this.state.colId,
        handleChange: (e) => this.setState({ colId: e.target.value }),
        placeholder: I18n.t('react.card_maker.collection_id_optional')
      },
      {
        type: 'select',
        options: I18n.availableLocales.map((locale) => { 
          return { id: locale.locale, name: locale.displayName } 
        }),
        selectedId: this.state.locale,
        handleSelect: (locale) => this.setState({ locale: locale })
      }
    ];

  }

  handleSubmit = (name) => {
    this.props.handleCreate(name, this.state.colId, this.state.locale)
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
