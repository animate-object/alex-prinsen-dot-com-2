import { findOnePost } from "./api.js";
import { renderAllBlocks } from "./blockerRenderer.js";

const getTitleEl = () => document.getElementById("post-title");
const getContentEl = () => document.getElementById("post-content");

const getHash = () => {
  return window.location.hash.slice(1);
};

const loadPost = (slug) => {
  return findOnePost(slug);
};

const renderPost = (post) => {
  const { title, content } = post.attributes;
  const postEl = getContentEl();
  const titleEl = getTitleEl();
  titleEl.innerText = title;

  // set window title
  document.title = `Blue Blog - ${title}`;

  const blockEls = renderAllBlocks(content);
  blockEls.forEach((el) => postEl.appendChild(el));
};

const loadCurrentPost = () => {
  const slug = getHash();
  loadPost(slug).then((post) => {
    console.log(post);
    renderPost(post);
  });
};

loadCurrentPost();
