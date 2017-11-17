import React from 'react'

function fieldWrapper(WrappedElmt, noBorder) {
  return class extends React.Component {
    render() {
      var innerClassName = 'field';

      if (noBorder) {
        innerClassName += ' no-border';
      }

      return (
        <div className='field-wrap'>
          <div className='field-label'>
            <div className='txt'>{this.props.field.label}</div>
          </div>
          <div className={innerClassName}>
            <WrappedElmt {...this.props} />
          </div>
        </div>
      )
    }
  }
}

export default fieldWrapper
