import React from 'react';

import Buttons from './toolbar/buttons'
import Search from './toolbar/search'
import Menu from './toolbar/menu'

import styles from 'stylesheets/card_maker/simple_manager'
import menuStyles from 'stylesheets/shared/menu'

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
        <div className={[styles.toolbarInner, styles.lDecksCol].join(' ')}>
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
          {
            this.props.sortItems != null && 
            this.props.sortItems.length > 0 &&
            <Menu
              items={this.props.sortItems}
              label={this.props.sortLabel}
              open={this.state.sortOpen}
              onRequestClose={() => this.setState({ sortOpen: false })}
              onRequestOpen={(cb) => this.setState({ sortOpen: true }, cb)}
              extraClasses={styles.toolbarBtnMenuSort}
            />
          }
        </div>
      </div>
    );
  }
}

export default Toolbar;

