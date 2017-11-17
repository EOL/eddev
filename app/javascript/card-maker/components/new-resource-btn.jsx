import React from 'react'

class NewResourceBtn extends React.Component {
  render() {
    const btnClass = 'new-resource-btn ' + this.props.btnClass;

    return (
      <div
        id={this.props.id}
        className="new-resource-btn-wrap"
        onClick={this.props.handleClick}
      >
        <div className='new-resource-txt'>{this.props.text}</div>
        <div className={btnClass}>
          <img src={this.props.icon} />
        </div>
      </div>
    )
  }
}

export default NewResourceBtn
