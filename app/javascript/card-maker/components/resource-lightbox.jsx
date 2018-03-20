import React from 'react'
import ReactModal from 'react-modal'
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
      var field;

      if (field.type === "text") {
        field = (
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
        field = null;
        console.log('create select field', field.options);
      } else {
        throw new TypeError('unknown field type ' + field.type);
      }

      return field;
    });
  }

  render() {
    return (
      <ReactModal
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
        </div>
      </ReactModal>
    );
  }
}

export default ResourceLightbox;
