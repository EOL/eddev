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

  handleInputHelper(event, propName) {
    const value = event.target.value;
    this.setState(() => {
      return {
        [propName]: value,
      }
    });
  }

  handleDeckNameInput = (event) => {
    this.handleInputHelper(event, 'deckName')
  }

  handleColIdInput = (event) => {
    this.handleInputHelper(event, 'colId')
  }

  handleCreate = () => {
    if (this.state.deckName.length) {
      this.props.handleRequestClose();
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
        contentLabel='New deck'
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
              placeholder='Enter deck name'
              value={this.state.deckName}
              onInput={this.handleDeckNameInput}
            />
            <div
              className='create-deck-btn'
              onClick={this.handleCreate}
            >
              <div className='create-deck-txt'>Create deck</div>
              <i className='icon-new-deck' />
            </div>
          </div>
          <div className='col-id-wrap wrap'>
            <input
              className='col-id input'
              type='text'
              placeholder='Enter EOL collection id (optional)'
              value={this.state.colId}
              onInput={this.handleColIdInput}
            />
          </div>
        </div>
      </ReactModal>
    )
  }
}

export default NewDeckLightbox
