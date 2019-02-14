import React from 'react'
import CloseButtonModal from 'components/shared/close-button-modal'
import ReactAutocomplete from 'react-autocomplete'
import {cardMakerUrl} from 'lib/card-maker/url-helper'
import styles from 'stylesheets/card_maker/card_manager'

var noUserId = -1
  , minQueryLen = 3
  , cleanState = {
      flashMsg: '',
      owner: {},
      users: [],
      selectedUserId: noUserId,
      selectedUserName: '',
      showFlash: false,
      typeaheadLoading: false,
      typeaheadOptions: [],
      typeaheadValue: '',
    }
  ;

class DeckUsersLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = cleanState
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
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

  addSelectedUser = () => {
    if (this.state.selectedUserId > 0) {
      $.post({
        url: cardMakerUrl(`decks/${this.props.deck.id}/users`),
        data: this.state.selectedUserId.toString(),
        dataType: 'text',
        success: () => {
          let msg = I18n.t('react.card_maker.added_user', { userName: this.state.selectedUserName })
          this.showFlash(msg);
          this.reload();
        }
      });
    }
  }

  removeUser = (id, name) => {
    if (id && id > 0) {
      let ok = confirm(I18n.t('react.card_maker.are_you_sure_remove_user', {
        userName: name 
      }));

      if (ok) {
        $.ajax({
          url: cardMakerUrl(`decks/${this.props.deck.id}/users/${id}`),
          type: 'DELETE',
          success: () => {
            let msg = I18n.t('react.card_maker.removed_user', { userName: name });
            this.showFlash(msg);
            this.reload(); 
          }
        });
      }
    }
  }

  showFlash = (msg) => {
    let that = this;

    if (that.timeout) {
      clearTimeout(that.timeout);
    }

    that.setState({
      showFlash: true,
      flashMsg: msg,
    }, () => {
      that.timeout = setTimeout(() => {
        that.setState({
          showFlash: false
        });
      }, 1000);
    })
  }

  render() {
    let flashClasses = [styles.lightboxFlash];

    if (!this.state.showFlash) {
      flashClasses.push(styles.isLightboxFlashHidden);
    }

    return (
      <CloseButtonModal
        isOpen={this.props.isOpen}
        onAfterOpen={this.handleAfterOpen}
        onRequestClose={this.handleRequestClose}
        contentLabel={I18n.t('react.card_maker.manage_deck_users')}
        parentSelector={() => {return document.body }}
        bodyOpenClassName='noscroll'
        className={[styles.lNewLightbox, styles.lNewLightboxDeckUsers].join(' ')}
        overlayClassName={`fixed-center-wrap disable-overlay`}
      >
        <div className={styles.deckUsersHead}>
          <h2>Manage users for deck <strong>{this.props.deck.name}</strong></h2>
          <h2>{I18n.t('react.card_maker.owner_user', {
            userName: this.state.owner.userName 
          })}</h2>
        </div>
        <div className={flashClasses.join(' ')}>{this.state.flashMsg}</div>
        <div className={styles.lNewCol}>
          <div className={styles.lightboxDeckUsersList}>
            <h3 className={styles.deckUsersTitle}>{I18n.t('react.card_maker.users')}</h3>
            <ul className={styles.deckUsers}>
              { this.state.users.map((u) => {
                return (
                  <li key={u.id} className={styles.deckUser}>
                    <span className={styles.deckUserName}>{u.userName}</span>
                    <i onClick={ () => this.removeUser(u.id, u.userName) } 
                      className={`fa fa-lg fa-minus-circle ${styles.deckUserMinus}`}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className={styles.lNewCol}>
          <ReactAutocomplete
            items={this.state.typeaheadOptions}
            getItemValue={item => item.label}
            onChange={e => {
              let query = e.target.value;
              this.setState({
                typeaheadValue: query
              });

              if (query.length >= minQueryLen) {
                $.getJSON('/users/typeahead/' + query, (data) => {
                  this.setState({
                    typeaheadOptions: data
                  });
                });
              } else {
                this.setState({
                  typeaheadOptions: []
                });
              }
            }}
            onSelect={(val, item) => {
              this.setState({
                typeaheadValue: val,
                selectedUserId: item.id,
                selectedUserName: val,
              });
            }}
            renderItem={(item, isHighlighted) =>
              <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                {item.label}
              </div>
            }
            renderInput={(props) =>
              <input 
                type='text' 
                className={[styles.newInput, styles.newInputTxt].join(' ')} {...props}
                placeholder={I18n.t('react.card_maker.start_typing_user_name')}
              />
            }
            renderMenu={function(items, value, style)  {
              return <div style={{ ...style, ...this.menuStyle, zIndex: 10 }} children={items}/>
            }}
            value={this.state.typeaheadValue}
            wrapperStyle={{}}
          />
          <div>
            <button className={styles.createBtn} onClick={this.addSelectedUser}>
              {I18n.t('react.card_maker.add_user')}
            </button>
          </div>
        </div>
      </CloseButtonModal>
    );
  }
}
export default DeckUsersLightbox
