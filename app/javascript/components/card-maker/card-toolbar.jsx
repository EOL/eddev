import React from 'react';

import Toolbar from './toolbar'

import styles from 'stylesheets/card_maker/simple_manager';

function CardToolbar(props) {
  function buildButtonItems() {
    const items = [];

    if (
      props.library == 'user' ||
      !props.selectedDeck.needsUpgrade
    ) {
      items.push({
        icon: 'print',
        handleClick: props.onRequestPrint
      });
    }

    items.push({
      icon: 'download',
      handleClick: props.onRequestPngDownload
    });

    items.push({
      icon: 'copy',
      handleClick: props.onRequestCopy
    });

    return items;
  }

  function buildMenuItems() {
    const items = [];

    if (props.library == 'user') {
      items.push({
        handleClick: props.onRequestOpenDeckUsers,
        label: I18n.t('react.card_maker.manage_deck_users')
      });

      if (props.selectedDeck.needsUpgrade) {
        items.push({
          label: I18n.t('react.card_maker.update_card_layouts'),
          handleClick: props.onRequestUpgrade
        });
      }

      if (props.userRole == 'admin') {
        items.push({
          handleClick: props.onRequestToggleDeckPublic,
          label: props.selectedDeck.public ? 
            I18n.t('react.card_maker.make_deck_private') :
            I18n.t('react.card_maker.make_deck_public')
        });
      }

      items.push({
        handleClick: props.onRequestDestroyDeck,
        label: I18n.t('react.card_maker.delete_deck'),
      });
    } else {
      items.push({
        handleClick: props.onRequestShowUrl,
        label: I18n.t('react.card_maker.show_url')
      });
    }

    return items;
  }

  return (
    <Toolbar
      buttonItems={buildButtonItems()}
      menuItems={buildMenuItems()}
      onRequestUpdateSearchValue={props.onRequestUpdateSearchValue}
      searchValue={props.searchValue}
    />
  );
}

export default CardToolbar;

