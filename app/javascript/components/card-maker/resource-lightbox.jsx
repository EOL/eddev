import React from 'react'
import CloseButtonModal from 'components/shared/close-button-modal'
import UserResourceFilter from './user-resource-filter'

import styles from 'stylesheets/card_maker/card_manager'

class ResourceLightbox extends React.Component {
  shake = () => {
    this.rootNode && $(this.rootNode).effect('shake');
  }

  handleSubmit = () => {
    if (!this.props.handleSubmit()) {
      this.shake();
    }
  }

  buildFields = () => {
    return this.props.fields.map((field, i) => {
      var jsx;

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
      } else {
        throw new TypeError('unknown field type ' + field.type);
      }

      return jsx;
    });
  }

  render() {
    return (
      <CloseButtonModal
        isOpen={this.props.isOpen}
        contentLabel={this.props.contentLabel}
        parentSelector={() => {return document.getElementById('Page')}}
        overlayClassName='fixed-center-wrap disable-overlay'
        className={styles.lNewLightbox}
        bodyOpenClassName='noscroll'
        onRequestClose={this.props.handleRequestClose}
      >
        <div ref={(node) => this.rootNode = node}>
          <div className={styles.lNewCol}> 
            {this.buildFields()}
          </div>
          <div className={styles.lNewCol}>
            <div>
              <button className={styles.createBtn} onClick={this.handleSubmit}>
                {this.props.submitLabel}
              </button>
            </div>
          </div>
          {
            this.props.message != null &&
            <p className={styles.resourceLightboxMsg}>{this.props.message}</p>
          }
        </div>
      </CloseButtonModal>
    );
  }
}

export default ResourceLightbox;
