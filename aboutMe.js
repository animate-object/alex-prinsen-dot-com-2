const DESCRIPTORS = [
  "web guy",
  "outdoors enthusiast",
  "weight lifter",
  "friend of animals",
  "book reader",
  "coffee drinker",
  "colorado hiker",
  "minnesota born",
  "iowa raised",
  "midwest expat",
  "no coast elitist",
  "sports fan",
  "husband, son, brother",
  "retired amateur musician",
  "marathon finisher",
  "admirer of dogs",
  "scrabble champ",
];

const getRandomDescriptorIndex = (excluding) => {
  let randomIndex = Math.floor(Math.random() * DESCRIPTORS.length);
  while (excluding.includes(randomIndex)) {
    randomIndex = Math.floor(Math.random() * DESCRIPTORS.length);
  }
  return randomIndex;
};

const updateDescriptor = (idx, value) => {
  document.getElementById(`descriptor-${idx}`).innerText = value;
};

export const runAboutMeWidget = () => {
  setTimeout(() => {
    // set initial values
    let indices = [1, 2, 3].reduce((acc, _) => {
      const idx = getRandomDescriptorIndex(acc);
      return [...acc, idx];
    }, []);

    const initialDescriptors = indices.map((idx) => DESCRIPTORS[idx]);
    initialDescriptors.forEach((descriptor, idx) => {
      updateDescriptor(idx + 1, descriptor);
    });

    let descriptorIndices = [...indices];

    setInterval(() => {
      // every 2 seconds, update one of the descriptors
      // randomly select a descriptor to update, excluding descriptorIndices
      const itemToUpdateIndex = Math.ceil(Math.random() * 3);
      const newDescriptorIndex = getRandomDescriptorIndex(descriptorIndices);
      descriptorIndices[itemToUpdateIndex - 1] = newDescriptorIndex;
      updateDescriptor(itemToUpdateIndex, DESCRIPTORS[newDescriptorIndex]);
    }, 2000);
  }, 10);
};
