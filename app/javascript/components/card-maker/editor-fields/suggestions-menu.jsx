import React from 'react';

import blueArrow from 'images/card_maker/menu_arrow_blue.png';

const arrowDim = 20
    , menuBorder = 3
    ;

class SuggestionsMenu extends React.Component {
  setRootNode = (node) => {
    this.node = node;
  }

  setArrowNode = (node) => {
    this.arrowNode = node;
  }

  getTop = () => {
    if (!this.props.anchor) {
      return 0;
    }

    let anchorBottom = this.props.anchor.offsetTop +
          this.props.anchor.getBoundingClientRect().height
        ;

    return anchorBottom + arrowDim;
  }

  getRootStyle = () => {
    return {
      top: this.getTop() + 'px',
    }
  }

  getArrowStyle = () => {
    let left = this.props.anchor ?
          this.props.anchor.offsetLeft + this.props.anchor.getBoundingClientRect().width / 2 - arrowDim / 2 - menuBorder:
          0
      ;

    return {
      left: left,
    }
  }

  render() {
    let rootClass = 'suggestions disable-exempt';

    if (!this.props.open) {
      rootClass += ' hidden';
    }

    return (
      <div className={rootClass} style={this.getRootStyle()}>
        <img
          src={blueArrow}
          className='arrow'
          ref={this.setArrowNode}
          style={this.getArrowStyle()}
        />
        <div className='hdr'>Suggestions</div>
        <ul className='items'>
          {
            this.props.items.map((item) => {
              return (
                <li
                  className='item'
                  key={item}
                  onClick={() => this.props.handleSelect(item)}
                >
                  {item}
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

export default SuggestionsMenu
