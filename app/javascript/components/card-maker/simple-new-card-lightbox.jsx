import React from 'react'

//import SpeciesSearch from './species-search'
import SpeciesSearchResult from './species-search-result'
import CloseButtonModal from 'components/shared/close-button-modal'

import traitCardImg from 'images/card_maker/sample_cards/trait.png'
import titleCardImg from 'images/card_maker/sample_cards/title.png'
import keyCardImg   from 'images/card_maker/sample_cards/key.png'
import vocabCardImg from 'images/card_maker/sample_cards/vocab.png'
import descCardImg  from 'images/card_maker/sample_cards/desc.png'

class SimpleNewCardLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'templateSelect'
    }
  }

  render() {
    return (
      <CloseButtonModal
        isOpen={this.props.isOpen}
        contentLabel={'new card'}
        parentSelector={() => {return document.getElementById('Page')}}
        overlayClassName='fixed-center-wrap disable-overlay'
        bodyOpenClassName='noscroll'
        onRequestClose={this.props.onRequestClose}
      >
        TESTING 123
      </CloseButtonModal>
    );
  }
}

export default SimpleNewCardLightbox;

