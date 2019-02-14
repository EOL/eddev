import React from 'react'
import styles from 'stylesheets/shared/lightbox'
import CloseButtonModal from './close-button-modal'

function LightboxOverlay(props) {
  return (
    <CloseButtonModal
      isOpen={true}
      contentLabel={props.contentLabel}
      parentSelector={() => {return document.body}}
      overlayClassName={styles.overlay}
      className={styles.lightbox}
      bodyOpenClassName='noscroll'
      onRequestClose={props.onRequestClose}
      shouldCloseOnOverlayClick={false}
      fullScreenOverlay={true}
    >{props.children}</CloseButtonModal>
  );
}

export default LightboxOverlay;

