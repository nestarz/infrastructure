import {
  Remarkable
} from "/web_modules/remarkable/dist/esm/index.browser.js";

function ast(str, options) {
  function isOpen(tok) {
    return /_open$/.test(tok.type);
  }

  function isClose(tok) {
    return /_close$/.test(tok.type);
  }

  function toType(tok) {
    return tok.type.replace(/_open$/, '');
  }

  var md = new Remarkable(options);
  var tokens = md.parse(str, md);

  var node = {
    type: 'root',
    nodes: []
  };
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
      var token = {
        type: toType(tok),
        nodes: [tok]
      };
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

const nest = (ast, level = 1) => {
  if (ast.findIndex(block => block.type === "heading" && block.nodes[0].hLevel === level) === -1) {
    return ast;
  }

  const headings = ast.reduce(
    (result, block) => {
      if (block.type === "heading" && block.nodes[0].hLevel === level) {
        result.state = block.nodes[1].content;
      } else {
        result.dict[result.state] = [
          ...(result.dict[result.state] || []),
          block
        ];
      }

      return result;
    }, {
      dict: {},
      state: null
    }).dict;

  return Object.keys(headings).map(heading => ({
    heading,
    childs: nest(headings[heading], level + 1)
  }));
}


const extractInline = (nodes, raw) => {
  if (nodes[1] && nodes[1].type === "inline") {
    if (!raw && nodes[1].children && nodes[1].children[0].type === "link_open") {
      return {
        url: nodes[1].children[0].href,
        text: nodes[1].children[1].content,
      }
    }
    const string = nodes[1].content;
    return string;
  }
  return nodes.filter(node => node.nodes).flatMap(node => extractInline(node.nodes))
}

const toDict = (nodes) => (Array.isArray(nodes) && nodes[0].heading) ? Object.assign(
  ...nodes.map(({
    heading,
    childs
  }) => ({
    [heading]: childs ? toDict(childs) : null
  }))) : nodes;

const extract = (nodes) => {
  return nodes.flatMap(node => {
    if (Array.isArray(node.childs)) {
      node.childs = extract(node.childs);
    }

    if (["bullet_list", "ordered_list"].includes(node.type)) {
      return extract(node.nodes.filter(node => node.type === "list_item"))
    }
    if (node.type === "list_item") {
      return extract(node.nodes.filter(node => ["paragraph", "bullet_list", "ordered_list"].includes(node.type)))
    }

    if (node.nodes) {
      return extractInline(node.nodes);
    }

    return node;
  })
}

const jsonifymd = async (markdown_file, config = {}) => {
  const response = await fetch(markdown_file);
  const data = await response.text();

  const output = ast(data);
  const headings = nest(output.nodes);

  if (config.toDict) {
    return toDict(extract(headings));
  }
  return extract(headings);
}

export default jsonifymd;