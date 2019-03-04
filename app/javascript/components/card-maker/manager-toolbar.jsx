import React from 'react'
import styles from 'stylesheets/card_maker/card_manager'

class ManagerToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };
  }

  componentWillUnmount() {
    $(document).off('click', this.closeMenu);
  }

  openMenu = () => {
    if (!this.state.menuOpen) {
      this.setState({
        menuOpen: true
      }, () => {
        $(document).click(this.closeMenu);
      });
    }
  }

  closeMenu = () => {
    $(document).off('click', this.closeMenu);
    this.setState({
      menuOpen: false
    });
  }

  render() {
    return (
      <div className={styles.toolbar}>
        <ul className={styles.toolbarItems}>
          {this.props.actions.map((item, i) => {
            return (
              <li onClick={item.onClick} key={i}>
                {item.text}&nbsp;&nbsp;
                <i className={`fa fa-lg fa-${item.icon}`} />
              </li>
            );
          })}
          {
            this.props.moreItems.length > 0 &&
            <li onClick={this.openMenu}>
              more&nbsp;&nbsp;<i className='fa fa-lg fa-caret-down' />
              {
                this.state.menuOpen === true && 
                <ul className={styles.toolbarMenu}>
                  {this.props.moreItems.map((item, i) => {
                    return <li onClick={item.onClick} key={i}>{item.text}</li>
                  })}
                </ul>
              }
            </li>
          }
        </ul>
      </div>
    ); 
  }
}

export default ManagerToolbar;

