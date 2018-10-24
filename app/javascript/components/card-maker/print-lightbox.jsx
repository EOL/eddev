import React from 'react'
import CloseButtonModal from 'components/shared/close-button-modal'
import {cardMakerUrl} from 'lib/card-maker/url-helper'
import styles from 'stylesheets/card_maker/card_manager'

const noneKey = 'none';

class CardBack extends React.Component {
  render() {
    return (
      <li className={styles.cardBack} onClick={this.props.handleClick}>
        <div className={styles.cardBackImg}>{this.props.img}</div>
        <div>{this.props.name}</div>
        <input 
          type="radio" 
          name="id" 
          value={this.props.id} 
          ref={(node) => this.radio = node}
          checked={this.props.isSelected}
        />
      </li>
    );
  }
}

class PrintLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.loaded = false;
  }

  componentDidMount() {
    $.getJSON(cardMakerUrl('/card_backs'), (response) => {
      this.cardBacks = response;
      this.setState({
        loaded: true,
        selection: this.cardBacks[0].key
      })
    });
  }

  render() {
    return (
      <CloseButtonModal
        isOpen={this.props.isOpen}
        contentLabel={'print options'}
        className={[styles.lNewLightbox, styles.cardBackLightbox].join(' ')}
        parentSelector={() => {return document.getElementById('Page')}}
        overlayClassName='fixed-center-wrap disable-overlay'
        bodyOpenClassName='noscroll'
        onRequestClose={this.props.onRequestClose}
      >
        {
          this.state.loaded ? (
            <div>
              <div className={styles.cardBacksHdr}>{I18n.t('react.card_maker.select_card_back')}</div>
              <ul className={styles.cardBacks}>
                {
                  this.cardBacks.map((back) => {
                    return (
                      <CardBack 
                        id={back.key}
                        img={<img src={back.imgUrl}/>}
                        name={back.name}
                        key={back.key}
                        isSelected={this.state.selection === back.key}
                        handleClick={() => this.setState({ selection: back.key })}
                      />
                    );
                  })
                }
                <CardBack
                  id={noneKey}
                  key={noneKey}
                  img={<i className='fa fa-ban fa-4x' />}
                  name={I18n.t('react.card_maker.none')}
                  isSelected={this.state.selection === null}
                  handleClick={() => this.setState({ selection: null })}
                />
              </ul>
              <button 
                className={[styles.createBtn, styles.createBtnCardBacks].join(' ')} 
                onClick={() => this.props.handleSubmit(this.state.selection)}
              >
                Create printable PDF
              </button>
            </div>
          ) :
            (
              <div className={styles.cardBackLightboxSpinner}>
                <i className="fa fa-4x fa-spinner fa-spin" /> 
              </div>
            )
        }
      </CloseButtonModal>
    );
  }
}

export default PrintLightbox;

