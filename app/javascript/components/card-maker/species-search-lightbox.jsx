import React from 'react'
import ReactModal from 'react-modal'

import SpeciesSearchResult from './species-search-result'

class SpeciesSearchLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inFlight: false,
      results: null,
      expandedId: null,
    }
    this.reqCount = 0;
  }

  handleInput = (event) => {
    const query = event.target.value
        , reqNum = ++this.reqCount
        , that = this
        ;

    $.getJSON('/card_maker_ajax/taxon_search/' + query, function(data) {
      if (reqNum === that.reqCount) {
        that.setState(() => {
          return {
            inFlight: false,
            results: data.results,
          }
        })
      }
    });

    this.setState(() => {
      return {
        inFlight: true,
        results: null,
      }
    })
  }

  handleExpandResult = (id) => {
    this.setState(() => {
      return {
        expandedId: id,
      }
    });
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        contentLabel='Species search'
        parentSelector={() => {return document.getElementById('Page')}}
        overlayClassName='fixed-center-wrap'
        className='species-search lightbox'
        bodyOpenClassName='noscroll'
      >
        <div className='field-label lightbox-label'>Search</div>
        <div className='search-area'>
          <input
            className='search-field'
            type='text'
            placeholder='Search for a species or taxon'
            onInput={this.handleInput}
          />
        </div>
        {(this.state.inFlight || this.state.results != null) &&
          (<div className='search-results-wrap'>
            {this.state.results != null &&
              (<div className='result-count-wrap'>
                <div className='result-count'>
                  {this.state.results.length + ' results'}
                </div>
              </div>)
            }
            <ul className='search-results'>
              {this.state.inFlight ?
                (<li className='search-spin'>
                  <i className='fa fa-spinner fa-spin fa-3x' />
                </li>) :
                this.state.results.map((result, i) => {
                  return (
                    <SpeciesSearchResult
                      key={i}
                      sciName={result.title}
                      id={result.id}
                      expanded={this.state.expandedId === result.id}
                      handleClick={() => this.handleExpandResult(result.id)}
                    />
                  )
                })
              }
            </ul>
          </div>)
        }
        <div className='create-menu'>
          <div className='deck-select-wrap'>
            <div className='deck-select-label'>Save card to a deck:</div>
          </div>
          <div className='create-btn-wrap disabled'>
            <div className='btn-disable'></div>
            <div className='create-btn-label'>Create a card from selection</div>
            <div className='create-btn-body'>
              <i className='icon-new-card' />
            </div>
          </div>
        </div>
      </ReactModal>
    )
  }
}

/*
.species-search.lightbox
  .field-label.lightbox-label Search
  .search-area
    %input.search-field{:type => :text, :placeholder => "Search for a species or taxon"}
  .search-results-wrap.hidden
    .result-count-wrap
      .result-count.hidden 0 results
    %ul.search-results
  .create-menu.hidden
    .deck-select-wrap
      .deck-select-label Save card to a deck:
    .create-btn-wrap.disabled
      .btn-disable
      .create-btn-label Create a card from selection
      .create-btn-body
        %i.icon-new-card
*/

export default SpeciesSearchLightbox;
