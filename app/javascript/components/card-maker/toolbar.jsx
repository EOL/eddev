import React from 'react';

import styles from 'stylesheets/card_maker/card_manager'

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moreMenuOpen: false
    }
  }

  componentWillUnmount()  {
    $(document).off('click', this.closeMoreMenu);
  }

  openMoreMenu = () => {
    this.setState({
      moreMenuOpen: true
    });

    $(document).click(this.closeMoreMenu);
  }

  closeMoreMenu = () => {
    this.setState({
      moreMenuOpen: false
    });

    $(document).off('click', this.closeMoreMenu);
  }

  render() {
    return (
      <div className={styles.toolbar}>
        <h3>{this.props.libDeckName}</h3>
        <div 
          className={styles.libToggle}
          onClick={this.props.onRequestToggleLibrary}
        >
          <i className='fa fa-exchange fa-lg'></i>
          <span>&nbsp;&nbsp;&nbsp;{'switch to ' + (this.props.library === 'user' ? 'public' : 'user') + ' library'}</span>
        </div>
        <ul className={styles.actions}>
          {
            this.props.actions.map((action, i) => {
              return (
                <li onClick={action.onClick} key={i}>
                  <i className={`fa fa-lg fa-${action.icon}`} />
                  <span>&nbsp;&nbsp;{action.text}</span>
                </li>
              );
            })
          }
          {
            this.props.moreItems.length > 0 && (
              <li onClick={this.openMoreMenu}>more&nbsp;&nbsp;<i className='fa fa-angle-down fa-lg' />
            
                {
                  this.state.moreMenuOpen && (
                    <ul className={styles.moreMenu}>
                      {this.props.moreItems.map((item, i) => {
                        return (
                          <li onClick={item.onClick} key={i}>
                            {item.text}
                          </li>
                        );
                      })}
                    </ul>
                  )
                }
              </li>
            )
          }
        </ul>
      </div>
    );
  }
}

export default Toolbar;

