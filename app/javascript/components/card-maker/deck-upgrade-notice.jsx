import React from 'react';
import DialogBox from 'components/shared/dialog-box'

function DeckUpgradeNotice(props) {
  return (
    <DialogBox
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      contentLabel={'deck upgrade notice'}
      message={I18n.t('react.card_maker.need_to_upgrade')}
    />
  );
}

export default DeckUpgradeNotice;

