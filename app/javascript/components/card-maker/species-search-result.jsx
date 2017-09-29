import React from 'react'

class SpeciesSearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      commonName: null,
      thumbUrl: null,
    };
    this.dataInFlight = false;
  }

  ensureDataLoaded = () => {
    const that = this;

    if (!that.state.dataLoaded && !that.dataInFlight) {
      that.dataInFlight = true;
      $.getJSON('card_maker_ajax/taxon_details/' + this.props.id, function(data) {
        that.setState(() => {
          return {
            dataLoaded: true,
            commonName: data.commonName || '(not found)',
            thumbUrl: data.thumbUrl,
          }
        });
      });
    }
  }

  render() {
    if (this.props.expanded) {
      this.ensureDataLoaded();
    }

    return (
      <li
        className={'search-result' + (this.props.expanded ? ' expanded' : '')}
        onClick={this.props.handleClick}
      >
        <div className='sci-name'>{this.props.sciName}</div>
        {this.props.expanded &&
          (this.state.dataLoaded ?
            (<div className='result-details'>
              <img
                className='img'
                src={this.state.thumbUrl}
              />
              <div className='common-name'>
                Common name: {this.state.commonName}
              </div>
            </div>) :
            <i className='fa fa-spin fa-spinner fa-3x result-detail-spinner' />)}
      </li>
    )
  }
}

export default SpeciesSearchResult
