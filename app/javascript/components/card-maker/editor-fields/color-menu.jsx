import React from 'react'
import styles from 'stylesheets/card_maker/card_editor'

function ColorMenu(props) {
  var classes = [styles.colorChoices, styles.isDisableExempt];

  if (props.extraClassName) {
    classes.push(props.extraClassName);
  }

  return (
    <ul 
      key='colorChoices'
      className={classes.join(' ')}
    >
      {
        props.colors.map((color) => {
          return (
            <li
              key={color}
              onClick={() => props.handleSelect(color)}
              style={{ backgroundColor: color }}
            />
          );
        })
      }
    </ul>
  );
}

export default ColorMenu;
