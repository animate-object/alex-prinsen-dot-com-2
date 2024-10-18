// API stuff ============================

const BASE_URL = "http://localhost:1337/api";

export const fetchData = (path, url = BASE_URL) => {
  return fetch(`${url}${path}`)
    .then((response) => response.json())
    .then(({ data }) => data)
    .catch((error) => console.error(error));
};

export const fetchPageableData = (path, url = BASE_URL) => {
  return fetch(`${url}${path}`)
    .then((response) => response.json())
    .then(({ data, meta: { pagination } }) => ({
      data,
      pagination,
    }))
    .catch((error) => console.error(error));
};

const HOME_GALLERY_IMAGES = "/home-page-gallery-images";
const PROJECT_LINKS = "/project-links";
const POSTS = "/posts";

const extractImageData = (imageResponseItem) => {
  const image = imageResponseItem.attributes.image.data.attributes;
  const { formats, name } = image;
  const format = formats?.large || formats?.medium || formats?.small;

  const url = format?.url;

  if (url) {
    return { name, url };
  }
};

const extractAllImages = (imageResponse) => {
  try {
    return imageResponse.map(extractImageData).filter((image) => !!image);
  } catch (error) {
    console.warn("Error processing images");
    console.error(error);
    return [];
  }
};

export const fetchHomeGalleryImages = (
  options = "?populate[0]=image&pagination[pageSize]=25"
) =>
  fetchData(HOME_GALLERY_IMAGES + options)
    .then(extractAllImages)
    .catch((error) => console.error(error));

export const fetchProjectLinks = (
  options = "?pagination[pageSize]=10&sort=createdAt:desc"
) => fetchData(PROJECT_LINKS + options);

export const fetchPostList = (
  limit = 10,
  pageNo = 1,
  options = "?fields[0]=title&fields[1]=slug&fields[2]=createdAt&sort=createdAt:desc"
) =>
  fetchPageableData(
    POSTS +
      options +
      `&pagination[pageSize]=${limit}` +
      `&pagination[page]=${pageNo}`
  );

export const findOnePost = (slug) =>
  fetchData(`/posts?filters[slug][$eq]=${slug}`).then((data) => data[0]);
