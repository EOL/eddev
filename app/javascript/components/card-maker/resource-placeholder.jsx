import React from 'react'
import resourceWrapper from './resource-wrapper'
import styles from 'stylesheets/card_maker/card_manager'

function ResourcePlaceholder(props) {
  return <div className={[styles.fillParent, styles.resourcePlaceholder].join(' ')} />;
}

export default resourceWrapper(ResourcePlaceholder, [])
