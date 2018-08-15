import React from 'react'
import styles from 'stylesheets/card_maker/card_manager'

function Search(props) {
  return (
    <div 
      type='search' 
      className={`${styles.search}${props.extraClass ? ` ${props.extraClass}` : ''}`} 
    >
      <i className="fa fa-search" />
      <input 
        type='text'
        placeholder={props.placeholder}
        onChange={(e) => props.handleChange(e.target.value)}
        value={props.value}
      />
    </div>
  );
}

export default Search
