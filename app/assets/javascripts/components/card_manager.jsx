window.CardManagerReact = {};

window.CardManagerReact.UserResources = React.createClass({
  getInitialState: function() {
    return {
      cards: [],
      decks: []
    }
  },

  componentDidMount: function() {
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
    })
  },

  render: function() {
    var cardElmts = this.state.cards.map(function(card) {
      return (
        <CardManagerReact.Card
          id={card.id}
          key={card.id}
        />
      )
    });

    return <div className="user-resources">{cardElmts}</div>;
  }
});

window.CardManagerReact.Card = React.createClass({
  getInitialState: function() {
    return {
      imgLoaded: false,
      showOverlay: false
    };
  },

  imgUrl: function(id) {
    return 'card_maker_ajax/cards/' + id + '/svg';
  },

  imgLoaded: function() {
    this.setState({
      imgLoaded: true,
      showOverlay: this.state.showOverlay
    });
  },

  handleMouseEnter: function() {
    this.setState({
      imgLoaded: this.state.imgLoaded,
      showOverlay: true
    });
  },

  handleMouseLeave: function() {
    this.setState({
      imgLoaded: this.state.imgLoaded,
      showOverlay: false
    })
  },

  render: function() {
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
});
