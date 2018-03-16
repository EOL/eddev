import React from 'react'
import ReactModal from 'react-modal'
import styles from 'stylesheets/card_maker/card_manager'

function deckLightboxWrapper(WrappedComponent, options) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        name: props.startingName || '',
        errMsg: '',
        shouldSubmit: false,
      }
    }

    componentWillReceiveProps(newProps) {
      if (newProps.startingName && this.props.startingName !== newProps.startingName) {
        this.setState({
          name: newProps.startingName
        });
      }
    }

    handleNameInput = (e) => {
      let name = e.target.value
        , taken = name.length ? this.props.deckNames.has(name) : false
        , errMsg
        ;

      if (taken) {
        errMsg = I18n.t('react.card_maker.name_taken');
      }

      this.setState({
        name: name,
        errMsg: errMsg
      });
    }

    handleSubmit = () => {
      let blank = !this.state.name.length;
    
      if (this.state.errMsg || blank) {
        if (blank) {
          this.setState({
            errMsg: I18n.t('react.card_maker.name_cant_be_blank')
          });
        }

        this.shake();
      } else {
        this.setState({
          shouldSubmit: true
        });
      }
    }

    handleSubmitted = () => {
      this.setState({
        shouldSubmit: false
      });
      this.props.handleRequestClose();
    }

    handleRequestClose = () => {
      this.setState({
        name: '',
        errMsg: ''
      });

      this.props.handleRequestClose();
    }

    shake = () => {
      $(this.rootNode).effect('shake');
    }

    render() {
      return (
        <ReactModal
          isOpen={this.props.isOpen}
          contentLabel={options.contentLabel}
          parentSelector={() => {return document.getElementById('Page')}}
          overlayClassName='fixed-center-wrap disable-overlay'
          className={styles.lNewLightbox}
          bodyOpenClassName='noscroll'
          onRequestClose={this.props.handleRequestClose}
        >
          <div ref={(node) => this.rootNode = node}>
            <div className={styles.lNewCol}> 
              <div className={styles.lInputWithError}>
                {
                  this.state.errMsg != null &&
                  <div>{this.state.errMsg}</div>
                }
                <input 
                  type="text"
                  value={this.state.name}
                  onChange={this.handleNameInput}
                  placeholder={I18n.t('react.card_maker.enter_deck_name')}
                  className={[
                    styles.newInput, 
                    styles.newInputTxt, 
                    (this.state.errMsg ? styles.isNewInputError : '')
                  ].join(' ')}
                />
              </div>
              <WrappedComponent
                name={this.state.name}
                shouldSubmit={this.state.shouldSubmit}
                handleSubmitted={this.handleSubmitted}
                {...this.props}
              />
            </div>
            <div className={styles.lNewCol}>
              <div>
                <button className={styles.createBtn} onClick={this.handleSubmit}>
                  {options.submitLabel}
                </button>
              </div>
            </div>
          </div>
        </ReactModal>
      );
    }
  }
}

export default deckLightboxWrapper;
