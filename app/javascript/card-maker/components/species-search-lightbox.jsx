import React from 'react'

//import SpeciesSearch from './species-search'
import CloseButtonModal from './close-button-modal'
import UserResourceFilter from './user-resource-filter'
import SpeciesSearchResult from './species-search-result'
import {cardMakerUrl} from 'lib/card-maker/url-helper'

import traitCard from 'images/card_maker/sample_cards/trait.png'
import titleCard from 'images/card_maker/sample_cards/title.png'
import keyCard from 'images/card_maker/sample_cards/key.png'

import styles from 'stylesheets/card_maker/card_manager'

var cleanState = {
  cardType: 'trait',
  searchResults: null,
  selectedResultId: null,
  screen: 'start'
};

class SpeciesSearchLightbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = cleanState;
    this.reqCount = 0;
  }

  handleRequestClose = () => {
    this.props.handleClose();
    this.setState(cleanState);
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

  handleCreate = () => {
    var params = this.state.cardType === 'trait' ? 
          { speciesId: this.state.selectedResultId } :
          null
      ;

    this.props.handleCreate(this.state.cardType, params);
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
      this.state.cardType === 'trait' &&
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

  templateItem = (options) => {
    return (
      <li className={styles.cardTemplate}>
        <img src={options.img} />
        <div>{I18n.t('react.card_maker.' + options.nameKey)}</div>
        <button
          className={[styles.createBtn, styles.createBtnTempl].join(' ')}
          type='button'
          onClick={() => this.setState({ screen: 'create', cardType: options.template })}
        >{I18n.t('react.card_maker.select')}</button>
      </li>
    );
  }

  getExampleCard = () => {
    var img = ''
      , txtKey = null
      ;

    if (
      this.state.screen === 'start' || 
      this.state.screen === 'inFlight' || 
      this.state.cardType === 'trait'
    ) {
      img = traitCard;  
      txtKey = 'trait_card';
    } else if (this.state.cardType === 'title') {
      img = titleCard;
      txtKey = 'title_card';
    } else if (this.state.cardType === 'key') {
      img = keyCard;
      txtKey = 'key_card';
    }

    return {
      img: img,
      txtKey: txtKey
    };
  }

  render() {
    var exampleCard = this.getExampleCard();
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
          <div className={styles.lSpeciesSearchLeft}>
            <img className={styles.speciesSearchCardImg} src={exampleCard.img} />
            <div className={styles.speciesSearchCardLabel}>{I18n.t('react.card_maker.' + exampleCard.txtKey)}</div>
            {
              this.state.screen !== 'start' && 
              <button 
                type='button' 
                className={[styles.btn, styles.btnBack].join(' ')}
                onClick={() => this.setState({ screen: 'start' })}
              ><i className='fa fa-2x fa-arrow-left' /></button>
            }
          </div>
          <div className={styles.speciesSearchForm}>
            {
              (this.state.screen === 'start' || this.state.screen === 'inFlight' || this.state.cardType === 'trait') &&
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
              this.state.screen === 'create' && (this.state.cardType !== 'trait' || this.state.selectedResultId !== null) && (
              <div className={styles.createCardRow}>
                <div className={styles.deckSelectLabel}>select a deck (optional):</div>
                <UserResourceFilter
                  topClass={styles.newInputSelectCard}
                  anchorClass={styles.newInputAnchorCard}
                  itemsClass={styles.newInputSelectItemsCard}
                  count={this.props.deckFilterItems.length - 1}
                  filterItems={this.props.deckFilterItems}
                  selectedId={this.props.selectedDeckId}
                  handleSelect={this.props.handleDeckSelect}
                />
                <button 
                  className={[styles.btn, styles.btnCreateCard].join(' ')} 
                  onClick={this.handleCreate}
                  type='button'
                >create</button>
              </div>
            )}
            {
              this.state.screen === 'start' && (
                <ul className={styles.cardTemplates}>
                  {
                    this.templateItem({
                      img: titleCard,
                      nameKey: 'title_card',
                      template: 'title',
                    })
                  }
                  {
                    this.templateItem({
                      img: keyCard,
                      nameKey: 'key_card',
                      template: 'key'
                    })
                  }
                </ul>
              )
            }
          </div>
        </div>
      </CloseButtonModal>
    )
  }
}

export default SpeciesSearchLightbox;
