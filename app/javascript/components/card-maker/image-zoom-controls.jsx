import React from 'react'

const minPct = 1
    , maxPct = 100
    , zoomLevelOffset = 50
    ;

class ImageZoomControls extends React.Component {
  getPctFromCard = () => {
    var data = this.props.getImageData('zoomLevel', 0)
      ;

    if (!data) {
      data = 0;
    }

    return data + zoomLevelOffset;
  }

  handleDrag = (event, ui) => {
    this.updatePct(Math.round((this.maxTop - ui.position.top) * maxPct * 1.0 /
      this.maxTop));
  }

  updatePct = (newPct) => {
    this.props.setImageData('zoomLevel', newPct - zoomLevelOffset);
  }

  initIfReady = () => {
    if (this.stemNode && this.knobNode) {
      let $stem = $(this.stemNode)
        , $knob = $(this.knobNode)
        ;

      this.maxTop = $stem.innerHeight() - $knob.outerHeight(true) + minPct

      $(this.knobNode).draggable({
        containment: $(this.stemNode),
        axis: 'y',
        drag: this.handleDrag
      });
    }
  }

  setStemNode = (node) => {
    this.stemNode = node;
    this.initIfReady();
  }

  setKnob = (node) => {
    this.knobNode = node;
    this.initIfReady();
  }

  calcKnobStyle = () => {
    if (this.maxTop) {
      return {
        top: -1 * ((this.pct * this.maxTop / (maxPct * 1.0)) - this.maxTop)
      }
    } else {
      return {};
    }
  }

  handlePlusClick = () => {
    this.updatePct(Math.min(this.pct + 1, maxPct));
  }

  handleMinusClick = () => {
    this.updatePct(Math.max(this.pct - 1, minPct));
  }

  updatePctFromCard = () => {
    this.pct = this.getPctFromCard();
  }

  render() {
    this.updatePctFromCard()

    return (
      <div className='zoom-controls'>
        <div className='zoom-txt txt'>{this.pct + '%'}</div>
        <div className='zoom ctrl'>
          <div className='dir plus noselect' onClick={this.handlePlusClick}>+</div>
          <div className='stem' ref={this.setStemNode}>
            <div className='lft'></div>
            <div className='rt'></div>
            <div
              className='knob'
              ref={this.setKnob}
              style={this.calcKnobStyle()}
            ></div>
          </div>
          <div className='dir minus noselect' onClick={this.handleMinusClick}>&ndash;</div>
        </div>
      </div>
    )
  }
}

export default ImageZoomControls
