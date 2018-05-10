import React from 'react'
import ReactModal from 'react-modal'

import styles from 'stylesheets/card_maker/card_manager'

function CloseButtonModal(props) {
  return (
    <ReactModal {...props}>
      <i 
        className={`fa fa-times fa-lg ${styles.modalX}`} 
        onClick={props.onRequestClose}
      />
      {props.children}
    </ReactModal>
  );
}

export default CloseButtonModal;
