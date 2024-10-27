import { findOnePost } from "./api.js";
import { renderAllBlocks } from "./blockRenderer.js";

const getTitleEl = () => document.getElementById("post-title");
const getContentEl = () => document.getElementById("post-content");

const getPostSlug = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const rawSlug = urlParams.get("post");
  if (!rawSlug || rawSlug === "") {
    return null;
  }
  // check matches the pattern of a valid slug (alphanumeric kebab-case)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rawSlug)) {
    return null;
  }
  return rawSlug;
};

const loadPost = (slug) => {
  return findOnePost(slug);
};

const scrollToHash = () => {
  const hash = window.location.hash;
  if (!hash) {
    return;
  }
  const anchorEl = document.getElementById(hash.slice(1));
  if (!anchorEl) {
    console.warn(`No element found with id: ${hash}`);
    return;
  }
  anchorEl.scrollIntoView();
};

const renderPost = (post) => {
  const { title, content } = post.attributes;
  const postEl = getContentEl();
  const titleEl = getTitleEl();
  titleEl.innerText = title;

  document.title = `Blue Blog - ${title}`;

  const blockEls = renderAllBlocks(content);
  blockEls.forEach((el) => postEl.appendChild(el));

  scrollToHash();
};

const renderError = (message) => {
  const postEl = getContentEl();

  const errorEl = document.createElement("h2");
  errorEl.innerText = message;

  postEl.appendChild(errorEl);
};

const loadCurrentPost = () => {
  const slug = getPostSlug();
  if (!slug) {
    renderError("Invalid post identifier");
    return;
  }

  loadPost(slug).then((post) => {
    renderPost(post);
  });
};

loadCurrentPost();
