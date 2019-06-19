import React from 'react'
import styles from 'stylesheets/shared/lightbox'
import CloseButtonModal from './close-button-modal'

function LightboxOverlay(props) {
  const classNames = [styles.lightbox];

  if (props.extraClass) {
    classNames.push(props.extraClass);
  }

  return (
    <CloseButtonModal
      isOpen={props.isOpen}
      contentLabel={props.contentLabel}
      parentSelector={() => {return document.getElementById('Page')}}
      overlayClassName={styles.overlay}
      className={classNames.join(' ')}
      bodyOpenClassName='noscroll'
      onRequestClose={props.onRequestClose}
      shouldCloseOnOverlayClick={false}
      fullScreenOverlay={true}
    >{props.children}</CloseButtonModal>
  );
}

export default LightboxOverlay;

