import React from 'react'
import ReactModal from 'react-modal'

import styles from 'stylesheets/card_maker/card_manager'

function CloseButtonModal(props) {
  return (
    <ReactModal {...props}>
      {props.children}
      <i 
        className={`fa fa-times fa-lg ${styles.modalX}`} 
        onClick={props.onRequestClose}
      />
    </ReactModal>
  );
}

export default CloseButtonModal;
