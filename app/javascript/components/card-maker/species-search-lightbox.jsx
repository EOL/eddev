import React from 'react'
import ReactModal from 'react-modal'

import SpeciesSearchResult from './species-search-result'
import UserResourceFilter from './user-resource-filter'
import AdjustsForScrollbarContainer from './adjusts-for-scrollbar-container'
import {cardMakerUrl} from 'lib/card-maker/url-helper'

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

  handleInput = (event) => {
    const query = event.target.value
        , reqNum = ++this.reqCount // increment reqCount whether or not query is blank to invalidate previous query if it exists
        , that = this
        ;

    if (query) {
      this.setState(() => {
        return {
          selectedId: null,
        }
      });

      $.getJSON(cardMakerUrl('taxon_search/' + query), function(data) {
        if (reqNum === that.reqCount) {
          that.setState(() => {
            return {
              inFlight: false,
              results: data.results,
            }
          })
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

  handleExpandResult = (id) => {
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

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        contentLabel={I18n.t('react.card_maker.species_search')}
        parentSelector={() => {return document.getElementById('Page')}}
        overlayClassName='fixed-center-wrap disable-overlay'
        className='species-search lightbox'
        bodyOpenClassName='noscroll'
        onRequestClose={this.handleRequestClose}
      >
        <div className='field-label lightbox-label'>{I18n.t('react.card_maker.search')}</div>
        <div className='search-area'>
          <input
            className='search-field'
            type='text'
            placeholder={I18n.t('react.card_maker.search_species_taxon')}
            onInput={this.handleInput}
          />
        </div>
        {(this.state.inFlight || this.state.results != null) && (
          <div className='search-results-wrap'>
            <div className='result-count-wrap'>
            {this.state.results != null &&
              (<div className='result-count'>
                  {this.state.results.length + ' results'}
                </div>)
            }
            </div>
            {this.state.inFlight ? (
              <ul className='search-results'>
                <li className='search-spin'>
                  <i className='fa fa-spinner fa-spin fa-3x' />
                </li>
              </ul>
            ) : (
              <AdjustsForScrollbarContainer
                className='search-results'
                itemsPerRow={resultsPerRow}
              >
                {this.state.results.map((result, i) => {
                  return (
                    <SpeciesSearchResult
                      key={i}
                      sciName={result.title}
                      id={result.id}
                      expanded={this.state.selectedId === result.id}
                      handleClick={() => this.handleExpandResult(result.id)}
                    />
                  )
                })}
              </AdjustsForScrollbarContainer>
            )}
          </div>
        )}
        {this.state.results !== null && this.state.results.length > 0 &&
          (<div className='create-menu'>
            <div className='deck-select-wrap'>
              <div className='deck-select-label'>{I18n.t('react.card_maker.save_card_to_deck')}</div>
              <UserResourceFilter
                selected={true}
                iconClass='icon-deck'
                count={this.props.deckFilterItems.length - 1}
                filterItems={this.props.deckFilterItems}
                selectedId={this.props.selectedDeckId}
                handleSelect={this.props.handleDeckSelect}
              />
            </div>
            <div
              className={'create-btn-wrap' + (this.state.selectedId === null ? ' disabled' : '')}
              onClick={this.handleCreateCard}
            >
              <div className='btn-disable'></div>
              <div className='create-btn-label'>{I18n.t('react.card_maker.create_card_from_selection')}</div>
              <div className='create-btn-body'>
                <i className='icon-new-card' />
              </div>
            </div>
          </div>)
        }

      </ReactModal>
    )
  }
}

export default SpeciesSearchLightbox;
