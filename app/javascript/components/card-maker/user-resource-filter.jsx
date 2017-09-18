import React from 'react'

import downArrowIcon from 'images/card_maker/down_arrow.png'

class UserResourceFilter extends React.Component {
  handleFilterItemClick(id) {
    this.props.handleSelect(id)
  }

  hasDropdown() {
    return this.props.filterItems.length > 1
  }

  render() {
    var topClass = 'filter'
      , iconClass = 'icon ' + this.props.iconClass
      , menuClass = 'filter-items'
      ;

    if (this.props.selected) {
      topClass += ' selected';
    }

    if (this.props.first) {
      topClass += ' first';
    }

    console.log(this.props);

    if (!this.props.menuOpen) {
      menuClass += ' hidden';
    }

    return (
      <div className={topClass} onClick={this.props.handleClick}>
        <div className='btn'>
          <div className='filter-icon'>
            <i className={iconClass} />
            <div className='count'>{this.props.count}</div>
          </div>
          <div className='filter-selection'>{this.props.filterItems[0].name}</div>
          <div className='down-arrow'>
            {this.hasDropdown() &&
              <img
                src={downArrowIcon}
                className='down-arrow-img'
                onClick={this.props.handleMenuOpenClick}
              />
            }
          </div>
        </div>
        {this.hasDropdown() &&
          <ul className={menuClass}>
            {this.props.filterItems.map((item) => {
              return (<FilterItem
                handleClick={() => this.handleSelect(item.id)}
                name={item.name}
                key={item.id}
                count={item.count}
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
    return (
      <li onClick={this.props.handleClick} className="filter-item">
        {this.props.name} ({this.props.count})
      </li>
    )
  }
}

export default UserResourceFilter
