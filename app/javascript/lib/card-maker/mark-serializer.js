import { Block, Mark, Node, Value } from 'slate'
import { Set } from 'immutable'
/**
 * Serialize a Slate `value` to a text string with html tags representing marks
 *
 * @param {Value} value
 * @return {String}
 */

function serialize(value, options = {}) {
  return serializeNode(value.document, options)
}

/**
 * Serialize a `node` to plain text.
 *
 * @param {Node} node
 * @return {String}
 */

function serializeNode(node, options = {}) {
  const { delimiter = '\n' } = options

  if (
    node.object == 'document' ||
    node.object == 'block'
  ) {
    return node.nodes.map(serializeNode).join(delimiter);
  } else {
    var hasBold = node.getMarks().some((mark) => {
      return mark.type == 'bold'
    })
    if (hasBold) {
      return '<b>' + node.text + '</b>';
    } else {
      return node.text;
    }
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  serialize
}
