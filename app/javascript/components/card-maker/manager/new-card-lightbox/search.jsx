import React from 'react'

import SpeciesSearchResult from './species-search-result'
import {cardMakerUrl} from 'lib/card-maker/url-helper'

import styles from 'stylesheets/card_maker/new_card_lightbox'

const cleanState = {
  results: [],
  view: 'preQuery',
  query: '',
  selectedResultId: null
};

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = cleanState;
    this.reqCount = 0;
  }

  resultsContent = () => {
    let inner;

    if (this.state.view === 'inFlight') {
      inner = <i className='fa fa-spin fa-spinner fa-lg' />
    } else if (this.state.view === 'results') {
      inner = (
        <ul className={styles.searchResults}>
          {this.state.results.map((result, i) => {
            return (
              <SpeciesSearchResult
                key={i}
                sciName={result.title}
                id={result.id}
                commonName={result.commonName}
                thumbUrl={result.thumbUrl}
                selected={this.state.selectedResultId === result.id}
                handleClick={() => this.setState({ selectedResultId: result.id })}
              />
            );
          })}
        </ul>
      );
    }

    if (inner) {
      return (
        <div className={styles.searchResultContain}>
          {inner}
        </div>
      );
    }

    return null;
  }

  handleQuerySubmit = (e) => {
    const query = this.state.query
        , reqNum = ++this.reqCount // increment reqCount whether or not query is blank to invalidate previous query if it exists
        , that = this
        ;

    e.preventDefault();
    $(this.inputNode).blur();

    if (query && query.length) {
      this.setState(() => {
        return {
          view: 'inFlight',
          selectedResultId: null,
        }
      });

      $.getJSON(cardMakerUrl('taxon_search/' + query), function(data) {
        if (reqNum === that.reqCount && that.state.view === 'inFlight') {
          that.setState({
            view: 'results',
            results: data,
            selectedResultId: data.length ? data[0].id : null
          });
        }
      });
    } else {
      this.setState({
        view: 'preQuery'
      });
    }
  }

  render() {
    return (
      <form 
        action="#" 
        onSubmit={this.handleQuerySubmit}
      >
        <div className={styles.searchField}>
          <input
            onInput={(e) => this.setState({ query: e.target.value })}
            name='query'
            type='text'
            placeholder={'enter a species or taxon name'}
            value={this.state.query}
            ref={node => this.inputNode = node}
          />
          <button className={styles.speciesSearchInputBtn}>
            <i className='fa fa-lg fa-search' />
          </button>
        </div>
        {this.resultsContent()}
      </form>
    )
  }
}

export default Search

