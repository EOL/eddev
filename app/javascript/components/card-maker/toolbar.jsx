import React from 'react';
import styles from 'stylesheets/card_maker/simple_manager'

function Toolbar(props) {
  return (
    <div className={[styles.bar, styles.toolbar].join(' ')}>
      <ul className={styles.toolbarBtns}>
        <li><i className="fa fa-lg fa-print" /></li>
        <li><i className="fa fa-lg fa-download" /></li>
        <li><i className="fa fa-lg fa-copy" /></li>
      </ul>
    </div>
  );
}

export default Toolbar;

