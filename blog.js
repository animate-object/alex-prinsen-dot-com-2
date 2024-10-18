import { fetchPostList } from "./api.js";

const getPostListEl = (id = "blog-posts") => document.getElementById(id);
const getPaginationEl = (id = "pagination") => document.getElementById(id);
const MIDDLE_DOT = "・";
const PAGE_SIZE = 10;

// return object like { prev: number | null, current: number, next: number | null }
const computePaginationOptions = (pageCount, pageNo) => {
  const prev = pageNo > 1 ? pageNo - 1 : null;
  const next = pageNo < pageCount ? pageNo + 1 : null;
  return { prevNo: prev, currentNo: pageNo, nextNo: next };
};

export const loadAndRenderPage = (pageNo) => {
  loadPage(pageNo).then((posts) => renderPostList(posts));
};

const paginationIndicator = (name, onclick = null) => {
  const el = document.createElement("span");
  el.classList.add("pagination-indicator");
  if (onclick) {
    const link = document.createElement("a");
    link.href = "#";
    link.onclick = onclick;
    link.innerText = name;
    el.appendChild(link);
  } else {
    el.innerText = name;
  }
  return el;
};

const rerenderPaginationOptions = (pageCount, pageNo) => {
  const paginationEl = getPaginationEl();
  paginationEl.innerHTML = "";

  const { prevNo, currentNo, nextNo } = computePaginationOptions(
    pageCount,
    pageNo
  );

  const elements = [];

  if (prevNo != null) {
    const prev = paginationIndicator("Prev", () => loadAndRenderPage(prevNo));
    elements.push(prev);
  } else {
    const prev = paginationIndicator(MIDDLE_DOT);
    elements.push(prev);
  }

  const current = paginationIndicator(currentNo);
  elements.push(current);

  if (nextNo) {
    const next = paginationIndicator("Next", () => loadAndRenderPage(nextNo));
    elements.push(next);
  } else {
    const next = paginationIndicator(MIDDLE_DOT);
    elements.push(next);
  }

  elements.forEach((el) => {
    paginationEl.appendChild(el);
  });
};

const loadPage = (pageNo) => {
  return fetchPostList(PAGE_SIZE, pageNo).then(({ data, pagination }) => {
    rerenderPaginationOptions(pagination.pageCount, pageNo);
    return data;
  });
};

const postListItem = (title, slug, date) => {
  const listItem = document.createElement("li");

  const displayDate = new Date(date).toLocaleDateString();

  listItem.innerHTML = `
        <li class='flex-row flex-start flex-wrap'>
        <h2 class='post-title'>
        <span>${displayDate}</span>
        <a href="/post#${slug}" class="flex-shrink-0">${title}</a>
        </h2>
        </li>
    `;
  return listItem;
};

const renderPostList = (posts, postList = getPostListEl()) => {
  postList.innerHTML = "";
  console.log(posts);
  posts.forEach((post) => {
    const { title, slug, createdAt } = post.attributes;
    postList.appendChild(postListItem(title, slug, createdAt));
  });
};

loadAndRenderPage(1);
