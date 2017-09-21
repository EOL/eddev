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
        <div className='btn-txt'>Close</div>
      </div>
      <div className={saveExitClass} onClick={handleSaveAndExit}>
        <div className='btn-txt'>Save + Exit</div>
      </div>
      <div className={saveClass} onClick={handleSave}>
        <div className='btn-txt'>Quick Save</div>
      </div>
    </div>
  );
}

export default saveExitBtns;
