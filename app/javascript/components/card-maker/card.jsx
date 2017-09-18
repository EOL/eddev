import React from 'react'

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgLoaded: false,
      showOverlay: false
    }
  }

  imgUrl(id) {
    return 'card_maker_ajax/cards/' + id + '/svg';
  }

  imgLoaded = () => {
    this.setState({
      imgLoaded: true,
      showOverlay: this.state.showOverlay
    })
  }

  handleMouseEnter = () => {
    this.setState({
      imgLoaded: this.state.imgLoaded,
      showOverlay: true
    })
  }

  handleMouseLeave = () => {
    this.setState({
      imgLoaded: this.state.imgLoaded,
      showOverlay: false
    })
  }

  render() {
    var imgClass = 'user-resource'
      , spinClass = 'fa fa-spinner fa-spin fa-2x img-placeholder'
      , overlayClass = 'card-overlay resource-overlay'
      ;

    if (this.state.imgLoaded) {
      spinClass += ' hidden';
    } else {
      imgClass += ' hidden';
    }

    if (!this.state.showOverlay) {
      overlayClass += ' hidden';
    }

    return (
      <div className='resource-wrap'
           onMouseEnter={this.handleMouseEnter}
           onMouseLeave={this.handleMouseLeave}
      >
        <div className='resource-frame'>
          <i className={spinClass} />
          <img
            className={imgClass}
            src={this.imgUrl(this.props.id)}
            onLoad={this.imgLoaded}
          />
          <div className={overlayClass}>
            <i className='i fa fa-edit fa-3x edit-btn btn' />
            <i className='i fa fa-trash-o fa-3x trash-btn btn' />
          </div>
        </div>
      </div>
    )
  }
}

export default Card;
