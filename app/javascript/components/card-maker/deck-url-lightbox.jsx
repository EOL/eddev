import React from 'react'
import CloseButtonModal from 'components/shared/close-button-modal'

import styles from 'stylesheets/card_maker/card_manager'

class DeckUrlLightbox extends React.Component {
  copyUrl = () => {
    if (this.inputNode) {
      this.inputNode.removeAttribute('disabled');
      this.inputNode.select();
      document.execCommand('copy');
      this.inputNode.setAttribute('disabled', '');
    }
  }

  render() {
    return (
      <CloseButtonModal
        isOpen={this.props.isOpen}
        contentLabel='Deck URL'
        parentSelector={() => { return document.body}}
        className={styles.deckUrlLightbox}
        overlayClassName='fixed-center-wrap disable-overlay'
        bodyOpenClassName='noscroll'
        onRequestClose={this.props.handleRequestClose}
      >
          <input 
            type='text'
            className={[styles.newInput, styles.newInputDeckUrl, styles.newInputTxt].join(' ')}
            disabled='disabled'
            ref={(node) => this.inputNode = node}
            value={this.props.deckUrl}
          />
          <i className="fa fa-copy fa-2x" onClick={this.copyUrl}/>
      </CloseButtonModal>
    );
  }
}

export default DeckUrlLightbox;
