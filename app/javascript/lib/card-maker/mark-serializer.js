import { Block, Mark, Node, Value } from 'slate'
import Html from 'slate-html-serializer'
import { Set } from 'immutable'

const MARK_TAGS = {
  strong: 'bold',
  em: 'italic'
}

const htmlRules = [
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
				serialize(obj, children) {} // unused
			}
		]
	, html = new Html({ rules: htmlRules })
	;

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
    return node.leaves.map((leaf) => {
      var beforeTags = []
        , afterTags = []
        ;

      leaf.marks.forEach((mark) => {
        switch (mark.type) {
          case 'bold': {
            beforeTags.push('<strong>');
            afterTags.push('</strong>');
            break;
          }
          case 'italic': {
            beforeTags.push('<em>');
            afterTags.push('</em>');
            break;
          }
        }
      });

      return beforeTags.join('') + leaf.text + afterTags.reverse().join('');
    }).join('');
  }
}

function deserialize(string, options = {}) {
  let {
    defaultBlock = 'line',
    defaultMarks = [],
    delimiter = '\n',
    toJSON = false,
  } = options

  defaultBlock = Node.createProperties(defaultBlock)
  defaultMarks = defaultMarks.map(Mark.createProperties)

  const json = {
    object: 'value',
    document: {
      object: 'document',
      data: {},
      nodes: string.split(delimiter).map(line => {
        return {
          ...defaultBlock,
          object: 'block',
          data: {},
          nodes: html.deserialize(line).document.nodes
				}
      }),
    },
  }

  const ret = toJSON ? json : Value.fromJSON(json)
  return ret
}
 
/**
 * Export.
 *
 * @type {Object}
 */

export default {
  serialize,
	deserialize
}
