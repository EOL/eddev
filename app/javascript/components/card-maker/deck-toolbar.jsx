import React from 'react'
import Toolbar from './toolbar'

function DeckToolbar(props) {
  return (
    <Toolbar
      menuItems={[]}
      buttonItems={[]}
      searchValue={props.searchValue}
      onRequestUpdateSearchValue={props.onRequestUpdateSearchValue}
      autocompleteItems={props.autocompleteItems}
      onAutocompleteSelect={props.onAutocompleteSelect}
      searchPlaceholder={'search decks'}
    />
  );
}

export default DeckToolbar;

