import React from 'react'

import styles from 'stylesheets/card_maker/new_card_lightbox'

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      view: 'preQuery'
    }
  }

  handleQuerySubmit = (e) => {
    e.preventDefault();
    this.setState({
      view: 'inFlight'
    });
  }

  resultsContent = () => {
    let inner;

    if (this.state.view === 'inFlight') {
      inner = <i className='fa fa-spin fa-spinner fa-lg' />
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

