/**Highlights the keywords in the text by wrapping them in a `<span>` element
 */
function highlightKeywords() {
    let text = textElement.innerHTML;

    keywords.forEach(keyword => {
        const regex = new RegExp(`(${keyword})`, 'gi');
        text = text.replace(regex, `<span style="color: blue;">$1</span>`);
    });

    textElement.innerHTML = text;
}

highlightKeywords();