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
  }
highlightJoinInParagraphs();