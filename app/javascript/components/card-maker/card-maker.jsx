import React from 'react'

import CardManager from './card-manager'
import CardEditor from './card-editor'
import {cardMakerUrl} from 'lib/card-maker/url-helper'
import newImmutableCardInstance from 'lib/card-maker/immutable-card'


import eolLogoHdr from 'images/card_maker/icons/eol_logo_hdr.png'

class CardMaker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'manager'
    }
  }

  componentDidMount() {
    window.addEventListener('popstate', (event) => {
      console.log('pop', event);
      this.handleHistoryStateChange(event.state);
    });
  }

  handleHistoryStateChange = (state) => {
    if (state && state.editorCardId) {
      this.loadCard(state.editorCardId, (err, card) => {
        if (err) throw err; // TODO: graceful handling
        this.setState({
          screen: 'editor',
          editorCard: card,
        });
      });
    } else {
      this.setState({
        screen: 'manager'
      });
    }
  }

  loadCard(cardId, cb) {
    const cardUrl = cardMakerUrl('cards/' + cardId + '/json')
        , that = this
        ;

    $.ajax(cardUrl, {
      method: 'GET',
      success: (card) => {
        newImmutableCardInstance(card, cb)
      },
      error: cb
    });
  }

  handleEditCard = (cardId) => {
    const state = {
      editorCardId: cardId,
    }

    window.history.pushState(state, '');
    this.handleHistoryStateChange(state);
  }

  updateEditorCard = (mapFn, next) => {
    this.setState((prevState) => {
      return {
        editorCard: mapFn(prevState.editorCard),
      }
    });
  }

  handleEditorClose = () => {
    window.history.back();
  }

  screenComponent = () => {
    var component;

    if (this.state.screen === 'manager') {
      component = (
        <CardManager
          handleEditCard={this.handleEditCard}
        />
      )
    } else if (this.state.screen === 'editor') {
      component = (
        <CardEditor
          card={this.state.editorCard}
          updateCard={this.updateEditorCard}
          handleCloseClick={this.handleEditorClose}
        />
      )
    }

    return component;
  }

  render() {
    return (
      <div className='card-maker'>
        <div className='card-hdr-box'>
          <div className='card-hdr-inner'>
            <div className='left-blur-bg'></div>
            <h2 className='create-card-hdr hdr'>
              <img src={eolLogoHdr} className='hdr-logo' />
              <span> {I18n.t('react.card_maker.card_maker_title')}</span>
            </h2>
            <div className='right-blur-bg'></div>
          </div>
        </div>
        {this.screenComponent()}
      </div>
    )
  }
}

export default CardMaker
