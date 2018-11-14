import React from 'react'
import TextButton from './text-button'

function TextToolbar(props) {
  return (
    <div>
      {Object.keys(props.buttons).map(button => {
        return <TextButton 
          icon={button} 
          isActive={props.buttons[button]} 
          onMouseDown={e => {
            console.log(button);
            e.preventDefault();
            props.onButtonClick(button)
          }}
        />
      })}
    </div>
  );
}

export default TextToolbar;

