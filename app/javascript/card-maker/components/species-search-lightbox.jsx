import React from 'react'

import SpeciesSearch from './species-search'
import TemplateSelect from './template-select'
import CloseButtonModal from './close-button-modal'
import UserResourceFilter from './user-resource-filter'

import styles from 'stylesheets/card_maker/card_manager'

var cleanState = {
  screen: 'search'
};

class SpeciesSearchLightbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = cleanState;
  }

  handleRequestClose = () => {
    this.props.handleClose();
    this.setState(cleanState);
  }

  screenComponent = () => {
    if (this.state.screen === 'search') {
      return <SpeciesSearch 
        handleClose={this.props.handleClose}
        handleCreate={ (id) => this.props.handleCreate('trait', { speciesId: id }) }
        deckFilterItems={this.props.deckFilterItems}
      />
    } else if (this.state.screen = 'template') {
      return <TemplateSelect handleSelect={this.handleTemplSelect} />
    } else {
      throw new TypeError('unsupported "screen" state value: ' + this.state.screen);
    }
  }

  handleTemplSelect = (templName) => {
    if (templName === 'trait') {
      this.setState({
        screen: 'search'
      });
    } else if (templName === 'title') {
      this.props.handleCreate(templName, {});
    } else {
      throw new TypeError('unrecognized template name: ' + templName);
    }
  }

  render() {
    return (
      <CloseButtonModal
        isOpen={this.props.isOpen}
        contentLabel={I18n.t('react.card_maker.species_search')}
        parentSelector={() => {return document.getElementById('Page')}}
        overlayClassName='fixed-center-wrap disable-overlay'
        className={[styles.lNewLightbox, styles.lNewLightboxNewCard].join(' ')}
        bodyOpenClassName='noscroll'
        onRequestClose={this.handleRequestClose}
      >
        <div className={styles.newCardDeckBar}>
          <div className={styles.newCardDeckLabel}>
            {I18n.t('react.card_maker.select_a_deck_for_card')}
          </div>
          <UserResourceFilter
            topClass={styles.newInputSelectCard}
            anchorClass={styles.newInputAnchorCard}
            itemsClass={styles.newInputSelectItemsCard}
            selected={true}
            count={this.props.deckFilterItems.length - 1}
            filterItems={this.props.deckFilterItems}
            selectedId={this.props.selectedDeckId}
            handleSelect={this.props.handleDeckSelect}
          />
        </div>
        {this.screenComponent()}
        {this.state.screen === 'search' && (
          <button 
            className={styles.selectTemplateBtn} 
            type='button'
            onClick={() => this.setState({ screen: 'template' })}
          >{I18n.t('react.card_maker.click_choose_card_type')}</button>
        )}
      </CloseButtonModal>
    )
  }
}

export default SpeciesSearchLightbox;
