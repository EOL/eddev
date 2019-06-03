import React from 'react'

import Menu from './menu'
import Search from './search'

import styles from 'stylesheets/card_maker/simple_manager'

class SearchItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortOpen: false,
    }
  }

  render() {
    const classNames = [styles.toolbarBtns, styles.toolbarBtnsSearch]; 

    if (this.props.extraClass) { 
      classNames.push(this.props.extraClass);
    }

    return (
      <ul className={classNames.join(' ')}>
        {
          this.props.open ? 
          <Search 
            autoFocus={true}
            showBack={true}
            onRequestClose={() => { 
              this.props.onRequestUpdateSearchValue(''); 
              this.props.onRequestClose();
            }} 
            onRequestUpdateValue={this.props.onRequestUpdateSearchValue}
            value={this.props.searchValue}
            placeholder={this.props.searchPlaceholder}
            autocompleteItems={this.props.autocompleteItems}
            onAutocompleteSelect={this.props.onAutocompleteSelect}
          /> :
          <li
            className={[styles.toolbarItem, styles.toolbarBtn].join(' ')}
            onClick={this.props.onRequestOpen}
          ><i className='fa fa-lg fa-search' /></li>
        }
        {
          this.props.sortItems != null && 
          this.props.sortItems.length > 0 &&
          <Menu
            items={this.props.sortItems}
            label={`sort: ${this.props.sortLabel}`}
            open={this.state.sortOpen}
            onRequestClose={() => this.setState({ sortOpen: false })}
            onRequestOpen={(cb) => this.setState({ sortOpen: true }, cb)}
            extraClasses={styles.toolbarBtnMenuSort}
          />
        }
      </ul>
    )
  }
}

export default SearchItems;
