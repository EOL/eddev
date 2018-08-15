import React from 'react'

import styles from 'stylesheets/shared/menu'

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    document.addEventListener('click', this.handleDocClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocClick);
  }

  handleDocClick = (e) => {
    if (!this.anchorNode.contains(e.target) && this.props.open) {
      this.props.handleRequestClose();
    }
  }

  handleAnchorClick = () => {
    if (this.props.items.length) {
      if (this.props.open) {
        this.props.handleRequestClose();
      } else {
        this.props.handleRequestOpen();
      }
    }
  }

  render() {
    return (
      <div
        className={[styles.menuWrap].concat(this.props.extraClasses || []).join(' ')}
      >
        <div 
          className={this.props.items.length ? styles.isClickable : ''}
          onClick={this.handleAnchorClick}
          ref={node => this.anchorNode = node}
        >
          <div className={styles.menuAnchorName}>{this.props.anchorText}</div>
          {this.props.items.length ? <i className={`${styles.menuCaret} fa fa-caret-down`} /> : null}
        </div>
        {
          this.props.open &&
          <ul className={styles.menu}>
            {
              this.props.items.map((item, index) => {
                return <li key={index} onClick={item.handleClick}>{item.label}</li>
              })
            }
          </ul>
        }
      </div>
    );
  }
}

export default Menu;
