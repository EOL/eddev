import React from 'react'
import LoadingSpinnerImage from 'components/card-maker/loading-spinner-image'
import {loResCardImageUrl} from 'lib/card-maker/url-helper'

import { InView } from 'react-intersection-observer'

import styles from 'stylesheets/card_maker/simple_manager'

function Card(props) {
  const card = props.card;

  let overlayClasses = [styles.resourceOverlay];

  if (props.library === 'user') {
    overlayClasses.push(styles.resourceOverlayTwoCol);
  }

  return (
    <InView>
      {({inView, ref, entry}) => (
        <li className={styles.resource} ref={ref} onClick={props.onClick}>
          <div className={styles.cardImg}>
            <LoadingSpinnerImage 
              src={loResCardImageUrl(card)} 
              load={inView}
              onLoad={props.onImageLoad}
            />
          </div>
          {
            props.overlayOpen &&
            <div className={overlayClasses.join(' ')}>
              {
                props.library === 'user' &&
                <i
                  className='fa fa-edit fa-3x edit-btn'
                  onClick={props.onRequestEditCard}
                />
              }
              <i
                className={`${styles.expandCardBtn} fa fa-expand fa-3x`}
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
          }
        </li>
      )}
    </InView>
  );
}

export default Card;

