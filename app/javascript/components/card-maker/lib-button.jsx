import React from 'react'
import styles from 'stylesheets/card_maker/simple_manager'

function LibButton(props) {
  let buttonText
    , lib
    ;  

  if (props.library === 'user') {
    buttonText = 'switch to public library';  
    lib = 'public';
  } else {
    buttonText = 'switch to your library';
    lib = 'user';
  }

  return (
    <div className={[styles.btn, styles.btnLib, (props.extraClass || '')].join(' ')} onClick={() => props.setLibrary(lib)}>
      {buttonText}
    </div>
  );
}

export default LibButton;

