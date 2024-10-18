import { fetchProjectLinks } from "./api.js";

const newProjectLink = (title, description, url) => {
  const listItem = document.createElement("li");
  listItem.innerHTML = `
            <span class='flex-row flex-start flex-wrap'>
              <a href="${url}">${title}</a>&nbsp;
              <p>${description}</p>
            </span>
          `;
  return listItem;
};

export const loadProjectLinks = () => {
  fetchProjectLinks().then((data) => {
    const projectLinks = document.getElementById("project-links");
    data
      .map((d) => d.attributes)
      .forEach(({ title, description, url }) => {
        projectLinks.appendChild(newProjectLink(title, description, url));
      });
  });
};
