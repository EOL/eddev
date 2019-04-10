import React from 'react';

import Buttons from './toolbar/buttons'
import Search from './toolbar/search'

import styles from 'stylesheets/card_maker/simple_manager'

class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchOpen: false
    };
  }

  render() {
    const anyItems = this.props.menuItems.length > 0 || this.props.buttonItems.length > 0;
    return (
      <div className={[styles.bar, styles.toolbar].join(' ')}>
        {
          (this.state.searchOpen || !anyItems) ?
          <Search 
            autoFocus={anyItems}
            showBack={anyItems}
            onRequestClose={() => { 
              this.props.onRequestUpdateSearchValue(''); 
              this.setState({ searchOpen: false })
            }} 
            onRequestUpdateValue={this.props.onRequestUpdateSearchValue}
            value={this.props.searchValue}
            placeholder={this.props.searchPlaceholder}
            autocompleteItems={this.props.autocompleteItems}
            onAutocompleteSelect={this.props.onAutocompleteSelect}
          /> :
          <Buttons
            onRequestOpenSearch={() => this.setState({ searchOpen: true })}
            buttonItems={this.props.buttonItems}
            menuItems={this.props.menuItems}
          />
        }
      </div>
    );
  }
}

export default Toolbar;

