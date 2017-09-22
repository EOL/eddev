import React from 'react'

import TextField from './editor-fields/text-field'
import ColorSchemeField from './editor-fields/color-scheme-field'

const fieldTypesToComponents = {
  'text': TextField,
  'color-scheme': ColorSchemeField
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
          , setChoiceIndex = this.props.setCardChoiceIndex.bind(null, field.id)
          , setDataAttrNotDirty = this.props.setCardDataNotDirty.bind(null, field.id)
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
              setChoiceIndex={setChoiceIndex}
              forceCardDirty={this.props.forceCardDirty}
              disableCol={this.props.disableCol}
              enableCol={this.props.enableCol}
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
