import React from 'react'

function saveExitBtns(props) {
  function handleSave() {
    if (!props.dirty) {
      return false;
    }

    props.handleSave()
  }

  function handleSaveAndExit() {
    if (!props.dirty) {
      return false;
    }

    props.handleSaveAndExit();
  }

  var saveClass = 'btn save'
    , saveExitClass = 'btn save-exit'
    ;

  if (!props.dirty) {
    saveClass += ' disabled';
    saveExitClass += ' disabled';
  }

  return (
    <div className='preview-btns'>
      <div className='btn close' onClick={props.handleClose}>
        <i className='cm-icon-cancel' />
        <div className='btn-txt'>{I18n.t('react.card_maker.close')}</div>
      </div>
      <div className={saveExitClass} onClick={handleSaveAndExit}>
        <i className='cm-icon-save-exit' />
        <div className='btn-txt'>{I18n.t('react.card_maker.save_+_exit')}</div>
      </div>
      <div className={saveClass} onClick={handleSave}>
        <i className='cm-icon-save-quick' />
        <div className='btn-txt'>{I18n.t('react.card_maker.quick_save')}</div>
      </div>
    </div>
  );
}

export default saveExitBtns;
