import React from 'react'

import styles from 'stylesheets/shared/react_layout'

function Page(props) {
  let inner;

  if (props.noMainCol) {
    inner = props.children;  
  } else {
    inner = (
      <div className={styles.lMainCol}>
        {props.children}
      </div>
    );
  }

  return (
    <div className={styles.lPage}>
      {inner}
    </div>
  );
}

export default Page;
