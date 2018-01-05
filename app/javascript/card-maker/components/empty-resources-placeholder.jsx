import React from 'react'
import resourceWrapper from './resource-wrapper'
import styles from 'stylesheets/card_maker/card_manager'

class EmptyResourcesPlaceholder extends React.Component {
  render() {
    return (
      <div
        className={[styles.fillParent, styles.newResource].join(' ')}
        onClick={this.props.handleCreate}
      >
        <div>{this.props.createMsg}</div>
        <i className='fa fa-plus fa-2x' />
      </div>
    )
  }
}

export default resourceWrapper(EmptyResourcesPlaceholder, [])
