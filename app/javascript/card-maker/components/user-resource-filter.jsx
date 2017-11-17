import React from 'react'

import downArrowIcon from 'images/card_maker/down_arrow.png'

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

  handleArrowClick = () => {
    if (this.state.menuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
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
    var topClass = 'filter'
      , iconClass = 'icon ' + this.props.iconClass
      , menuClass = 'filter-items'
      ;

    if (this.props.selected) {
      topClass += ' selected';
    }

    if (this.props.className) {
      topClass += ' ' + this.props.className;
    }

    if (!this.state.menuOpen) {
      menuClass += ' hidden';
    }

    return (
      <div className={topClass} onClick={this.props.handleClick} ref={this.setRef}>
        <div className='btn'>
          <div className='filter-icon'>
            <i className={iconClass} />
            <div className='count'>{this.props.count}</div>
          </div>
          <div className='filter-selection'>{this.selectedItemName()}</div>
          <div
            className='down-arrow'
            onClick={this.hasDropdown() ? this.handleArrowClick : null}
          >
            {this.hasDropdown() &&
              <img
                src={downArrowIcon}
                className='down-arrow-img'
              />
            }
          </div>
        </div>
        {this.hasDropdown() &&
          <ul className={menuClass}>
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

class FilterItem extends React.Component {
  render() {
    var className = 'filter-item';

    if (this.props.selected) {
      className += ' selected';
    }

    return (
      <li onClick={this.props.handleClick} className={className}>
        {this.props.name + (this.props.count !== null ? (' (' + this.props.count + ')') : '')}
      </li>
    )
  }
}

export default UserResourceFilter
