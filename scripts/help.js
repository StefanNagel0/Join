function goBack() {
    window.history.back();
  }

  function highlightJoinInParagraphs() {
    const paragraphs = document.querySelectorAll("p");
  
    paragraphs.forEach(paragraph => {
      if (paragraph.textContent.includes("Join")) {
        paragraph.innerHTML = paragraph.innerHTML.replace(
          /Join/g,
          '<span style="color: #29ABE2;">Join</span>'
        );
      }
    });
    paragraphs.forEach(paragraph => {
      if (paragraph.textContent.includes("Developer Akademie GmbH")) {
        paragraph.innerHTML = paragraph.innerHTML.replace(
          /Developer Akademie GmbH/g,
          '<span style="color: #29ABE2;">Developer Akademie GmbH</span>'
        );
      }
    });
  }
highlightJoinInParagraphs();