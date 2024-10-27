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

/**
 * Enable complex elements by specifying separate append and mount points
 *
 * The append point is where children should be appended
 * The mount point is the element that should be appended to the parent
 */
const mountable = (appendEl, mountEl) => {
  return {
    appendPoint: appendEl,
    mountPoint: mountEl ?? appendEl,
  };
};

const isMountable = (el) => {
  if (el.appendPoint && el.mountPoint) {
    return true;
  }
  return false;
};

const toMountable = (el) => {
  if (isMountable(el)) {
    return el;
  }
  return mountable(el);
};

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

const anchorifiedHeadingRenderer = (block) => {
  const heading = headingRenderer(block);

  const text = block.children?.[0]?.text;
  // unexpected scenario, but handle it gracefully
  if (!text) {
    console.warn("No text found in heading block", block);
    return heading;
  }

  const slug = text
    .replace(/[^\w\s]/g, "") // remove non-alphanumeric characters
    .split(" ")
    .slice(0, 6)
    .join("-")
    .toLowerCase();

  const anchor = document.createElement("a");
  anchor.href = `#${slug}`;
  anchor.id = slug;

  heading.appendChild(anchor);
  heading.classList.add("post-heading");

  return {
    appendPoint: anchor,
    mountPoint: heading,
  };
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
  heading: anchorifiedHeadingRenderer,
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
  const renderer = chooseBlockRenderer(block);
  return renderer(block);
};

const appendChild = (parent, child) => {
  const mountableParent = toMountable(parent);
  const mountableChild = toMountable(child);

  mountableParent.appendPoint.appendChild(mountableChild.mountPoint);
};

export const renderBlock = (block) => {
  const el = createBlockEl(block);

  if (block.children) {
    block.children.forEach((child) => {
      const childEl = renderBlock(child);
      appendChild(el, childEl);
    });
  }
  return el;
};

export const renderAllBlocks = (blocks) => {
  return blocks.map(renderBlock).map((el) => toMountable(el).mountPoint);
};
