import React from 'react'

import LoadingSpinnerImage from './loading-spinner-image'
import { loResCardImageUrl } from 'lib/card-maker/url-helper'

import styles from 'stylesheets/card_maker/simple_manager'

function SimpleDeck(props) {
  var inner;

  if (props.titleCard) {
    inner = [
      <div className={styles.deckImage} key='deckImg'>
        <LoadingSpinnerImage src={loResCardImageUrl(props.titleCard)} load={true} />
      </div>,
      <div className={styles.deckText} key='deckTxt'>{props.name}</div>
    ]
  } else {
    inner = <div className={styles.deckText}>{props.name}</div>
  }

  return (
    <li 
      className={styles.deck}
      onClick={props.onRequestOpen}
    >
      <div className={[styles.cardImg, styles.cardImgBehind, styles.cardImgBehind2].join(' ')} />
      <div className={[styles.cardImg, styles.cardImgBehind, styles.cardImgBehind1].join(' ')} />
      <div className={[styles.cardImg, styles.cardImgBehind, styles.cardImgBehind0].join(' ')} />
      <div className={styles.cardImg}>
        {inner}
      </div>
    </li>
  )
}

export default SimpleDeck;

