import React from 'react';

import Buttons from './toolbar/buttons'
import Menu from './toolbar/menu'
import SearchItems from './toolbar/search-items'

import styles from 'stylesheets/card_maker/simple_manager'

class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchOpen: false
    };
  }

  openSearch = () => {
    this.setState({
      searchOpen: true
    });
    console.log('did it~');
  }

  render() {
    const innerClasses = [styles.barInner, styles.lDecksCol];
    let searchExtraClass = null;

    if (this.state.searchOpen) {
      innerClasses.push(styles.barInnerCenter);
      searchExtraClass = styles.searchItemsOpen;
    }

    return (
      <div className={[styles.bar, styles.toolbar].join(' ')}>
        <div className={innerClasses.join(' ')}>
          {
            !this.state.searchOpen &&
            <Buttons {...this.props} />
          }
          <SearchItems 
            {...this.props} 
            open={this.state.searchOpen}
            onRequestOpen={this.openSearch}
            onRequestClose={() => this.setState({ searchOpen: false })}
            extraClass={searchExtraClass}
          />
        </div>
      </div>
    );
  }
}

export default Toolbar;

