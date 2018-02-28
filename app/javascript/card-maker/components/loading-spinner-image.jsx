import React from 'react'

import styles from 'stylesheets/card_maker/card_manager'

class LoadingSpinnerImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }

  imgLoaded = () => {
    this.setState((prevState, props) => {
      return {
        loaded: true,
      }
    });
  }

  render() {
    var imgClass = styles.fillParent;

    if (!this.state.loaded) {
      imgClass += ' is-hidden';
    }

    return (
      <div className={styles.loadingSpinnerImage}>
        {!this.state.loaded &&
          <i className='fa fa-spinner fa-spin fa-2x' />
        }
        <img
          className={imgClass}
          src={this.props.src}
          onLoad={this.imgLoaded}
        />
      </div>
    )
  }
}

export default LoadingSpinnerImage
