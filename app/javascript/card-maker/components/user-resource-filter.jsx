import React from 'react'

import downArrowIcon from 'images/card_maker/down_arrow.png'
import styles from 'stylesheets/card_maker/card_manager'

class UserResourceFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    }
  }

  handleClickOutside = (event) => {
    if (
      this.state.menuOpen &&
      this.node &&
      !this.node.contains(event.target)
    ) {
      this.closeMenu();
    }
  }

  toggleOpen = () => {
    if (this.state.menuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  closeMenu = () => {
    this.setState((prevState, props) => {
      this.removeClickOutsideHandler();

      return {
        menuOpen: false
      };
    });
  }

  openMenu = () => {
    this.setState((prevState, props) => {
      this.addClickOutsideHandler();

      return {
        menuOpen: true,
      }
    });
  }

  setRef = (node) => {
    this.node = node;
  }

  addClickOutsideHandler = () => {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  removeClickOutsideHandler = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    this.removeClickOutsideHandler();
  }

  handleFilterItemClick(id) {
    this.props.handleSelect(id)
  }

  hasDropdown() {
    return this.props.filterItems.length > 1
  }

  selectedItemName = () => {
    const selected = this.props.filterItems.find((item) => {
      return item.id === this.props.selectedId;
    });
    return selected.name;
  }

  handleItemClick = (id) => {
    this.closeMenu();

    if (this.props.handleSelect) {
      this.props.handleSelect(id);
    }
  }

  render() {
    return (
      <div className={styles.newInputSelect} onClick={this.toggleOpen} ref={this.setRef}>
        <div className={styles.newInput}>
          <div className={styles.newInputSelectName}>{this.selectedItemName()}</div>
          {
            this.hasDropdown() && 
            <i className={`${styles.newInputSelectArw} fa fa-caret-down`} />
          }
        </div>
        {this.hasDropdown() && this.state.menuOpen && 
          <ul className={styles.newInputSelectItems}>
            {this.props.filterItems.map((item) => {
              return (<FilterItem
                handleClick={() => this.handleItemClick(item.id)}
                name={item.name}
                key={item.id}
                count={item.count}
                selected={this.props.selectedId === item.id}
              />)
            })}
          </ul>
        }
      </div>
    )
  }
}

function FilterItem(props) {
  return <li onClick={props.handleClick}>{props.name}</li>
}

export default UserResourceFilter
