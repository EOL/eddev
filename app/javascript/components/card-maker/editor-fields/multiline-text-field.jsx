import React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import MarkSerializer from 'lib/card-maker/mark-serializer'
import TextToolbar from './text-toolbar'
import styles from 'stylesheets/card_maker/card_editor'

import fieldWrapper from './field-wrapper'


class MultilineTextField extends React.Component {
  constructor(props) {
    super(props)
    const deserialized = MarkSerializer.deserialize(this.props.value.text || '')
    this.state = {
      value: deserialized
    }
  }

  handleChange = ({ value }) => {
    var serialized = MarkSerializer.serialize(value)
    if (serialized !== this.props.value.text) {
      this.props.setDataAttr('text', serialized);
    }

    this.setState({ value });
  }

  renderMark = (props, editor, next) => {
    switch (props.mark.type) {
      case 'bold':
        return <strong>{props.children}</strong>;
      case 'italic':
        return <em>{props.children}</em>;
      default:
        return next();
    }
  }

  isMarkActive = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type == type);
  }

  render() {
    const buttons = {
      bold: this.isMarkActive('bold'),
      italic: this.isMarkActive('italic'),
    };

    return (
      <div className={styles.richTextField}>
        <TextToolbar 
          buttons={buttons}
          onButtonClick={type => this.editor && this.editor.toggleMark(type)}
        />
        <Editor 
          className={`text-entry ${styles.richTextEditor}`}
          value={this.state.value}
          onChange={this.handleChange}
          renderMark={this.renderMark}
          ref={editor => this.editor = editor}
        />
      </div>
    );
  }
}

export default fieldWrapper(MultilineTextField)
