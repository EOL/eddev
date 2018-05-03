import React from 'react'
import ReactModal from 'react-modal'
import ReactAutocomplete from 'react-autocomplete'
import {cardMakerUrl} from 'lib/card-maker/url-helper'
import styles from 'stylesheets/card_maker/card_manager'

var noUserId = -1
  , cleanState = {
      owner: {},
      users: [],
      selectedUserId: noUserId,
      typeaheadLoading: false,
      typeaheadOptions: [],
      typeaheadValue: ''
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
    console.log('user id', this.state.selectedUserId);
    if (this.state.selectedUserId > 0) {
      $.post({
        url: cardMakerUrl(`decks/${this.props.deck.id}/users`),
        data: this.state.selectedUserId.toString(),
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

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onAfterOpen={this.handleAfterOpen}
        onRequestClose={this.handleRequestClose}
        contentLabel={I18n.t('react.card_maker.manage_deck_users')}
        parentSelector={() => {return document.getElementById('Page')}}
        bodyOpenClassName='noscroll'
        className={`${styles.lightbox} ${styles.lightboxDeckUsers}`}
        overlayClassName={`fixed-center-wrap disable-overlay`}
      >
        <h2>Manage users for deck <strong>{this.props.deck.name}</strong></h2>
        <h2>Owner: {this.state.owner.userName}</h2>
        <div className={styles.lightboxDeckUsersList}>
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
        </div>
        <ReactAutocomplete
          items={this.state.typeaheadOptions}
          getItemValue={item => item.label}
          onChange={e => {
            let query = e.target.value;
            this.setState({
              typeaheadValue: query
            });

            if (query.length) {
              $.getJSON('/users/typeahead/' + query, (data) => {
                this.setState({
                  typeaheadOptions: data
                });
              });
            }
          }}
          onSelect={(val, item) => {
            this.setState({
              typeaheadValue: val,
              selectedUserId: item.id
            });
          }}
          renderItem={(item, isHighlighted) =>
            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
              {item.label}
            </div>
          }
          value={this.state.typeaheadValue}
        />
        <input onClick={this.addSelectedUser} type="submit" value="add user"/>
      </ReactModal>
    );
  }
}
export default DeckUsersLightbox
