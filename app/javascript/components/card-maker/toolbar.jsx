import React from 'react';
import styles from 'stylesheets/card_maker/simple_manager'

class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false  
    }
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
          <li className={styles.toolbarBtn}><i className="fa fa-lg fa-copy" /></li>
          {
            (this.props.showOwnerOptions || this.props.showAdminOptions) && (
              <li className={[styles.toolbarBtn, styles.toolbarBtnMenu].join(' ')} onClick={() => this.setState({ menuOpen: true })}>
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

