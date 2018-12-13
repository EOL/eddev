import React from 'react'

//import SpeciesSearch from './species-search'
import SpeciesSearchResult from './species-search-result'
import CloseButtonModal from 'components/shared/close-button-modal'
import TemplateSelect from './new-card-lightbox/template-select'
import Search from './new-card-lightbox/search'

import traitCardImg from 'images/card_maker/sample_cards/trait.png'
import titleCardImg from 'images/card_maker/sample_cards/title.png'
import keyCardImg   from 'images/card_maker/sample_cards/key.png'
import vocabCardImg from 'images/card_maker/sample_cards/vocab.png'
import descCardImg  from 'images/card_maker/sample_cards/desc.png'

import styles from 'stylesheets/card_maker/new_card_lightbox'

var cardTypes = [
  {
    img: traitCardImg,
    nameKey: 'trait_card',
    template: 'trait',
    buttonText: 'Next',
    nextView: 'search'
  },
  {
    img: titleCardImg,
    nameKey: 'title_card',
    template: 'title',
  },
  {
    img: keyCardImg,
    nameKey: 'key_card',
    template: 'key'
  },
  {
    img: descCardImg,
    nameKey: 'proj_desc_card',
    template: 'desc'
  },
  {
    img: vocabCardImg,
    nameKey: 'vocab_card',
    template: 'vocab'
  }
]

var cardTypesByTemplate = {};
cardTypes.forEach((type) => {
  cardTypesByTemplate[type.template] = type;
});

var views = {
  templateSelect: {
    title: 'select a card type',
  },
  search: {
    title: 'search',
    prev: 'templateSelect'
  }
}

class SimpleNewCardLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewKey: 'templateSelect',
      selectedCardType: cardTypes[0]
    }
  }

  handleTemplateSelect = (template) => {
    this.setState({ 
      selectedCardType: cardTypesByTemplate[template] 
    });
  }

  cardTypesForSelect  = () => {
    return cardTypes.map((type) => {
      const copy = {};
      copy.key = type.template;
      copy.nameKey = type.nameKey;
      copy.img = type.img;

      if (type === this.state.selectedCardType) {
        copy.selected = true;
      } else {
        copy.selected = false;
      }

      return copy;
    });
  }

  handleTemplateSubmit = () => {
    if (this.state.selectedCardType.nextView) {
      this.setState({
        viewKey: this.state.selectedCardType.nextView
      });
    } else {
      this.props.onRequestCreateCard(this.state.selectedCardType.template, {});
      this.props.onRequestClose();
    }
  }

  currentViewComponent = () => {
    if (this.state.viewKey === 'templateSelect') {
      return (
        <TemplateSelect 
          onTemplateSelect={this.handleTemplateSelect}
          cardTypes={this.cardTypesForSelect()}
          buttonText={this.state.selectedCardType.buttonText || 'Create'}
          onSubmit={this.handleTemplateSubmit}
        />
      );
    } else if (this.state.viewKey === 'search') {
      return (
        <Search />
      );
    }
  }

  render() {
    const view = views[this.state.viewKey];

    return (
      <CloseButtonModal
        isOpen={this.props.isOpen}
        contentLabel={'new card'}
        parentSelector={() => {return document.getElementById('Page')}}
        overlayClassName='fixed-center-wrap disable-overlay'
        bodyOpenClassName='noscroll'
        onRequestClose={this.props.onRequestClose}
        className={styles.newCardLightbox}
      >
        <h2>
          {
            view.prev != null && 
            <i className='fa fa-angle-left fa-2x' onClick={() => this.setState({ viewKey: view.prev })}/>
          }
          {view.title}
        </h2>
        {this.currentViewComponent()}
      </CloseButtonModal>
    );
  }
}

export default SimpleNewCardLightbox;

