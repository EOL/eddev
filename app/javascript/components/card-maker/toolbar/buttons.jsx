import React from 'react'

import styles from 'stylesheets/card_maker/simple_manager'

class Buttons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false  
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeMenu);
  }

  openMenu = () => {
    this.setState({
      menuOpen: true
    });

    document.addEventListener('click', this.closeMenu);
  }

  closeMenu = () => {
    document.removeEventListener('click', this.closeMenu);
    this.setState({
      menuOpen: false
    });
  }

  render() {
    return (
      <ul className={styles.toolbarBtns}>
        <li
          className={styles.toolbarBtn}
          onClick={this.props.onRequestOpenSearch}
        ><i className='fa fa-lg fa-search' /></li>
        {
          this.props.buttonItems.map((item) => {
            return (
              <li
                className={styles.toolbarBtn}
                onClick={item.handleClick}
                key={item.icon}
              ><i className={`fa fa-lg fa-${item.icon}`} /></li>
            );
          })
        }
        {
          this.props.menuItems.length > 0 && (
            <li className={[styles.toolbarBtn, styles.toolbarBtnMenu].join(' ')} onClick={this.openMenu}>
              <span>more&nbsp;</span>
              <i className="fa fa-angle-down" />
              {
                this.state.menuOpen && 
                (<ul className={styles.toolbarMenu}>
                  {this.props.menuItems.map((item) => {
                    return (
                      <li key={item.label} onClick={item.handleClick}>{item.label}</li>
                    )
                  })}
                </ul>)
              }
            </li>
          )
        }
      </ul>
    );
  }
}

export default Buttons;

