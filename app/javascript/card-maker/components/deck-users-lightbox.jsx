import React from 'react'
import ReactModal from 'react-modal'
import {cardMakerUrl} from 'lib/card-maker/url-helper'
import styles from 'stylesheets/card_maker/card_manager'

var noUserId = -1
  , cleanState = {
      userOptions: [],
      owner: {},
      users: [],
      selectedUserId: noUserId
    }
  ;


class DeckUsersLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = cleanState
  }

  handleAfterOpen = () => {
    this.reload();
  }

  reload = () => {
    $.getJSON('/users/list', (userOptions) => {
      this.setState({
        userOptions: userOptions
      });
    });

    $.getJSON(cardMakerUrl(`decks/${this.props.deck.id}/users`), (res) => {
      this.setState({
        owner: res.owner,
        users: res.users
      })
    });
  }

  handleRequestClose = () => {
    this.setState(cleanState);
    this.props.handleRequestClose();
  }

  handleSelectChange = (e) => {
    this.setState({
      selectedUserId: e.target.value
    });
  }

  addSelectedUser = () => {
    if (this.state.selectedUserId > 0) {
      $.post({
        url: cardMakerUrl(`decks/${this.props.deck.id}/users`),
        data: this.state.selectedUserId,
        dataType: 'text',
        success: this.reload
      });
    }
  }

  removeUser = (id) => {
    if (id && id > 0) {
      $.ajax({
        url: cardMakerUrl(`decks/${this.props.deck.id}/users/${id}`),
        type: 'DELETE',
        success: this.reload
      });
    }
  }

  userOptions = () => {
    return [<option key={noUserId} value={noUserId}>-----</option>].concat(
      this.state.userOptions.map((option) => {
        return (
          <option key={option.id} value={option.id}>{option.userName}</option>
        );
      })
    );
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onAfterOpen={this.handleAfterOpen}
        onRequestClose={this.handleRequestClose}
        contentLabel={I18n.t('react.card_maker.manage_deck_users')}
        parentSelector={() => {return document.getElementById('Page')}}
        overlayClassName='fixed-center-wrap disable-overlay'
      >
        <h2>Manage users for deck <strong>{this.props.deck.name}</strong></h2>
        <div>Owner: {this.state.owner.userName}</div>
        <div>Users:</div>
        <ul>
          { this.state.users.map((u) => {
            return (
              <li key={u.id}>
                {u.userName}&nbsp;
                <i onClick={ () => this.removeUser(u.id) } 
                  className={`fa fa-lg fa-minus-circle ${styles.deckUserMinus}`}
                />
              </li>
            );
          })}
        </ul>
        <select 
          name='user_id'
          onChange={this.handleSelectChange}
          value={this.state.selectedUserId}
        >
          {this.userOptions()}
        </select>
        <input onClick={this.addSelectedUser} type="submit" value="add user"/>
      </ReactModal>
    );
  }
}
export default DeckUsersLightbox
