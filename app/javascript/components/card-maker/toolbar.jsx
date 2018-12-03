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

  render() {
    return (
      <div className={[styles.bar, styles.toolbar].join(' ')}>
        <ul className={styles.toolbarBtns}>
          <li
            className={styles.toolbarBtn}
            onClick={this.props.onRequestPrint} 
          ><i className="fa fa-lg fa-print" /></li>
          <li
            className={styles.toolbarBtn}
            onClick={this.props.onRequestPngDownload} 
          ><i className="fa fa-lg fa-download" /></li>
          <li 
            className={styles.toolbarBtn}
            onClick={this.props.onRequestCopy}
          ><i className="fa fa-lg fa-copy" /></li>
          {
            (this.props.showOwnerOptions || this.props.showAdminOptions) && (
              <li className={[styles.toolbarBtn, styles.toolbarBtnMenu].join(' ')} onClick={this.openMenu}>
                <span>more&nbsp;</span>
                <i className="fa fa-caret-down" />
                {
                  this.state.menuOpen && (
                    <ul className={styles.toolbarMenu}>
                      <li>option</li>
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

