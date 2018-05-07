import React from 'react'
import ReactModal from 'react-modal'

import SpeciesSearchResult from './species-search-result'
import UserResourceFilter from './user-resource-filter'
import AdjustsForScrollbarContainer from './adjusts-for-scrollbar-container'
import {cardMakerUrl} from 'lib/card-maker/url-helper'

import bioCard from 'images/card_maker/sample_cards/biodiversity.png'
import styles from 'stylesheets/card_maker/card_manager'

const cleanState = {
        inFlight: false,
        results: null,
        selectedId: null,
      }
    , resultsPerRow = 3
    ;

class SpeciesSearch extends React.Component {
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
    } else if (!this.state.results) {
      result = (
        <div className={styles.speciesResultCount}>
          {I18n.t('react.card_maker.press_enter_search')}
        </div>
      );
    }

    return result ? (
      <div className={styles.lSpinCountRow}>{result}</div>
    ) : null;
  }

  render() {
    return (
      <div className={styles.speciesSearch}>
        <div className={styles.speciesSearchCard}>
          <img src={bioCard} />
          <div>{I18n.t('react.card_maker.bio_card')}</div>
        </div>
        <div className={styles.speciesSearchForm}>
          <form 
            action="#" 
            onSubmit={this.handleQuerySubmit} 
          >
            <input
              className={styles.speciesSearchInput}
              ref={(node) => this.inputNode = node}
              onInput={(e) => this.setState({ query: e.target.value })}
              name='query'
              type='text'
              placeholder={I18n.t('react.card_maker.search_species_taxon')}
            />
            {this.spinCountContent()}
            {this.state.results != null && (
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
                        handleCreate={this.handleCreateCard}
                      />
                    );
                  })
                }
              </ul>
            )}
          </form>
        </div>
        {false && this.state.results != null && this.state.results.length > 0 && (
          <div>
            <div className={styles.lNewCol}>
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
                            handleCreate={this.handleCreateCard}
                          />
                        );
                      })
                    }
                  </ul>
                </div>
              </div>
            </div>
            <div className={styles.lNewCol}>
              <div>
                {this.props.deckFilterItems && this.props.deckFilterItems.length > 1 &&
                  <div className='deck-select-wrap'>
                    <div className={styles.newInputLabel}>{I18n.t('react.card_maker.select_deck')}</div>
                  </div>
                }
                <button className={styles.createBtn} onClick={this.handleCreateCard}>
                  {I18n.t('react.card_maker.create_card')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default SpeciesSearch;
