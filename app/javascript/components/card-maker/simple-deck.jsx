import React from 'react'

import LoadingSpinnerImage from './loading-spinner-image'
import { loResCardImageUrl } from 'lib/card-maker/url-helper'

import styles from 'stylesheets/card_maker/simple_manager'

class SimpleDeck extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      onImageLoadCalled: false // This is only for tracking the case where there isn't a real image to load (i.e., when a titleCard isn't passed in)
    }
  }

  componentDidMount() {
    this.fireOnImageLoadIfNeeded();
  }

  componentDidUpdate()  {
    this.fireOnImageLoadIfNeeded();
  }

  fireOnImageLoadIfNeeded = () => {
    if (
      !this.state.onImageLoadCalled && 
      this.props.loadImage &&
      !this.props.titleCard
    ) {
      this.setState({
        onImageLoadCalled: true
      }, this.props.onImageLoad);
    }
  }

  render() {
    var inner;

    if (this.props.titleCard) {
      inner = [
        <div className={styles.deckImage} key='deckImg'>
          <LoadingSpinnerImage 
            src={loResCardImageUrl(this.props.titleCard)} 
            load={this.props.loadImage} 
            onLoad={this.props.onImageLoad}
          />
        </div>,
        <div className={styles.deckText} key='deckTxt'>{this.props.name}</div>
      ]
    } else {
      inner = <div className={styles.deckText}>{this.props.name}</div>
    }

    return (
      <li 
        className={styles.deck}
        onClick={this.props.onRequestOpen}
        ref={this.props.domRef}
      >
        <div className={[styles.cardImg, styles.cardImgBehind, styles.cardImgBehind2].join(' ')} />
        <div className={[styles.cardImg, styles.cardImgBehind, styles.cardImgBehind1].join(' ')} />
        <div className={[styles.cardImg, styles.cardImgBehind, styles.cardImgBehind0].join(' ')} />
        <div className={styles.cardImg}>
          {inner}
        </div>
      </li>
    );
  }
}

export default SimpleDeck;

