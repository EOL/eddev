import React from 'react'

import UserResources from './user-resources'
import NewResourceBtn from './new-resource-btn'
import UserResourceFilter from './user-resource-filter'

import ladybugIcon from 'images/card_maker/icons/ladybug.png'
import eolHdrIcon from 'images/card_maker/icons/eol_logo_sub_hdr.png'
import newCardIcon from 'images/card_maker/icons/new_card.png'
import managerLogo from 'images/card_maker/icons/card_manager_logo.png'
import newDeckIcon from 'images/card_maker/icons/new_deck.png'

class CardManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      decks: [],
      selectedFilter: 'cards'
    }
  }

  componentDidMount() {
    var that = this;

    $.ajax({
      url: 'card_maker_ajax/decks',
      method: 'GET',
      success: (decks) => {
        $.ajax({
          url: 'card_maker_ajax/card_summaries',
          method: 'GET',
          success: (cards) => {
            that.setState((prevState, props) => {
              return {
                cards: cards,
                decks: decks,
              }
            });
          }
        });
      }
    });
  }

  newCardClick() {
    alert('new card clicked');
  }

  deckFilterItems() {
    const items = this.state.decks.map((deck) => {
      return {
        name: deck.name,
        id: deck.id,
        count: deck.cardIds.length
      }
    });
    items.unshift({
      name: 'All decks',
      id: -1,
      count: this.state.decks.length
    });
    return items;
  }

  cardFilterItems() {
    return [{
      name: 'All cards'
    }];
  }

  handleDeckFilterSelect(id) {

  }

  handleDeckFilterClick = () => {
    this.setState((prevState, props) => {
      return {
        selectedFilter: 'decks',
      }
    });
  }

  handleCardFilterClick = () => {
    this.setState((prevState, props) => {
      return {
        selectedFilter: 'cards',
      }
    });
  }

  render() {
    return (
      <div id='CardManagerWrap'>
        <div className='hdr-spacer red'></div>
        <div id='CardManager' className='card-manager card-screen'>
          <div className='screen-inner manager-inner'>
            <div className='welcome-block maker-welcome-block'>
              <img src={ladybugIcon} className='ladybug' />
              <h3 className='welcome-txt'>
                <span className='big-letter'>W</span>
                <span>elcome to the </span>
                <img src={eolHdrIcon} className='eol_logo' />
                <span> Card Manager.</span>
              </h3>
            </div>
            <div className="manager-ctrls">
              <div className="new-resource-btns">
                <NewResourceBtn
                  icon={newCardIcon}
                  id='NewCard'
                  text='Create a card'
                  btnClass='new-card-btn'
                  handleClick={this.newCardClick}
                />
                <img src={managerLogo} className='manager-logo' id='ManagerLogo' />
                <NewResourceBtn
                  icon={newDeckIcon}
                  id='NewDeck'
                  text='Create a deck'
                  btnClass='new-deck-btn'
                  handleClick={this.newCardClick}
                />
              </div>
              <div className='filters'>
                <UserResourceFilter
                  selected={this.state.selectedFilter === 'cards'}
                  iconClass='icon-card'
                  first={true}
                  count={this.state.cards.length}
                  handleSelect={this.handleDeckFilterSelect}
                  handleClick={this.handleCardFilterClick}
                  filterItems={this.cardFilterItems()}
                />
                <UserResourceFilter
                  selected={this.state.selectedFilter === 'decks'}
                  iconClass='icon-deck'
                  count={this.state.decks.length}
                  filterItems={this.deckFilterItems()}
                  handleSelect={this.handleDeckFilterSelect}
                  handleClick={this.handleDeckFilterClick}
                  handleMenuOpenClick={this.handleDeckMenuOpenClick}
                />
              </div>
            </div>
            <UserResources cards={this.state.cards}/>
          </div>
        </div>
      </div>
    )
  }
}

export default CardManager
