import React from 'react'

import TextField from './editor-fields/text-field'

class CardFields extends React.Component {
  buildFields = () => {
    const fieldElmts = [];

    if (this.props.card) {
      let fields = this.props.card.editableFields();

      for (let i = 0; i < fields.length; i++) {
        let field = fields[i]
          , value = this.props.card.resolvedFieldData(field)
          , choices = this.props.card.getFieldChoices(field.id)
          , setDataAttr = this.props.setCardData.bind(null, field.id)
          , setDataAttrNotDirty = this.props.setCardDataNotDirty.bind(null, field.id)
          , elmt = null
          ;


        switch (field.type) {
          case 'text':
            elmt = (
              <TextField
                field={field}
                key={field.id}
                value={value}
                choices={choices}
                setDataAttr={setDataAttr}
                setDataAttrNotDirty={setDataAttrNotDirty}
                forceCardDirty={this.props.forceCardDirty}
                disableCol={this.props.disableCol}
                enableCol={this.props.enableCol}
              />
            );
            break;
          /*
          case 'image':
            $elmt = buildImageField(field);
            break;
          case 'color-scheme':
            $elmt = buildColorSchemeField(field);
            break;
          case 'labeled-choice-image':
            $elmt = buildLabeledChoiceImageField(field);
            break;
          case 'key-val-list':
            $elmt = buildKeyValListField(field);
            break;
          case 'multiline-text':
            $elmt = buildMultilineTextField(field);
            break;
          */
          default:
            //console.log(field, 'type not recognized');
        }

        if (elmt) {
          fieldElmts.push(elmt);

          if (i < fields.length - 1) {
            // push separator
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
