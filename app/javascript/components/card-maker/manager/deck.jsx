import React from 'react'

import LoadingSpinnerImage from 'components/card-maker/loading-spinner-image'
import { loResCardImageUrl } from 'lib/card-maker/url-helper'
import { InView } from 'react-intersection-observer'

import styles from 'stylesheets/card_maker/simple_manager'

function Deck(props) {
  return (
    <InView>
      {({inView, ref, entry}) => (
        <li 
          className={styles.resource}
          onClick={props.onRequestOpen} 
          ref={ref}
        >
          <div className={[styles.cardImg, styles.cardImgBehind, styles.cardImgBehind2].join(' ')} />
          <div className={[styles.cardImg, styles.cardImgBehind, styles.cardImgBehind1].join(' ')} />
          <div className={[styles.cardImg, styles.cardImgBehind, styles.cardImgBehind0].join(' ')} />
          <div className={styles.cardImg}>
            {
              props.titleCard != null ?
              (
                <React.Fragment>
                  <div className={styles.deckImage} key='deckImg'>
                    <LoadingSpinnerImage 
                      src={loResCardImageUrl(props.titleCard)} 
                      load={inView}
                    />
                  </div>
                  <div className={styles.deckText} key='deckTxt'>{props.name}</div>
                </React.Fragment>
              ) :
              <div className={styles.deckText}>{props.name}</div>
            }
          </div>
        </li>
      )}
    </InView>
  );
}

export default Deck;

