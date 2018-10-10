import React from 'react'
import styles from 'stylesheets/card_maker/card_manager'

function icon(props) {
  let elmt;

  if (props.value.length) {
    elmt = (
      <i 
        className={`fa fa-close ${styles.searchClear}`}
        onClick={() => props.handleChange('')} 
      />
    );
  } else {
    elmt = <i className="fa fa-search" />;
  }

  return elmt;
}

function Search(props) {
  return (
    <div 
      type='search' 
      className={`${styles.search}${props.extraClass ? ` ${props.extraClass}` : ''}`} 
    >
      {icon(props)}
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
