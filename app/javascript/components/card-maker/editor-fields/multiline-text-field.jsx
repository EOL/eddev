import React from 'react'

import fieldWrapper from './field-wrapper'

class MultilineTextField extends React.Component {
  handleChange = (event) => {
    this.props.setDataAttr('text', event.target.value);
  }

  render() {
    return (
      <textarea
        className='text-entry multiline-text-field-input'
        value={this.props.value.text || ''}
        onChange={this.handleChange}
      />
    )
  }
}

export default fieldWrapper(MultilineTextField)
