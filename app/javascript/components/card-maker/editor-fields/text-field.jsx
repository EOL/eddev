import React from 'react';

import fieldWrapper from './field-wrapper'

class TextField extends React.Component {
  render() {
    return (
      <div className='text-field-wrap'>
        <div className='text-input-wrap flex-wrap'>
          <input className='text-input text-field-input text-entry' type='text' />
        </div>
      </div>
    )
  }
}

/*
.text-field-wrap
  .text-input-wrap.flex-wrap
    %input.text-input.text-field-input.text-entry{:type => "text"}>
    :plain
      {{#if pc.choices}}
        <div class="text-input-btn">
          <i class="icon-drop suggestion-icon"></i>
        </div>
      {{/if}}
  :plain
    {{#if pc.fontSizes}}
      <div class="font-size-box">{{> fontSizeInner }}</div>
    {{/if}}
*/

export default fieldWrapper(TextField, false);
