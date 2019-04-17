import React from 'react'

import Menu from './menu'

import styles from 'stylesheets/card_maker/simple_manager'

class Buttons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false  
    }
  }

  handleRequestOpenMenu = (cb) => {
    this.setState({
      menuOpen: true
    }, cb);
  }

  render() {
    return (
      <ul className={styles.toolbarBtns}>
        <li
          className={[styles.toolbarItem, styles.toolbarBtn].join(' ')}
          onClick={this.props.onRequestOpenSearch}
        ><i className='fa fa-lg fa-search' /></li>
        {
          this.props.buttonItems.map((item) => {
            return (
              <li
                className={[styles.toolbarItem, styles.toolbarBtn].join(' ')}
                onClick={item.handleClick}
                key={item.icon}
              ><i className={`fa fa-lg fa-${item.icon}`} /></li>
            );
          })
        }
        {
          this.props.menuItems.length > 0 && (
            <Menu
              onRequestOpen={this.handleRequestOpenMenu}
              onRequestClose={() => this.setState({ menuOpen: false })}
              open={this.state.menuOpen}
              label='more'
              items={this.props.menuItems}
            />
          )
        }
      </ul>
    );
  }
}

export default Buttons;

