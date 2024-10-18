console.log("Hello from main.js");

import { runAboutMeWidget } from "./aboutMe.js";
import { loadProjectLinks } from "./projectLinks.js";
import { loadGalleryThenRunScroller } from "./homeGallery.js";

const main = () => {
  runAboutMeWidget();
  loadProjectLinks();
  loadGalleryThenRunScroller();
};

main();
