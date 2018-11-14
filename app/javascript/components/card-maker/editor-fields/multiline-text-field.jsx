import React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import Html from 'slate-html-serializer'
import MarkSerializer from 'lib/card-maker/mark-serializer'

import fieldWrapper from './field-wrapper'

const BLOCK_TAGS = {
  p: 'paragraph'
}

const MARK_TAGS = {
  b: 'bold'
}

const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];

      if (type) {
        return {
          object: 'block',
          type: 'paragraph',
          nodes: next(el.childNodes)
        }
      }
    },
    serialize(obj, children) {
      if (obj.object === 'block') {
        return <p>{children}</p>
      }
    }
  },
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: 'mark',
          type: type,
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(obj, children) {
      if (obj.object === 'mark') {
        switch (obj.type) {
          case 'bold':
            return <b>{children}</b>
        }
      }
    }
  }
]

const html = new Html({ rules })

class MultilineTextField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: html.deserialize(this.props.value.text || '')
    }
  }

  handleChange = ({ value }) => {
    if (value != this.state.value) {
      var serialized = MarkSerializer.serialize(value)
      console.log(serialized);
      this.props.setDataAttr('text', serialized);
    }

    this.setState({ value });
  }

  onKeyDown = (event, editor, next) => {
    if (!event.ctrlKey) return next()
    // Decide what to do based on the key code...
    switch (event.key) {
      // When "B" is pressed, add a "bold" mark to the text.
      case 'b': {
        event.preventDefault()
        editor.addMark('bold')
      }
      default: {
        return next()
      }
    }
  }

  renderMark = (props, editor, next) => {
    switch (props.mark.type) {
      case 'bold':
        return <b>{props.children}</b>;
      default:
        return next();
    }
  }

  render() {
    return (
      <Editor 
        className={'text-entry multiline-text-field-input'}
        value={this.state.value}
        onChange={this.handleChange}
        onKeyDown={this.onKeyDown}
        renderMark={this.renderMark}
      />
    );
  }
}

export default fieldWrapper(MultilineTextField)
