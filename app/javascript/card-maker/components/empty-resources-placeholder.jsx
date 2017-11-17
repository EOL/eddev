import React from 'react'

class EmptyResourcesPlaceholder extends React.Component {
  render() {
    return (
      <div
        className='user-resource-wrap resource-wrap'
        onClick={this.props.handleCreate}
      >
        <div className='empty-new-item'>
          <div className='no-items-msg'>{this.props.emptyMsg}</div>
          <div className='new-btn'>{this.props.createMsg}</div>
        </div>
      </div>
    )
  }
}

export default EmptyResourcesPlaceholder
