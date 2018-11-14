import React from 'react'
import styles from 'stylesheets/card_maker/card_editor'

function TextButton(props) {
  var classNames = [styles.textButton]

  if (props.isActive) {
    classNames.push(styles.isTextButtonActive);
  }

  return (
    // mouse down instead of click so we can prevent the editor from losing focus with e.preventDefault
    <li className={classNames.join(' ')} onMouseDown={props.onMouseDown}>
      <i className={`fa fa-${props.icon}`} />
    </li>
  );
}

export default TextButton;

