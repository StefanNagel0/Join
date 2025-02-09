/**Navigates the user to the previous page in the browser history.*/
function goBack() {
  window.location.href = 'summary.html';
}

/** Highlights specified words in all paragraphs */
function highlightJoinInParagraphs() {
  document.querySelectorAll("p").forEach(paragraph => {
    highlightText(paragraph, "Join");
    highlightText(paragraph, "Developer Akademie GmbH");
  });
}

/** Replaces a word with a highlighted version */
function highlightText(element, word) {
  if (element.textContent.includes(word)) {
    const regex = new RegExp(word, "g");
    element.innerHTML = element.innerHTML.replace(regex, `<span style="color: #29ABE2;">${word}</span>`);
  }
}
highlightJoinInParagraphs();