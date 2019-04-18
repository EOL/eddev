import React from 'react'

//import SpeciesSearch from './species-search'
import CloseButtonModal from 'components/shared/close-button-modal'
import UserResourceFilter from './user-resource-filter'
import SpeciesSearchResult from './new-card-lightbox/species-search-result'
import {cardMakerUrl, loResCardImageUrl} from 'lib/card-maker/url-helper'

import traitCardImg from 'images/card_maker/sample_cards/trait.png'
import titleCardImg from 'images/card_maker/sample_cards/title.png'
import keyCardImg   from 'images/card_maker/sample_cards/key.png'
import vocabCardImg from 'images/card_maker/sample_cards/vocab.png'
import descCardImg  from 'images/card_maker/sample_cards/desc.png'

import styles from 'stylesheets/card_maker/card_manager'
import simpleStyles from 'stylesheets/card_maker/simple_manager'

var cleanState = {
  searchResults: null,
  selectedResultId: null,
  screen: 'start'
};

var cardTypes = {};
[
  {
    img: traitCardImg,
    nameKey: 'trait_card',
    template: 'trait'
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

].forEach((type) => {
  cardTypes[type.template] = type;
});

function LeftColumn(props) {
  return (
    <div className={styles.lSpeciesSearchLeft}>
      <img className={styles.speciesSearchCardImg} src={props.img} />
      <div className={styles.speciesSearchCardLabel}>{I18n.t('react.card_maker.' + props.nameKey)}</div>
      {
        props.screen !== 'start' && 
        <button 
          type='button' 
          className={[styles.btn, styles.btnBack].join(' ')}
          onClick={props.onRequestBack}
        ><i className='fa fa-2x fa-arrow-left' /></button>
      }
    </div>
  );
}

class SpeciesSearchLightbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = cleanState;
    this.reqCount = 0;
  }

  resetState = () => {
    this.setState(cleanState);
  }

  handleResultSelect = (id) => {
    this.setState(() => {
      return {
        selectedResultId: id,
      }
    });
  }

  handleRequestClose = () => {
    this.resetState();
    this.props.handleClose();
  }

  handleCreate = (cardType) => {
    var params = cardType === 'trait' ? 
          { speciesId: this.state.selectedResultId } :
          null
      ;

    this.props.handleCreate(cardType, params);
    this.resetState();
  }

  handleQuerySubmit = (e) => {
    const query = this.state.query
        , reqNum = ++this.reqCount // increment reqCount whether or not query is blank to invalidate previous query if it exists
        , that = this
        ;

    e.preventDefault();
    $(this.inputNode).blur();

    if (query) {
      this.setState(() => {
        return {
          screen: 'inFlight',
          searchResults: null,
          cardType: 'trait',
          selectedResultId: null,
        }
      });

      $.getJSON(cardMakerUrl('taxon_search/' + query), function(data) {
        if (reqNum === that.reqCount && that.state.screen === 'inFlight') {
          that.setState({
            screen: 'create',
            searchResults: data,
            selectedResultId: data.length ? data[0].id : null
          });
        }
      });
    } else {
      this.resetState();
    }
  }

  spinCountContent = () => {
    let result = null;

    if (this.state.screen === 'inFlight') {
      result = (
        <div className={styles.speciesSearchSpin}>
          <i className={'fa fa-spinner fa-spin fa-lg'} />
        </div>
      );
    } else if (this.state.screen === 'start') {
      result = (
        <div className={styles.speciesResultCount}>
          {I18n.t('react.card_maker.or_select_different_card')}
        </div>
      );
    } else if (
      this.state.screen === 'create' &&
      !this.state.searchResults.length
    ) {
      result = (
        <div className={styles.speciesResultCount}>
          {I18n.t('react.card_maker.no_results_found')}
        </div>
      );
    }

    return result ? (
      <div className={styles.lSpinCountRow}>{result}</div>
    ) : null;
  }

  templateItem = (key) => {
    var type = cardTypes[key];

    return (
      <li className={styles.cardTemplate}>
        <img src={type.img} />
        <div>{I18n.t('react.card_maker.' + type.nameKey)}</div>
        <button
          className={[styles.btn, simpleStyles.btnCreateTempl].join(' ')}
          type='button'
          onClick={() => this.handleCreate(type.template)}
        >{I18n.t('react.card_maker.create')}</button>
      </li>
    );
  }

    /*
  loadPublicCards = () => {
    $.getJSON(cardMakerUrl(`taxa/${this.state.selectedResultId}/cards/public`), (result) => {
      this.setState({
        screen: 'selectCard',
        cardsForResult: result
      });
    });
  }
  */

  render() {
    var curType = cardTypes.trait;

    return (
      <CloseButtonModal
        isOpen={this.props.isOpen}
        contentLabel={I18n.t('react.card_maker.species_search')}
        parentSelector={() => {return document.getElementById('Page')}}
        overlayClassName='fixed-center-wrap disable-overlay'
        className={[styles.lNewLightbox, styles.lNewLightboxNewCard].join(' ')}
        bodyOpenClassName='noscroll'
        onRequestClose={this.handleRequestClose}
      >
        <div className={styles.speciesSearch}>
          <LeftColumn
            onRequestBack={() => this.setState({ screen: 'start', cardType: 'trait' })}
            img={curType.img}
            nameKey={curType.nameKey}
            screen={this.state.screen}
          />
          <div className={styles.speciesSearchForm}>
            {
              (
                this.state.screen === 'start' || 
                this.state.screen === 'inFlight' || 
                (this.state.screen === 'create' && this.state.cardType === 'trait')
              ) &&
              <form 
                action="#" 
                onSubmit={this.handleQuerySubmit} 
              >
                <div className={styles.speciesSearchInput}>
                  <input
                    className={styles.speciesSearchInputInput}
                    ref={(node) => this.inputNode = node}
                    onInput={(e) => this.setState({ query: e.target.value })}
                    name='query'
                    type='text'
                    placeholder={I18n.t('react.card_maker.search_species_taxon')}
                  />
                  <button className={styles.speciesSearchInputBtn}>
                    <i className='fa fa-lg fa-search' />
                  </button>
                </div>
                {this.spinCountContent()}
                {
                  this.state.screen === 'create' && this.state.cardType === 'trait' && (
                  <ul className={styles.speciesSearchResults}>
                    {
                      this.state.searchResults.map((result, i) => {
                        return (
                          <SpeciesSearchResult
                            key={i}
                            sciName={result.title}
                            id={result.id}
                            commonName={result.commonName}
                            thumbUrl={result.thumbUrl}
                            selected={this.state.selectedResultId === result.id}
                            handleClick={() => this.handleResultSelect(result.id)}
                          />
                        );
                      })
                    }
                  </ul>
                )}
              </form>
            }
            {
              this.state.screen === 'create' && this.state.selectedResultId !== null && (
              <div className={styles.createCardRow}>
                {/*
                <button 
                  className={[styles.btn, styles.btnCreateCard].join(' ')} 
                  onClick={this.state.cardType == 'trait' ? this.loadPublicCards : this.handleCreate}
                  type='button'
                >{this.state.cardType == 'trait' ? 'next' : I18n.t('react.card_maker.create')}</button>
                */}
                <button 
                  className={[styles.btn, styles.btnCreateCard].join(' ')} 
                  onClick={() => this.handleCreate('trait')}
                  type='button'
                >{I18n.t('react.card_maker.create')}</button>
              </div>
            )}
            {
              this.state.screen === 'start' && (
                <ul className={styles.cardTemplates}>
                  { this.templateItem('title') }
                  { this.templateItem('key')   }
                  { this.templateItem('desc')  }
                  { this.templateItem('vocab') }
                </ul>
              )
            }
            {
              this.state.screen === 'selectCard' &&
              <ul className={styles.speciesSearchPublicCards}>{
                this.state.cardsForResult.map((card) => {
                  return (
                    <li className={styles.speciesSearchPublicCard} key={card.id}>
                      <img src={loResCardImageUrl(card)} /> 
                    </li>
                  );
                })
              }</ul>
            }
          </div>
        </div>
      </CloseButtonModal>
    )
  }
}

export default SpeciesSearchLightbox;

