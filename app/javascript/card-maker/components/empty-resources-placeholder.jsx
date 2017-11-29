import React from 'react'
import resourceWrapper from './resource-wrapper'
import styles from 'stylesheets/card_maker/card_manager'

class EmptyResourcesPlaceholder extends React.Component {
  render() {
    return (
      <div
        className={styles.fillParent}
        onClick={this.props.handleCreate}
      >
        <div 
          className={
            [styles.resourceNewBlock, styles.resourceNewMsg].join(' ')
          }
        >{this.props.emptyMsg}</div>
        <div 
          className={
            [styles.resourceNewBlock, styles.resourceNewCta].join(' ')
          }>{this.props.createMsg}</div>
      </div>
    )
  }
}

export default resourceWrapper(EmptyResourcesPlaceholder, [])
