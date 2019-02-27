import React from 'react'
import resourceWrapper from './resource-wrapper'
import styles from 'stylesheets/card_maker/card_manager'

function CreateButtonResource(props) {
  return (
    <div
      className={[styles.fillParent, styles.newResource].join(' ')}
      onClick={props.handleCreate}
      ref={props.domRef}
    >
      <i className='fa fa-plus fa-2x' />
      <div>{props.createMsg}</div>
    </div>
  );
}

export default resourceWrapper(CreateButtonResource, [])
