import React from 'react'

const minPct = 1
    , maxPct = 100
    ;

class ImageZoomControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pct: maxPct,
    }
  }

  handleDrag = (event, ui) => {
    this.setState((prevState, props) => {
      return {
        pct: Math.round((this.maxTop - ui.position.top) * maxPct * 1.0 /
          this.maxTop)
      };
    });
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
        top: -1 * ((this.state.pct * this.maxTop / (maxPct * 1.0)) - this.maxTop)
      }
    } else {
      return {};
    }
  }

  handlePlusClick = () => {
    this.setState((prevState, props) => {
      return {
        pct: Math.min(prevState.pct + 1, maxPct),
      }
    })
  }

  handleMinusClick = () => {
    this.setState((prevState, props) => {
      return {
        pct: Math.max(prevState.pct - 1, minPct),
      }
    });
  }

  render() {
    return (
      <div className='zoom-controls'>
        <div className='zoom-txt txt'>{this.state.pct + '%'}</div>
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
