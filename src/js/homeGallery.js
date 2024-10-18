import { fetchHomeGalleryImages } from "./api.js";

fetchHomeGalleryImages().then(console.log);

const createHomeImageEl = (url, name) => {
  const img = document.createElement("img");
  img.src = url;
  img.alt = name;
  img.className = "home-image";
  img.onclick = () => {
    window.open(url, "_blank");
  };
  img.style.cursor = "pointer";
  return img;
};

const runAutoScroller = (galleryEl) => {
  let direction = 1;

  setInterval(() => {
    galleryEl.scrollLeft += 1 * direction;

    if (galleryEl.scrollLeft >= galleryEl.scrollWidth - galleryEl.clientWidth) {
      direction = -1;
    } else if (galleryEl.scrollLeft <= 0) {
      direction = 1;
    }
  }, 100);
};

const loadHomeGallery = (galleryEl, { then }) => {
  fetchHomeGalleryImages().then((imageData) => {
    imageData.sort(() => 0.5 - Math.random());

    imageData.forEach(({ url, name }) => {
      const img = createHomeImageEl(url, name);
      galleryEl.appendChild(img);
    });

    then(galleryEl);
  });
};

export const loadGalleryThenRunScroller = () => {
  const galleryEl = document.getElementById("image-gallery");

  loadHomeGallery(galleryEl, { then: runAutoScroller });
};
