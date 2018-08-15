import React from 'react'
import ReactModal from 'react-modal'

import styles from 'stylesheets/card_maker/card_manager'

function CloseButtonModal(props) {
  var size = 'lg'
    , classNames = [styles.modalX]
    ;

  if (props.fullScreenOverlay) {
    size = '2x'
    classNames.push(styles.modalXWhite);
  }

  return (
    <ReactModal {...props}>
      {props.children}
      <i 
        className={`fa fa-times fa-${size} ${classNames.join(' ')}`} 
        onClick={props.onRequestClose}
      />
    </ReactModal>
  );
}

export default CloseButtonModal;
