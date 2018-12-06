import React from 'react';
import styles from 'stylesheets/card_maker/simple_manager'

class Toolbar extends React.Component {
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

  menuItems = () => {
    let items = [];

    if (this.props.library == 'user') {
      items.push({
        handleClick: this.props.onRequestOpenDeckUsers,
        label: I18n.t('react.card_maker.manage_deck_users')
      });

      if (this.props.selectedDeck.needsUpgrade) {
        items.push({
          label: I18n.t('react.card_maker.update_card_layouts'),
          handleClick: this.props.onRequestUpgrade
        });
      }

      if (this.props.userRole == 'admin') {
        items.push({
          handleClick: this.props.onRequestToggleDeckPublic,
          label: this.props.selectedDeck.public ? 
            I18n.t('react.card_maker.make_deck_private') :
            I18n.t('react.card_maker.make_deck_public')
        });
      }

      items.push({
        handleClick: this.props.onRequestDestroyDeck,
        label: I18n.t('react.card_maker.delete_deck'),
      });
    } else {
      items.push({
        handleClick: this.props.onRequestShowUrl,
        label: I18n.t('react.card_maker.show_url')
      });
    }

    return items;
  }

  render() {
    const menuItems = this.menuItems();

    return (
      <div className={[styles.bar, styles.toolbar].join(' ')}>
        <ul className={styles.toolbarBtns}>
          {
            (this.props.library == 'user' ||
            !this.props.selectedDeck.needsUpgrade) &&
            (<li
              className={styles.toolbarBtn}
              onClick={this.props.onRequestPrint} 
            ><i className="fa fa-lg fa-print" /></li>)
          }
          <li
            className={styles.toolbarBtn}
            onClick={this.props.onRequestPngDownload} 
          ><i className="fa fa-lg fa-download" /></li>
          <li 
            className={styles.toolbarBtn}
            onClick={this.props.onRequestCopy}
          ><i className="fa fa-lg fa-copy" /></li>
          {
            menuItems.length > 0 && (
              <li className={[styles.toolbarBtn, styles.toolbarBtnMenu].join(' ')} onClick={this.openMenu}>
                <span>more&nbsp;</span>
                <i className="fa fa-angle-down" />
                {
                  this.state.menuOpen && 
                  (<ul className={styles.toolbarMenu}>
                    {menuItems.map((item) => {
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
      </div>
    );
  }
}

export default Toolbar;

