import React from 'react'
import LoadingSpinnerImage from './loading-spinner-image'
import {loResCardImageUrl} from 'lib/card-maker/url-helper'

import styles from 'stylesheets/card_maker/simple_manager'

function SimpleCard(props) {
  const card = props.card;

  let overlayClasses = [styles.resourceOverlay];

  if (props.library === 'user') {
    overlayClasses.push(styles.resourceOverlayTwoCol);
  }

  return (
    <li
      className={styles.card}
      key={card.id}
      ref={props.domRef}
    >
      <div className={styles.cardImg}>
        <LoadingSpinnerImage 
          src={loResCardImageUrl(card)} 
          load={props.loadImage}
          onLoad={props.onImageLoad}
        />
      </div>
      <div className={overlayClasses.join(' ')}>
        {
          props.library === 'user' &&
          <i
            className='fa fa-edit fa-3x edit-btn'
            onClick={props.onRequestEditCard}
          />
        }
        <i
          className='fa fa-expand fa-3x'
          onClick={props.onRequestZoom}
        />
        <i
          className='fa fa-copy fa-3x'
          onClick={props.onRequestCopy}
        />
        {
          props.library === 'user' && 
          <i
            className='fa fa-trash-o fa-3x'
            onClick={props.onRequestDestroy}
          />
        }
      </div>
    </li>
  );
}

export default SimpleCard;

