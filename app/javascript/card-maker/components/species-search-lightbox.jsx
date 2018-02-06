import React from 'react'
import ReactModal from 'react-modal'

import SpeciesSearchResult from './species-search-result'
import UserResourceFilter from './user-resource-filter'
import AdjustsForScrollbarContainer from './adjusts-for-scrollbar-container'
import {cardMakerUrl} from 'lib/card-maker/url-helper'
import styles from 'stylesheets/card_maker/card_manager'

const cleanState = {
        inFlight: false,
        results: null,
        selectedId: null,
      }
    , resultsPerRow = 3
    ;

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
        selectedId: id,
      }
    });
  }

  handleRequestClose = () => {
    this.resetState();
    this.props.handleClose();
  }

  handleCreateCard = () => {
    this.props.handleCreateCard(this.state.selectedId);
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
          selectedId: null,
        }
      });

      $.getJSON(cardMakerUrl('taxon_search/' + query), function(data) {
        if (reqNum === that.reqCount) {
          that.setState({
            inFlight: false,
            results: data,
            selectedId: data.length ? data[0].id : null
          });
        }
      });

      this.setState({
        inFlight: true,
        results: null,
      });
    } else {
      this.resetState();
    }
  }

  spinCountContent = () => {
    let result = null;

    if (this.state.inFlight) {
      result = (
        <div className={styles.speciesSearchSpin}>
          <i className={'fa fa-spinner fa-spin fa-lg'} />
        </div>
      );
    } else {
      let text;

      if (this.state.results) {
        text = I18n.t('react.card_maker.n_results', { count: this.state.results.length });
      } else {
        text = I18n.t('react.card_maker.press_enter_search');
      }

      result = (
        <div className={styles.speciesResultCount}>
           {text}
        </div>
      );
    }

    return result;
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        contentLabel={I18n.t('react.card_maker.species_search')}
        parentSelector={() => {return document.getElementById('Page')}}
        overlayClassName='fixed-center-wrap disable-overlay'
        className={styles.lNewCardLightbox}
        bodyOpenClassName='noscroll'
        onRequestClose={this.handleRequestClose}
      >
        <form action="#" onSubmit={this.handleQuerySubmit}>
          <input
            className={styles.speciesSearchInput}
            ref={(node) => this.inputNode = node}
            onInput={(e) => this.setState({ query: e.target.value })}
            name='query'
            type='text'
            placeholder={I18n.t('react.card_maker.search_species_taxon')}
          />
        </form>
        <div className={styles.lSpinCountRow}>
          {this.spinCountContent()}
        </div>
        {this.state.results != null && this.state.results.length > 0 && (
          <div>
            <div className={styles.lSpeciesSearchCol}>
              <div>
                <div className='search-results-wrap'>
                  <ul className={styles.speciesSearchResults}>
                    {
                      this.state.results.map((result, i) => {
                        return (
                          <SpeciesSearchResult
                            key={i}
                            sciName={result.title}
                            id={result.id}
                            commonName={result.commonName}
                            thumbUrl={result.thumbUrl}
                            selected={this.state.selectedId === result.id}
                            handleClick={() => this.handleResultSelect(result.id)}
                          />
                        );
                      })
                    }
                  </ul>
                </div>
              </div>
            </div>
            <div className={styles.lSpeciesSearchCol}>
              <div>
                <div className='deck-select-wrap'>
                  <div className={styles.deckSelectLabel}>{I18n.t('react.card_maker.select_deck')}</div>
                  <UserResourceFilter
                    selected={true}
                    count={this.props.deckFilterItems.length - 1}
                    filterItems={this.props.deckFilterItems}
                    selectedId={this.props.selectedDeckId}
                    handleSelect={this.props.handleDeckSelect}
                  />
                </div>
                <button className={styles.createCardBtn} onClick={this.handleCreateCard}>
                  {I18n.t('react.card_maker.create_card')}
                </button>
              </div>
            </div>
          </div>
        )}
      </ReactModal>
    )
  }
}

export default SpeciesSearchLightbox;
