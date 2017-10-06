import React from 'react'
import ReactModal from 'react-modal'

class NewDeckLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deckName: '',
      colId: '',
    }
  }

  handleChangeHelper(event, propName) {
    const value = event.target.value;
    this.setState(() => {
      return {
        [propName]: value,
      }
    });
  }

  handleDeckNameChange = (event) => {
    this.handleChangeHelper(event, 'deckName')
  }

  handleColIdChange = (event) => {
    this.handleChangeHelper(event, 'colId')
  }

  handleCreate = () => {
    if (this.state.deckName.length) {
      this.handleRequestClose();
      this.props.handleCreate(this.state.deckName, this.state.colId);
    } else {
      $(this.rootNode).effect('shake');
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
    )
  }
}

export default NewDeckLightbox
