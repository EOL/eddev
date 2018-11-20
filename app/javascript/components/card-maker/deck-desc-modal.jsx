import React from 'react'
import CloseButtonModal from 'components/shared/close-button-modal'
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
      <CloseButtonModal
        isOpen={this.props.isOpen}
        contentLabel={'set deck description'}
        parentSelector={() => document.getElementById('Page')}
        overlayClassName='fixed-center-wrap disable-overlay'
        bodyOpenClassName='noscroll'
        onRequestClose={this.props.onRequestClose}
        key={this.props.desc}
        className={[styles.modal, styles.modalDeckDesc].join(' ')}
      >
        <textarea 
          value={this.state.value} 
          onChange={(e) => this.setState({ value: e.target.value })}
        />
        <div 
          className={[styles.btn, styles.btnDesc].join(' ')}
          onClick={() => this.props.onRequestSave(this.state.value)}
        >save description</div>
      </CloseButtonModal>
    );
  }
}

export default DeckDescModal;

