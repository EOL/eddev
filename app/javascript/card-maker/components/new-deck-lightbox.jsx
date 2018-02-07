import React from 'react'
import ReactModal from 'react-modal'

import styles from 'stylesheets/card_maker/card_manager'

class NewDeckLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deckName: '',
      colId: '',
    }
  }

  handleDeckNameInput = (e) => {
    var deckName = e.target.value
      , highlightDeckName = this.state.highlightDeckName && !deckName.length
      ;

    this.setState({
      deckName: deckName,
      highlightDeckName: highlightDeckName,
    });
  }

  handleCreate = () => {
    if (this.state.deckName.length) {
      this.handleRequestClose();
      this.props.handleCreate(this.state.deckName, this.state.colId);
    } else {
      $(this.rootNode).effect('shake');
      this.setState({
        highlightDeckName: true
      });
    }
  }

  handleRequestClose = () => {
    this.setState(() => {
      return {
        deckName: '',
        colId: '',
      }
    });
    this.props.handleRequestClose();
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        contentLabel={I18n.t('react.card_maker.new_deck')}
        parentSelector={() => {return document.getElementById('Page')}}
        overlayClassName='fixed-center-wrap disable-overlay'
        className={styles.lNewLightbox}
        bodyOpenClassName='noscroll'
        onRequestClose={this.handleRequestClose}
      >
        <div ref={(node) => this.rootNode = node}>
          <div className={styles.lNewCol}> 
            <div>
              <input 
                type="text"
                value={this.state.deckName}
                onInput={this.handleDeckNameInput}
                placeholder={I18n.t('react.card_maker.enter_deck_name')}
                className={[
                  styles.newInput, 
                  styles.newInputTxt, 
                  (this.state.highlightDeckName ? styles.isNewInputError : '')
                ].join(' ')}
              />
              <input
                type="text"
                value={this.state.colId}
                onInput={(e) => this.setState({ colId: e.target.value})}
                placeholder={I18n.t('react.card_maker.enter_collection_id')}
                className={[styles.newInput, styles.newInputTxt, styles.newInputColId].join(' ')}
              />
            </div>
          </div>
          <div className={styles.lNewCol}>
            <div>
              <button className={styles.createBtn} onClick={this.handleCreate}>
                {I18n.t('react.card_maker.create_deck')}
              </button>
            </div>
          </div>
        </div>
        {/*
        <ReactModal
          isOpen={this.props.isOpen}
          contentLabel={I18n.t('react.card_maker.new_deck')}
          parentSelector={() => {return document.getElementById('Page')}}
          overlayClassName='fixed-center-wrap disable-overlay'
          className='new-deck lightbox'
          onRequestClose={this.handleRequestClose}
        >
          <div ref={(node) => this.rootNode = node}>
            <div className='deck-name-wrap wrap'>
              <input
                className='deck-name input'
                type='text'
                placeholder={I18n.t('react.card_maker.enter_deck_name')}
                value={this.state.deckName}
                onChange={this.handleDeckNameChange}
              />
              <div
                className='create-deck-btn'
                onClick={this.handleCreate}
              >
                <div className='create-deck-txt'>{I18n.t('react.card_maker.create_deck')}</div>
                <i className='icon-new-deck' />
              </div>
            </div>
            <div className='col-id-wrap wrap'>
              <input
                className='col-id input'
                type='text'
                placeholder={I18n.t('react.card_maker.enter_collection_id')}
                value={this.state.colId}
                onChange={this.handleColIdChange}
              />
            </div>
          </div>
        </ReactModal>
        */}
        <div />
      </ReactModal>

    )
  }
}

export default NewDeckLightbox
