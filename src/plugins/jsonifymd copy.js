import { Remarkable } from "/web_modules/remarkable/dist/esm/index.browser.js";

const dictify_list_by = (blocks, matches_heading) => {
  const result = new Map();
  let cur = null;
  let children = [];

  blocks.forEach(block => {
    if (matches_heading(block)) {
      if (cur) { // Pop cur, children into result
        result.set(cur, children)
      }
      cur = block
      children = []
    } else {
      children.push(block)
    }
  })

  if (cur) {
    result.set(cur, children);
  }

  return result
}

const _ensure_list_singleton = (blocks) => {
  const lists = blocks.filter(e => e.t === 'List');

  if (blocks.length > 1 & lists.length > 0) {
    const l = lists[0];
    throw Error(`Error at line ${l.start_line}: Can't mix lists and other content`)
  }
}

const extractInline = (nodes) => {
  if (nodes[1].type === "inline") return nodes[1].content;
  return nodes.filter(node => node.nodes).flatMap(node => extractInline(node.nodes))
}

const extractNodes = (blocks, lines) => blocks
  .filter(block => !["hr"].includes(block.type))
  .flatMap(block => {
    if (block.type === "bullet_list") {

      return [extractInline(block.nodes)]
    }

    if (block.content) {

      return block.content;
    }

    const sub = lines.slice(...block.nodes[0].lines);

    return sub;
  })

const _dictify_blocks = (blocks, heading_level, lines) => {
  const matches_heading = (block) => block.type == 'heading' && block.nodes[0].hLevel == heading_level;

  if (!blocks.some(b => matches_heading(b))) {
    return extractNodes(blocks, lines);
  }

  console.log(blocks);

  const splitted = dictify_list_by(blocks, matches_heading);
  const newsplitted = [...splitted.keys()].reduce((prev, headingBlock) => {
    const heading = headingBlock.nodes[1].content;
    const subBlocks = splitted.get(headingBlock);
    const index = subBlocks.findIndex(b => b.type === "heading");
    prev.push({
      heading,
      content: [
        ...index !== -1 ? extractNodes(subBlocks.slice(0, index), lines) : [],
        ..._dictify_blocks(subBlocks, heading_level + 1, lines)]
    })
    return prev;
  }, []);

  return newsplitted
}

const nest = (ast, text) => {
  return _dictify_blocks(ast.nodes, 1, text.split(/\r?\n/))
}

function ast(str, options) {
  var md = new Remarkable(options);
  var tokens = md.parse(str, md);

  var node = { type: 'root', nodes: [] };
  var nodes = [node];
  var stack = [];

  var len = tokens.length;
  var idx = -1;

  function last() {
    return stack.length ? stack[stack.length - 1] : nodes[nodes.length - 1];
  }

  while (++idx < len) {
    var tok = tokens[idx];
    var prev = last();

    if (isOpen(tok)) {
      var token = { type: toType(tok), nodes: [tok] };
      prev.nodes.push(token);
      stack.push(token);
    } else if (isClose(tok)) {
      var parent = stack.pop();
      parent.nodes.push(tok);
    } else {
      prev.nodes.push(tok);
    }
  }

  return node;
}

function isOpen(tok) {
  return /_open$/.test(tok.type);
}

function isClose(tok) {
  return /_close$/.test(tok.type);
}

function toType(tok) {
  return tok.type.replace(/_open$/, '');
}


const jsonifymd = async (markdown_file) => {
  const response = await fetch(markdown_file);
  const data = await response.text();

  const output = ast(data);
  console.log(output);
  console.log(nest(output, data))
}

export default jsonifymd;