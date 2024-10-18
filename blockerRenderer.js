/**
 * Notes
 *
 * Blocks are objects of the form
 * {
 *  "type": "some type",
 *  "children": [optional array of blocks]
 *  "text": [optional text content]
 *   . . .
 *   optional additional keys
 * }
 *
 * simple blocks can be mapped directly to HTML elements
 *
 * a simple recursive renderer would create an element for the
 * current block and style it, then check for children
 * it would call itself on each child and append the result to the parent
 */

export const unhandledBlockRenderer = (block) => {
  const el = document.createElement("pre");
  el.innerText =
    `Unhandled block type: ${block.type}\n` + JSON.stringify(block, null, 2);
  return el;
};

const simpleRenderer = (tag) => (block) => {
  const el = document.createElement(tag);
  el.innerText = block.text || "";
  return el;
};

const chooseTextTag = ({ italic, bold, underline, strikethrough }) => {
  if (italic) return "i";
  if (bold) return "b";
  if (underline) return "u";
  if (strikethrough) return "s";
  return "span";
};

const textRenderer = (block) => {
  const el = document.createElement(chooseTextTag(block));
  el.innerText = block.text || "";
  return el;
};

const listRenderer = (block) => {
  if (block.format === "ordered") {
    return simpleRenderer("ol")(block);
  } else {
    return simpleRenderer("ul")(block);
  }
};

const headingRenderer = (block) => {
  return simpleRenderer(`h${block.level}`)(block);
};

const linkRenderer = (block) => {
  const url = block.url;
  const el = document.createElement("a");
  el.href = url;
  el.target = "_blank";
  return el;
};

const imageRenderer = (block) => {
  const el = document.createElement("img");

  const { formats, url, alternativeText } = block.image;
  const format = formats?.medium || formats?.large || formats?.small;
  const src = format?.url || url;

  el.src = src;
  el.alt = alternativeText;

  el.onclick = () => {
    window.open(url, "_blank");
  };
  el.style.cursor = "pointer";
  return el;
};

const BLOCK_RENDERERS = {
  paragraph: simpleRenderer("p"),
  text: textRenderer,
  "list-item": simpleRenderer("li"),
  list: listRenderer,
  heading: headingRenderer,
  code: simpleRenderer("code"),
  quote: simpleRenderer("blockquote"),
  link: linkRenderer,
  image: imageRenderer,
};

const chooseBlockRenderer = (block) => {
  const knownRenderer = BLOCK_RENDERERS[block.type];

  return knownRenderer || unhandledBlockRenderer;
};

export const createBlockEl = (block) => {
  // create just this block

  const renderer = chooseBlockRenderer(block);
  return renderer(block);
};

export const renderBlock = (block) => {
  const el = createBlockEl(block);

  if (block.children) {
    block.children.forEach((child) => {
      el.appendChild(renderBlock(child));
    });
  }
  return el;
};

export const renderAllBlocks = (blocks) => {
  return blocks.map(renderBlock);
};
