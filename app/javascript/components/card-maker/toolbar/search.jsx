import React from 'react'
import ReactAutocomplete from 'react-autocomplete'
import styles from 'stylesheets/card_maker/simple_manager'

function Search(props) {
  return (
    <ul className={styles.toolbarBtns}>
      {
        props.showBack && ( 
          <li 
            className={[styles.toolbarItem, styles.toolbarBtn, styles.toolbarBtnBack].join(' ')}
            onClick={props.onRequestClose}
          ><i className='fa fa-lg fa-arrow-left' /></li>
        )
      }
      <li className={[styles.toolbarItem, styles.toolbarSearch].join(' ')}>
        <ReactAutocomplete
          items={props.autocompleteItems || []}
          getItemValue={item => item.name}
          onChange={(e) => props.onRequestUpdateValue(e.target.value)}
          onSelect={(val, item) => {}}
          renderItem={(item, isHighlighted, style) =>
            <div style={{ ...style, cursor: 'pointer', background: isHighlighted ? 'lightgray' : 'white' }}>
              {item.name}
            </div>
          }
          inputProps={{autoFocus: props.autoFocus, placeholder: props.placeholder}}
          renderInput={(props) =>
            <input 
              autoFocus={props.autoFocus}
              className={styles.toolbarSearchInput}
              type='text' 
              placeholder={props.placeholder}
              {...props}
            />
          }
          renderMenu={function(items, value, style)  {
            return items.length > 0 ? 
              <div 
                style={{ ...style, ...this.menuStyle, padding: 10, zIndex: 10, background: 'white' }} 
                children={items} 
              /> :
              <div></div>;
          }}
          value={props.value}
          wrapperStyle={{}}
          onSelect={props.onAutocompleteSelect}
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

