import React from 'react'
import SimpleLightbox from './simple-lightbox'
import styles from 'stylesheets/card_maker/simple_manager'

class DeckDescModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.desc || ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.desc !== nextProps.desc) {
      this.setState({
        value: nextProps.desc
      });
    }
  }

  render() { 
    return (
      <SimpleLightbox
        isOpen={this.props.isOpen}
        contentLabel={'set deck description'}
        onRequestClose={this.props.onRequestClose}
        fields={[{
          type: 'textarea',
          onChange: (val) => this.setState({ value: val }),
          value: this.state.value
        }]}
        submitLabel={I18n.t('react.card_maker.save_desc')}
        onSubmit={() => this.props.onRequestSave(this.state.value)}
      />
    );
  }
}

export default DeckDescModal;

