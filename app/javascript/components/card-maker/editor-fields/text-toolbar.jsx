import React from 'react'
import TextButton from './text-button'
import styles from 'stylesheets/card_maker/card_editor'

function TextToolbar(props) {
  return (
    <ul className={styles.textToolbar}>
      {Object.keys(props.buttons).map(button => {
        return <TextButton 
          icon={button} 
          isActive={props.buttons[button]} 
          onMouseDown={e => {
            console.log(button);
            e.preventDefault();
            props.onButtonClick(button)
          }}
					key={button}
        />
      })}
    </ul>
  );
}

export default TextToolbar;

