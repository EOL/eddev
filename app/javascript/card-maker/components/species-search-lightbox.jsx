import React from 'react'
import ReactModal from 'react-modal'

import SpeciesSearch from './species-search'
import UserResourceFilter from './user-resource-filter'

import styles from 'stylesheets/card_maker/card_manager'

class SpeciesSearchLightbox extends React.Component {
  constructor(props) {
    super(props);
  }

  handleRequestClose = () => {
    this.props.handleClose();
  }

  render() {
    return (
      <ReactModal
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
        <SpeciesSearch {...this.props} />
      </ReactModal>
    )
  }
}

export default SpeciesSearchLightbox;
