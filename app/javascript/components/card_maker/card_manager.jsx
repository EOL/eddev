import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class UserResources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      decks: []
    };
  }

  componentDidMount() {
    var that = this;

    $.ajax({
      url: 'card_maker_ajax/card_summaries',
      method: 'GET',
      success: function(cards) {
        that.setState({
          cards: cards,
          decks: []
        });
      }
    });
  }

  render() {
    var cardElmts = this.state.cards.map(function(card) {
      return (
        <Card
          id={card.id}
          key={card.id}
        />
      )
    });

    return <div className="user-resources">{cardElmts}</div>;
  }
}

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

export { UserResources };
