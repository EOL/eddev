import React from 'react'

import styles from 'stylesheets/card_maker/simple_manager'

class Menu extends React.Component {
  componentWillUnmount() {
    document.removeEventListener('click', this.closeMenu);
  }

  openMenu = () => {
    const that = this;
    this.props.onRequestOpen(() => {
      document.addEventListener('click', that.closeMenu);
    });
  }

  closeMenu = () => {
    document.removeEventListener('click', this.closeMenu);
    this.props.onRequestClose();
  }

  render() {
    const className = [
      styles.toolbarItem, 
      styles.toolbarBtn, 
      styles.toolbarBtnMenu
    ].concat(this.props.extraClasses || []).join(' ');

    return (
      <li className={className} onClick={this.openMenu}>
        <span>{this.props.label}&nbsp;</span>
        <i className="fa fa-angle-down" />
        {
          this.props.open && 
          (<ul className={styles.toolbarMenu}>
            {this.props.items.map((item) => {
              return (
                <li key={item.label} onClick={item.handleClick}>{item.label}</li>
              )
            })}
          </ul>)
        }
      </li>
    );
  }
}

export default Menu;
