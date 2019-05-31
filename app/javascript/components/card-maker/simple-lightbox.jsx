import React from 'react'
import CloseButtonModal from 'components/shared/close-button-modal'
import UserResourceFilter from './user-resource-filter'
import styles from 'stylesheets/card_maker/simple_manager'

function SimpleLightbox(props) {
  const buildFields = () => {
    return props.fields.map((field, i) => {
      var jsx;

      /*
      if (field.type === "text") {
        jsx = (
          <div className={styles.lInputWithError} key={i}>
            {
              field.errMsg != null &&
              <div>{field.errMsg}</div>
            }
            <input 
              type="text"
              value={field.value}
              onChange={field.handleChange}
              placeholder={field.placeholder}
              className={[
                styles.newInput, 
                styles.newInputTxt, 
                (field.errMsg ? styles.isNewInputError : '')
              ].join(' ')}
            />
          </div>
        );
      } else if (field.type === "select") {
        jsx = (
          <UserResourceFilter
            filterItems={field.options}
            handleSelect={field.handleSelect}
            selectedId={field.selectedId}
            key={i}
          />
        );
      */
      if (field.type === 'textarea') {
        jsx = (
          <textarea 
            className={[styles.modalInput, styles.modalInputTextarea].join(' ')}
            value={field.value} 
            onChange={(e) => field.onChange(e.target.value)}
            key={i}
          />
        );
      } else if (field.type === 'text') {
        let classNames = [
          styles.modalInput, 
          styles.modalInputText
        ];

        if (field.errMsg != null) {
          classNames.push(styles.isModalInputTextErr);
        }
        
        jsx = (
          <div className={styles.modalInputWrap} key={i}>
            <input 
              type="text"
              value={field.value}
              onChange={(e) => { field.onChange(e.target.value) }}
              placeholder={field.placeholder}
              className={classNames.join(' ')}
            />
            {
              field.errMsg != null &&
              <div className={styles.modalInputErr}>{field.errMsg}</div>
            }
          </div>
        );
      } else if (field.type === "select") {
        jsx = (
          <UserResourceFilter
            filterItems={field.options}
            handleSelect={field.handleSelect}
            selectedId={field.selectedId}
            key={i}
          />
        );
      } else {
        throw new TypeError('unknown field type ' + field.type);
      }

      return jsx;
    });
  }

  return (
    <CloseButtonModal
      isOpen={props.isOpen}
      contentLabel={props.contentLabel}
      parentSelector={() => document.getElementById('Page')}
      overlayClassName='fixed-center-wrap disable-overlay'
      bodyOpenClassName='noscroll'
      onRequestClose={props.onRequestClose}
      className={styles.modal}
    >
      {buildFields()}
      {
        props.message != null &&
        <p>{props.message}</p>
      }
      <div 
        className={[styles.btn, styles.btnDesc].join(' ')}
        onClick={props.onSubmit}
      >{props.submitLabel}</div>
    </CloseButtonModal>
  );
}

export default SimpleLightbox;

