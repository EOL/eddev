import React from 'react'

import TextField from './editor-fields/text-field'
import ColorSchemeField from './editor-fields/color-scheme-field'
import LabeledChoiceImageField from './editor-fields/labeled-choice-image-field'
import ImageField from './editor-fields/image-field'
import KeyValListField from './editor-fields/key-val-list-field'
import MultilineTextField from './editor-fields/multiline-text-field'
import IconField from './editor-fields/icon-field'

const fieldTypesToComponents = {
  'text': TextField,
  'color-scheme': ColorSchemeField,
  'labeled-choice-image': LabeledChoiceImageField,
  'text-icon': LabeledChoiceImageField,
  'icon': IconField,
  'image': ImageField,
  'key-val-list': KeyValListField,
  'multiline-text': MultilineTextField,
}

class CardFields extends React.Component {
  buildFields = () => {
    const fieldElmts = [];

    if (this.props.card) {
      let fields = this.props.card.editableFields();

      for (let i = 0; i < fields.length; i++) {
        let field = fields[i]
          , value = this.props.card.resolvedFieldData(field)
          , choices = this.props.card.getFieldChoices(field.id)
          , choiceTips = this.props.card.getFieldChoiceTips(field.id)
          , setDataAttr = this.props.setCardData.bind(null, field.id)
          , setChoiceKey = this.props.setCardChoiceKey.bind(null, field.id)
          , setDataAttrNotDirty = this.props.setCardDataNotDirty.bind(null, field.id)
          , setUserDataAttr = this.props.setCardUserDataAttr.bind(null, field.id)
          , setUserDataRef = this.props.setCardUserDataRef.bind(null, field.id)
          , setKeyValText = this.props.setCardKeyValText.bind(null, field.id)
          , getDataAttr = this.props.card.getDataAttr.bind(null, field.id)
          , getUserDataAttr = this.props.card.getUserDataAttr.bind(null, field.id)
          , FieldComponent = fieldTypesToComponents[field.type]
          , elmt
          ;

        if (FieldComponent) {
          elmt = (
            <FieldComponent
              field={field}
              key={field.id}
              value={value}
              choices={choices}
              choiceTips={choiceTips}
              setDataAttr={setDataAttr}
              setDataAttrNotDirty={setDataAttrNotDirty}
              getDataAttr={getDataAttr}
              setChoiceKey={setChoiceKey}
              setUserDataAttr={setUserDataAttr}
              setUserDataRef={setUserDataRef}
              setKeyValText={setKeyValText}
              getUserDataAttr={getUserDataAttr}
              userDataRef={this.props.card.getUserDataRef(field.id)}
              forceCardDirty={this.props.forceCardDirty}
              disableCol={this.props.disableCol}
              enableCol={this.props.enableCol}
              customTab={field.allowCustom}
            />
          );

          fieldElmts.push(elmt);

          if (i < fields.length - 1) {
            fieldElmts.push(<div className='field-sep' key={'field-sep-' + i}></div>);
          }
        }
      }
    }

    return fieldElmts;
  }

  render() {
    const fieldElmts = this.buildFields();

    return (
      <div className='card-fields'>
        {fieldElmts}
      </div>
    )
  }
}

export default CardFields
