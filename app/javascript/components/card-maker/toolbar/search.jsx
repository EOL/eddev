import React from 'react'

import styles from 'stylesheets/card_maker/simple_manager'

function Search(props) {
  return (
    <ul className={styles.toolbarBtns}>
      <li 
        className={[styles.toolbarBtn, styles.toolbarBtnBack].join(' ')}
        onClick={props.onRequestClose}
      ><i className='fa fa-lg fa-arrow-left' /></li>
      <li className={styles.toolbarSearch}>
        <input 
          autoFocus
          type='text' 
          value={props.value} 
          onChange={(e) => props.onRequestUpdateValue(e.target.value)} 
          placeholder={'start typing to search cards'}
        />
        {
          (props.value == null || props.value == '') ?
            <i className='fa fa-lg fa-search' /> :
            <i 
              className='fa fa-lg fa-close' 
              onClick={() => { props.onRequestUpdateValue('') }}
            /> 
        }
      </li>
    </ul>
  );
}

export default Search;

