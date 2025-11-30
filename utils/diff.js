// utils/diff.js

function normalizeText(text) {
  if (!text) return "";
  return text
    .replace(/[.,!?;(){}[\]"'<>:\/\\\-\n\r]/g, " ")  // remove punctuation
    .replace(/\s+/g, " ")                            // collapse spaces
    .trim()
    .toLowerCase();
}

function tokenize(text) {
  const normalized = normalizeText(text);
  return normalized.length === 0 ? [] : normalized.split(" ");
}

function countWords(arr) {
  const map = {};
  for (const word of arr) {
    map[word] = (map[word] || 0) + 1;
  }
  return map;
}

function diffTexts(oldText, newText) {
  const oldArr = tokenize(oldText);
  const newArr = tokenize(newText);

  const oldCounts = countWords(oldArr);
  const newCounts = countWords(newArr);

  let addedWords = [];
  let removedWords = [];
  let addedCounts = {};
  let removedCounts = {};

  const allWords = new Set([...Object.keys(oldCounts), ...Object.keys(newCounts)]);

  allWords.forEach(word => {
    const oldCount = oldCounts[word] || 0;
    const newCount = newCounts[word] || 0;

    if (newCount > oldCount) {
      addedWords.push(word);
      addedCounts[word] = newCount - oldCount;
    }

    if (oldCount > newCount) {
      removedWords.push(word);
      removedCounts[word] = oldCount - newCount;
    }
  });
  
  return {
    addedWords,
    removedWords,
    addedCounts,
    removedCounts,
    oldWordCount: oldArr.length,
    newWordCount: newArr.length
  };

}

module.exports = diffTexts;
