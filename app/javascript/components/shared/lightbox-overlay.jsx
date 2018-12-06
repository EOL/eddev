import React from 'react'
import styles from 'stylesheets/shared/lightbox'
import CloseButtonModal from './close-button-modal'

function LightboxOverlay(props) {
  return (
    <CloseButtonModal
      isOpen={props.isOpen}
      contentLabel={props.contentLabel}
      parentSelector={() => {return document.getElementById('Page')}}
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

