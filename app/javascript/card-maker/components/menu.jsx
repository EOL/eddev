import React from 'react'

import styles from 'stylesheets/card_maker/card_manager'

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
    if (!this.node.contains(e.target) && this.props.open) {
      this.props.handleRequestClose();
    }
  }

  render() {
    console.log(this.props.items);

    return (
      <div
        className={styles.menuWrap}
        ref={node => this.node = node}
      >
        <div 
          className={[
            styles.menuAnchor,
            (this.props.items.length ? styles.isClickable : '')
          ].join(' ')}
          onClick={this.props.items.length ? this.props.handleRequestOpen : null}
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
