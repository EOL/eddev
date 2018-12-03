import React from 'react'
import ReactModal from 'react-modal'
import styles from 'stylesheets/shared/lightbox'

function DialogBox(props) {
  return (
    <ReactModal
      parentSelector={() => { return document.getElementById('Page') } }
      overlayClassName={styles.overlay}
      className={styles.lightbox}
      bodyOpenClassName='noscroll'
      onRequestClose={props.onRequestClose}
      shouldCloseOnOverlayClick={false}
      fullScreenOverlay={true}
      contentLabel={props.contentLabel}
      isOpen={props.isOpen}
    >
      <div className={styles.dialog}>
        <p>{props.message}</p>
        <button 
          onClick={props.onRequestClose} className={[styles.btn, styles.btnDialog].join(' ')}
        >ok</button>
      </div>
    </ReactModal>
  );
}

export default DialogBox;

