import React from 'react'
import update from 'immutability-helper'

import UserResources from './user-resources'
import NewResourceBtn from './new-resource-btn'
import UserResourceFilter from './user-resource-filter'
import Card from './card'
import SpeciesSearchLightbox from './species-search-lightbox'
import NewDeckLightbox from './new-deck-lightbox'
import DeckUsersLightbox from './deck-users-lightbox'
import RenameDeckLightbox from './rename-deck-lightbox'
import CopyCardLightbox from './copy-card-lightbox'
import CopyDeckLightbox from './copy-deck-lightbox'
import DeckUrlLightbox from './deck-url-lightbox'
import Search from './search'
import {cardMakerUrl, deckUrl} from 'lib/card-maker/url-helper'
import Poller from 'lib/card-maker/poller'
import LeftRail from './manager-left-rail'
import Menu from 'components/shared/menu'
import DeckUpgradeNotice from './deck-upgrade-notice'
import DialogBox from 'components/shared/dialog-box'
import DeckDesc from './deck-desc'
import PrintLightbox from './print-lightbox'

import ladybugIcon from 'images/card_maker/icons/ladybug.png'
import eolHdrIcon from 'images/card_maker/icons/eol_logo_sub_hdr.png'
import newCardIcon from 'images/card_maker/icons/new_card.png'
import managerLogo from 'images/card_maker/icons/card_manager_logo.png'
import newDeckIcon from 'images/card_maker/icons/new_deck.png'
import iguanaBanner from 'images/card_maker/iguana_banner.png' /* TODO: convert to jpg */

import menuStyles from 'stylesheets/shared/menu'
import styles from 'stylesheets/card_maker/card_manager'

const pollIntervalMillis = 1000
    , specialCardOrder = {
        'title': 0,
        'desc': 1,
        'vocab': 2,
        'key': 3,
      }
    , modals = {
        deckUsers: 0,
        renameDeck: 1,
        newDeck: 2,
        speciesSearch: 3,
        copyCard: 4,
        copyDeck: 5,
        deckUrl: 6,
        needToUpgradeDeckNotice: 7,
        deckUpgradedNotice: 8,
        print: 9
      }
    , menus = {
        deck: 0,
        sort: 1
      }
    ;

class CardManager extends React.Component {
  constructor(props) {
    super(props);

    this.poller = new Poller();
    this.state = {
      speciesSearchDeckId: this.props.allCardsDeck.id,
      openModal: null,
      openMenu: null,
      upgradeDeckOnCopy: false,
      showDescInput: false,
      deckDescVal: null,
      cardSearchVal: '',
    }
  }

  componentDidMount() {
  }

  closeMenu = () => {
    this.setState({
      openMenu: null
    });
  }

  openMenu = (id) => {
    this.setState({
      openMenu: id
    });
  }

  assignCardDeck = (cardId, deckId) => {
    const that = this
      , url = cardMakerUrl('cards/' + cardId + '/deck_id')  
      ;

    that.props.showLoadingOverlay(null, null, (closeFn) => {
      const successFn = () => {
        that.props.reloadCurLibResources(closeFn);
      }

      if (deckId != null) {
        $.ajax(url, {
          method: 'PUT',
          data: deckId,
          contentType: 'text/plain',
          success: successFn,
        });
      } else {
        $.ajax(url, {
          method: 'DELETE',
          success: successFn,
        });
      }
    });
  }

  handleDestroyResource = (confirmMsg, resourceType, id) => {
    const that = this
        , shouldDestroy = confirm(confirmMsg)
        ;

    this.closeMenu('deck');

    if (!shouldDestroy) return;

    that.props.showLoadingOverlay(null, null, (closeFn) => {
      $.ajax({
        url: cardMakerUrl(resourceType + '/' + id),
        method: 'DELETE',
        success: () => {
          that.props.reloadCurLibResources(closeFn);
        }
      });
    });
  }

  handleDestroyCard = (id) => {
    this.handleDestroyResource(
      I18n.t('react.card_maker.are_you_sure_delete_card'),
      'cards',
      id
    );
  }

  handleDestroyDeck = (id) => {
    this.handleDestroyResource(
      I18n.t('react.card_maker.are_you_sure_delete_deck'),
      'decks',
      id
    );
  }

  handleSpeciesSearchOpen = () => {
    this.openModal(modals.speciesSearch, {
      speciesSearchDeckId: this.props.selectedDeck.id
    });
  }

  createCardUrl = (deckId) => {
    return (deckId !== this.props.allCardsDeck.id && deckId != null) ?
      cardMakerUrl('decks/' + deckId + '/cards') :
      cardMakerUrl('cards');
  }

  createOrCopyCard = (data, deckId) => {
    let that = this;

    that.props.showLoadingOverlay(null, null, (closeFn) => {
      $.ajax({
        url: this.createCardUrl(deckId),
        data: JSON.stringify(data),
        contentType: 'application/json',
        method: 'POST',
        success: (card) => {
          that.props.reloadCurLibResources(() => {
            closeFn();
            if (!data.copyFrom) {
              that.props.handleEditCard(card.id);
            }
          })
        },
        error: () => {
          alert(I18n.t('react.card_maker.unexpected_error_msg'));
          closeFn();
        }
      });
    });
  }

  handleCreateCard = (template, params) => {
    const data = {
            templateName: template,
            templateParams: params,
          }
        ;

    this.closeModal();
    this.createOrCopyCard(data, this.state.speciesSearchDeckId);
  }

  handleCopyCard = (deckId) => {
    this.closeModal();
    this.createOrCopyCard({ 
      copyFrom: this.state.copyCardId 
    }, deckId);
  }

  deckFilterItemsHelper = (noSelectionText, includeCount) => {
    const items = this.props.decks.map((deck) => {
      return {
        id: deck.id,
        name: deck.name,
        count: (includeCount ? deck.cardIds.length : null),
      }
    });
    items.unshift({
      id: this.props.allCardsDeck.id,
      name: noSelectionText,
      count: (includeCount ? this.props.decks.length : null),
    });
    return items;
  }

  deckFilterItems = () => {
    return this.deckFilterItemsHelper(I18n.t('react.card_maker.all_decks'), true);
  }

  deckFilterItemsForNewCard = () => {
    return this.deckFilterItemsHelper('—', false);
  }

  cardFilterItems() {
    return [{
      name: I18n.t('react.card_maker.all_cards')
    }];
  }

  handleDeckSelect = (deck) => {
    this.setState({
      showDescInput: false,
      cardSearchVal: '',
    });
    this.props.setSelectedDeck(deck);
  }

  selectedResources = () => {
    const that = this;

    let resources
      , resourceType = 'card'
      , unfilteredCards = that.props.cards
      ;
    
    if (that.props.selectedDeck !== that.props.allCardsDeck) {
      if (that.props.selectedDeck === that.props.unassignedCardsDeck) {
        unfilteredCards = unfilteredCards.filter((card) => {
          return !card.deck;
        });
      } else {
        unfilteredCards = unfilteredCards.filter((card) => {
          return card.deck === that.props.selectedDeck.id
        });
      }
    }

    resources = unfilteredCards.slice(0).sort((a, b) => {
      if (!this.props.sort.pure) {
        if (a.locale === I18n.locale && b.locale !== I18n.locale) {
          return -1;
        }

        if (a.locale !== I18n.locale && b.locale === I18n.locale) {
          return 1;
        }

        if (a.templateName === 'trait' && b.templateName !== 'trait') {
          return (this.regDeckSelected() ? 1 : -1);
        }

        if (a.templateName !== 'trait' && b.templateName === 'trait') {
          return (this.regDeckSelected() ? -1 : 1);
        }

        if (a.templateName !== 'trait' && b.templateName !== 'trait') {
          return (specialCardOrder[a.templateName] || -1) - (specialCardOrder[b.templateName] || -1);
        }
      }

      return this.props.sort.fn(a, b)
    });

    return {
      resources: resources,
      resourceType: resourceType,
    };
  }

  regDeckSelected = () => {
    return this.props.selectedDeck !== this.props.allCardsDeck && 
      this.props.selectedDeck !== this.props.unassignedCardsDeck;
  }

  searchFilterResources = (resources) => {
    let searchLower = this.state.cardSearchVal.toLowerCase();

    return resources.filter((card) => {
      return card.commonName.toLowerCase().includes(searchLower) ||
        card.sciName.toLowerCase().includes(searchLower);
    });
  }

  showDeck = (id, cb) => {
    var deck = this.props.decks.find((deck) => {
      return deck.id === id;
    });

    if (deck) {
      this.props.setSelectedDeck(deck, cb);
    } else if (cb) {
      cb();
    }
  }

  populateDeckFromCollection = (deckId, colId, cb) => {
    const that = this;

    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url: cardMakerUrl('decks/' + deckId + '/populateFromCollection'),
      data: JSON.stringify({
        colId: colId
      }),
      success: function(data) {
        that.pollCollectionJob(data.jobId, cb);
      },
      error: function() {
        cb(new Error('failed to populate deck'));
      }
    });
  }

  pollCollectionJob = (jobId, cb) => {
    const that = this;

    $.getJSON(cardMakerUrl('collectionJob/' + jobId + '/status'), function(data) {
      if (data.status === 'running') {
        setTimeout(that.pollCollectionJob.bind(null, jobId, cb), pollIntervalMillis);
      } else {
        cb();
      }
    });
  }

  handleRenameDeck = (name) => {
    const that = this;

    that.props.showLoadingOverlay(null, null, (closeFn) => {
      $.ajax({
        url: cardMakerUrl(`decks/${this.props.selectedDeck.id}/name`),
        method: 'POST',
        data: name,
        success: () => {
          that.props.reloadCurLibResources(closeFn);
        }
      });
    })
  }

  handleCopyDeck = (deckName) => {
    this.createDeckHelper(deckName, null, this.props.selectedDeck.id, this.state.upgradeDeckOnCopy); 
  }

  handleCreateDeck = (deckName, colId) => {
    this.createDeckHelper(deckName, colId, null, false);
  }

  createDeckHelper = (deckName, colId, copyFrom, upgrade) => {
    const that = this
        , showUpgradedNotice = upgrade
        , data = {
            name: deckName,
            copyFrom: copyFrom,
            upgradeTemplates: upgrade
          }
        ;

    that.props.showLoadingOverlay(null, null, (closeFn) => {
      $.ajax({
        url: cardMakerUrl('decks'),
        method: 'POST',
        data: JSON.stringify(data),
        success: (deck) => {
          const cb = (err) => { 
            if (err) {
              closeFn();
              alert(I18n.t('react.card_maker.unexpected_error_msg'));
            } else {
              that.props.setLibrary('user', () => {
                that.showDeck(deck.id, closeFn);

                if (showUpgradedNotice) {
                  that.openModal(modals.deckUpgradedNotice);
                }
              });
            }
          }

          if (colId != null && colId.length) {
            that.populateDeckFromCollection(deck.id, colId, cb);
          } else {
            cb();
          }
        },
        error: function(err) {
          var alertMsg = '';

          closeFn();

          if (err.status === 422 &&
              err.responseJSON &&
              err.responseJSON.errors
          ) { // Validation error
            alertMsg = err.responseJSON.errors.join('\n');
          } else {
            alertMsg = I18n.t('react.card_maker.unexpected_error_msg')
          }

          alert(alertMsg);
        }
      });
    });
  }

  handleSpeciesSearchDeckSelect = (id) => {
    this.setState({
      speciesSearchDeckId: id,
    });
  }

  openPrintOptions = () => {
    if (this.props.selectedDeck.needsUpgrade) {
      this.openModal(modals.needToUpgradeDeckNotice);
    } else {
      this.openModal(modals.print);
    }
  }

  makeDeckPdf = (cardBackId) => {
    const that = this;
    that.closeModal();
    that.props.showLoadingOverlay(
      I18n.t('react.card_maker.print_loading_msg'), 
      () => {
        this.cancelPolling();
        console.log('cancel printing');
      },
      (closeFn) => {
        $.ajax({
          url: cardMakerUrl('deck_pdfs'),
          data: JSON.stringify({
            deckId: that.props.selectedDeck.id,
            backId: cardBackId
          }),
          method: 'POST',
          success: (result) => {
            that.pollPdfJob(result.jobId, closeFn);
          }
        });
      }
    );
  }

  pollJob = (baseUrl, jobId, overlayCloseFn) => {
    const that = this;

    that.poller.start(
      cardMakerUrl(baseUrl + '/' + jobId + '/status'),
      (result) => {
        overlayCloseFn();
        window.open(cardMakerUrl(baseUrl + '/downloads/' + result.resultFileName));
      },
      () => {
        overlayCloseFn();
        alert(I18n.t('react.card_maker.unexpected_error_msg'));
      }
    );
  }

  pollPdfJob = (id, overlayCloseFn) => {
    this.pollJob('deck_pdfs', id, overlayCloseFn);
  }

  selectedResourceCount = (resourceResult) => {
    const count = resourceResult.resources.length;
    let i18nKey;

    if (resourceResult.resourceType === 'card') {
      i18nKey = 'react.card_maker.n_cards';
    } else if (resourceResult.resourceType === 'deck') {
      i18nKey = 'react.card_maker.n_decks';
    } else {
      throw new TypeError('Resource type invalid: ' 
        + resourceResult.resourceType);
    }

    return I18n.t(i18nKey, {
      count: count
    });
  }


  handleDescBtnClick = () => {
    this.closeMenu('deck');
    this.setState({
      showDescInput: true
    });
  }

  handleSetDescBtnClick = () => {
    const that = this
      , url = cardMakerUrl(
            'decks/' +
            this.props.selectedDeck.id +
            '/desc'
          )
        ;

    $.ajax({
      method: 'POST',
      data: that.state.deckDescVal,
      url: url,
      success: () => {
        that.props.showLoadingOverlay(null, null, (closeFn) => {
          that.closeAndClearDescInput(); 
          that.props.reloadCurLibResources(closeFn);
        });
      }
    });
  }

  handleDescInputChange = e => {
    this.setState({
      deckDescVal: e.target.value
    });
  }

  closeAndClearDescInput = () => {
    this.setState({
      showDescInput: false,
      deckDescVal: null,
    });
  }

  allDecksName = () => {
    return this.props.library === 'user' ? 
      I18n.t('react.card_maker.all_my_cards') :
      I18n.t('react.card_maker.all_public_cards');
  }

  deckMenuAnchorText = () => {
    return this.props.selectedDeck === this.props.allCardsDeck ?
      this.allDecksName() :
      this.props.selectedDeck.name;
  }

  toggleDeckPublic = () => {
    const that = this 
      , action = that.props.selectedDeck.public ?
          'make_private' :
          'make_public'
      , proceed = confirm(
          that.props.selectedDeck.public ?
          I18n.t('react.card_maker.confirm_make_private') :
          I18n.t('react.card_maker.confirm_make_public')
        )
      ;

    if (proceed) {
      that.props.showLoadingOverlay(null, null, (closeFn) => {
        $.ajax({
          url: cardMakerUrl('decks/' + that.props.selectedDeck.id + '/' + action),
          method: 'POST',
          success: () => {
            that.props.reloadCurLibResources(closeFn);
          }
        });
      });
    }
  }

  libCtrls = () => {
    let yourCards   = I18n.t('react.card_maker.my_cards')
      , publicCards = I18n.t('react.card_maker.public_cards')
      , faIcon
      , active
      , inactive
      ;

    if (this.props.library === 'user') {
      active = yourCards;
      inactive = publicCards;
      faIcon = 'users';
    } else {
      active = publicCards;
      inactive = yourCards;
      faIcon = 'user';
    }

    return (
      <div className={styles.libCtrls} >
        <div className={`${styles.lib} ${styles.activeLib}`}>{active}</div>
        <div 
          className={`${styles.lib} ${styles.altLib}`}
          onClick={this.toggleLibrary}
        >
          <i className={`fa fa-${faIcon}`} />
          <span>{inactive}</span>
        </div>
      </div>
    );
  }
    
  toggleLibrary = () => {
    if (!this.props.userRole && this.props.library == 'public') {
      // then we're toggling to user library, and they need to log in
      window.location = './login';
      return;
    }

    let newLib;

    if (this.props.library === 'user') {
      newLib = 'public';
    } else {
      newLib = 'user';
    }

    this.props.showLoadingOverlay(null, null, (closeFn) => {
      this.props.setLibrary(newLib, closeFn);
    });
  }

  isUserLib = () => {
    return this.props.library === 'user';
  }

  openCopyDeck = (upgrade) => {
    this.openModal(modals.copyDeck, {
      upgradeDeckOnCopy: upgrade
    })
  }

  closeCopyDeck = () => {
    this.closeModal({
      upgradeDeckOnCopy: false
    });
  }

  openModal = (id, extraProps) => {
    this.setState(Object.assign({
      openModal: id
    }, extraProps || {}));
  }

  closeModal = (extraProps) => {
    this.setState(Object.assign({
      openModal: null
    }, extraProps))
  }

  cancelPolling = () => {
    this.poller.cancel();
    this.props.hideLoadingOverlay();
  }

  createDeckPngs = () => {
    const that = this;
    that.props.showLoadingOverlay(
      I18n.t('react.card_maker.it_may_take_a_few_mins'),
      () => {
        // TODO: send cancel request
        this.cancelPolling();
        console.log('cancel png');
      },
      (closeFn) => {
        $.ajax({
          url: cardMakerUrl('deck_pngs'),
          data: JSON.stringify({
            deckId: that.props.selectedDeck.id
          }),
          method: 'POST',
          success: (result) => {
            that.pollJob('deck_pngs', result.jobId, closeFn);
          },
          error: closeFn
        })
      }
    );
  }

  deckMenuItems = (resourceCount) => {
    let items = [];

    if (
      this.props.selectedDeck !== this.props.allCardsDeck && 
      this.props.selectedDeck !== this.props.unassignedCardsDeck
    ) {
      if (resourceCount > 0 && !this.props.selectedDeck.needsUpgrade) {
        items.push({
          handleClick: this.openPrintOptions,
          label: I18n.t('react.card_maker.print')
        });

        items.push({
          handleClick: this.createDeckPngs,
          label: I18n.t('react.card_maker.download_pngs')
        });
      }

      if (this.props.userRole) {
        items.push({
          handleClick: () => this.openCopyDeck(false),
          label: I18n.t('react.card_maker.copy_deck')
        });
      }

      if (this.isUserLib()) {
        if (this.props.selectedDeck.needsUpgrade) {
          items.push({
            label: I18n.t('react.card_maker.update_card_layouts'),
            handleClick: () => this.openCopyDeck(true)
          });
        }

        items.push({
          handleClick: this.handleDescBtnClick,
          label: this.props.selectedDeck.desc ? 
            I18n.t('react.card_maker.edit_desc') :
            I18n.t('react.card_maker.add_desc')
        });

        items.push({
          handleClick: () => this.openModal(modals.renameDeck),
          label: I18n.t('react.card_maker.rename_deck')
        });

        if (this.props.selectedDeck.isOwner) {
          items.push({
            handleClick: () => this.handleDestroyDeck(this.props.selectedDeck.id),
            label: I18n.t('react.card_maker.delete_deck')
          });
        }

        items.push({
          handleClick: () => this.openModal(modals.deckUsers),
          label: I18n.t('react.card_maker.manage_deck_users')
        });

        if (this.props.userRole == 'admin') {
          items.push({
            handleClick: this.toggleDeckPublic,
            label: this.props.selectedDeck.public ? 
              I18n.t('react.card_maker.make_deck_private') :
              I18n.t('react.card_maker.make_deck_public')
          });
        }
      } else {
        items.push({
          handleClick: () => this.openModal(modals.deckUrl),
          label: I18n.t('react.card_maker.show_url')
        });
      }
    }

    return items;
  }

  sortItems = () => {
    return this.props.sorts.map((sort) => {
      return {
        handleClick: () => { this.props.setSort(sort.key) },
        label: sort.label
      }
    });
  }

  openCopyCard = (id) => {
    this.openModal(modals.copyCard, {
      copyCardId: id
    });
  }

  userDeckNames = () => {
    return new Set(this.props.userDecks.map((deck) => { 
      return deck.name;
    }))
  }

  deckCopyName = (deckNames) => {
    let num = 2
      , baseName
      , name
      ;

    if (this.state.upgradeDeckOnCopy) {
      baseName = I18n.t('react.card_maker.name_updated', {
        name: this.props.selectedDeck.name
      });
    } else {
      baseName = I18n.t('react.card_maker.copy_of_name', { 
        name: this.props.selectedDeck.name 
      })
    }

    name = baseName;
  
    while (deckNames.has(name) && num < 10) {
      name = `${baseName} (${num++})`;
    }

    if (deckNames.has(name)) {
      name = null;
    }

    return name;
  }

  render() {
    var resourceResult = this.selectedResources()
      , searchFilteredResources = this.searchFilterResources(resourceResult.resources)
      , userDeckNames = this.userDeckNames()
      ;

    return (
      <div className={styles.cardManager}>
        <DeckUsersLightbox
          isOpen={this.state.openModal === modals.deckUsers}
          handleRequestClose={this.closeModal}
          deck={this.props.selectedDeck}
        />
        <RenameDeckLightbox
          isOpen={this.state.openModal === modals.renameDeck}
          handleRequestClose={this.closeModal}
          handleRename={this.handleRenameDeck}
          name={this.props.selectedDeck.name}
          deckNames={new Set(this.props.userDecks.filter((deck) => {
            return deck !== this.props.selectedDeck;
          }).map((deck) => {
            return deck.name; 
          }))}
        />
        <NewDeckLightbox
          isOpen={this.state.openModal === modals.newDeck}
          handleCreate={this.handleCreateDeck}
          handleRequestClose={this.closeModal}
          deckNames={userDeckNames}
        />
        <SpeciesSearchLightbox
          isOpen={this.state.openModal === modals.speciesSearch}
          handleClose={this.closeModal}
          handleCreate={this.handleCreateCard}
          deckFilterItems={this.deckFilterItemsForNewCard()}
          handleDeckSelect={this.handleSpeciesSearchDeckSelect}
          selectedDeckId={this.state.speciesSearchDeckId}
        />
        <CopyCardLightbox
          isOpen={this.state.openModal === modals.copyCard}
          handleRequestClose={this.closeModal}
          handleCopy={this.handleCopyCard}
          decks={this.props.userDecks} 
        />
        <CopyDeckLightbox
          isOpen={this.state.openModal === modals.copyDeck}
          handleRequestClose={this.closeCopyDeck}
          handleCopy={this.handleCopyDeck}
          deckNames={userDeckNames}
          name={this.deckCopyName(userDeckNames)}
          showUpgradeMessage={this.state.upgradeDeckOnCopy}
          message={this.state.upgradeDeckOnCopy ? I18n.t('react.card_maker.update_deck_msg') : null}
          submitLabel={this.state.upgradeDeckOnCopy ? I18n.t('react.card_maker.update_deck') : I18n.t('react.card_maker.copy_deck')}
        />
        <DeckUrlLightbox
          isOpen={this.state.openModal === modals.deckUrl}
          handleRequestClose={this.closeModal}
          deckUrl={deckUrl(this.props.selectedDeck)}
        />
        <DeckUpgradeNotice
          isOpen={this.state.openModal === modals.needToUpgradeDeckNotice}
          onRequestClose={this.closeModal}
        />
        <DialogBox
          isOpen={this.state.openModal === modals.deckUpgradedNotice}
          onRequestClose={this.closeModal}
          contentLabel={'newly upgraded deck notice'}
          message={I18n.t('react.card_maker.remember_to_review_updated')}
        />
        <PrintLightbox
          isOpen={this.state.openModal === modals.print}
          onRequestClose={this.closeModal}
          handleSubmit={this.makeDeckPdf}
        />
        <img src={iguanaBanner} className={styles.banner} />
        <LeftRail
          library={this.props.library}
          handleToggleLibrary={this.toggleLibrary}
          handleDeckSelect={this.handleDeckSelect}
          handleNewDeck={() => this.openModal(modals.newDeck)}
          selectedDeck={this.props.selectedDeck}
          decks={this.props.decks}
          allCardsDeck={this.props.allCardsDeck}
          unassignedCardsDeck={this.props.unassignedCardsDeck}
        />
        <div className={styles.lResources}>
          <div className={styles.lDeckMenu}>
            <div className={styles.lDeckMenuFlex}>
              <Menu
                items={this.deckMenuItems(resourceResult.resources.length)}
                open={this.state.openMenu === menus.deck}
                anchorText={this.deckMenuAnchorText()}
                handleRequestClose={() => this.closeMenu()}
                handleRequestOpen={() => this.openMenu(menus.deck)}
              />
              {
                this.props.selectedDeck !== this.props.allCardsDeck &&
                this.props.selectedDeck !== this.props.unassignedCardsDeck &&
                <DeckDesc
                  value={this.state.showDescInput && this.state.deckDescVal !== null ? this.state.deckDescVal : this.props.selectedDeck.desc}
                  handleInputChange={this.handleDescInputChange}
                  handleRequestSave={this.handleSetDescBtnClick}
                  handleRequestClose={this.closeAndClearDescInput}
                  showInput={this.state.showDescInput}
                  library={this.props.library}
                  handleRequestInput={this.handleDescBtnClick}
                />
              }
            </div>
          </div>
          <div className={styles.searchContain}>
            <Search 
              handleChange={(val) => this.setState({ cardSearchVal: val})}
              value={this.state.cardSearchVal}
              placeholder={I18n.t('react.card_maker.search_cards')}
              extraClass={styles.searchCards}
            />
            <div className={styles.lSort}>
              <span className={styles.sortLabel}>{I18n.t('react.card_maker.sort_label') + ' '}</span>
              <Menu
                items={this.sortItems()}
                anchorText={this.props.sort.label}
                open={this.state.openMenu === menus.sort}
                handleRequestClose={() => { this.closeMenu() }}
                handleRequestOpen={() => { this.openMenu(menus.sort) }}
                extraClasses={[menuStyles.menuWrapSort]}
              />
            </div>
          </div>
          <UserResources
            resources={searchFilteredResources}
            resourceType={resourceResult.resourceType}
            handleCardDeckSelect={this.assignCardDeck}
            handleEditCard={this.props.handleEditCard}
            handleDeckSelect={this.handleDeckSelect}
            handleDestroyCard={this.handleDestroyCard}
            handleDestroyDeck={this.handleDestroyDeck}
            handleNewCard={this.handleSpeciesSearchOpen}
            handleCopyCard={this.openCopyCard}
            showCopyCard={this.isUserLib() || this.props.userRole}
            handleNewDeck={() => this.openModal(modals.newDeck)}
            editable={this.isUserLib()}
          />
        </div>
      </div>
    );
  }
}

export default CardManager
