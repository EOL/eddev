import React from 'react'

class CardEditor extends React.Component {
  render() {
    return (
      <div id='CardGeneratorWrap' className='card-generator-wrap'>
        <div className='hdr-spacer green'></div>
        <div id='CardGenerator' className='card-generator card-screen'>
          <div className='screen-inner'>
            <div className='welcome-block generator-welcome-block'>
              <div className='manager-btn' onClick={this.props.handleCloseClick}>
                <div className='manager-btn-bg'></div>
                <div className='manager-btn-back-txt'> go back to</div>
                <div className='manager-btn-txt-wrap'>
                  <i className='icon-deck' />
                  <div className='manager-btn-txt'>Card Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CardEditor
