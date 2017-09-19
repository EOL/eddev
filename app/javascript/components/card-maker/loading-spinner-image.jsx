import React from 'react'

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
    var imgClass = 'user-resource';

    if (!this.state.loaded) {
      imgClass += ' hidden';
    }

    return (
      <div className='loading-resource-image'>
        {!this.state.loaded &&
          <i className='fa fa-spinner fa-spin fa-2x img-placeholder' />
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
