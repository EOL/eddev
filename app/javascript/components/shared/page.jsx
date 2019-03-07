import React from 'react'

import styles from 'stylesheets/shared/react_layout'

function Page(props) {
  return (
    <div className={styles.lPage}>
      {
        props.noMainCol ? 
        props.children : (
          <div className={styles.lMainCol}>
            {props.children}
          </div>
        )
      }
    </div>
  );
}

export default Page;
