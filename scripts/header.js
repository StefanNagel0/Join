function initBoard() {
    toggleBoardPage();
    initializeUserButton();
}

function toggleBoardPage() {
    let boardPage = document.getElementById('content');
    boardPage.innerHTML = boardTemplate();
    boardPage.style.display = 'block';
}

function initializeUserButton() {
    const userInitialsButton = document.getElementById('user-initials-button');
    const userPopup = document.getElementById('user-popup');

    setUserInitials(userInitialsButton);
}

function setUserInitials(button) {
    const userName = getCurrentUserName();
    button.textContent = userName.toLowerCase() === "guest" 
        ? "G" 
        : getInitials(userName);
}

function getCurrentUserName() {
    return "Guest";
}

function getInitials(name) {
    const [firstName, lastName] = name.split(" ");
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
}

function toggleUserPopup(event) {
    const userPopup = document.getElementById('user-popup');
    event.stopPropagation(); // Verhindert das Auslösen von Klicks außerhalb des Pop-ups
    userPopup.classList.toggle('d-none');
}

function closePopup(event) {
    const userPopup = document.getElementById('user-popup');
    const userInitialsButton = document.getElementById('user-initials-button');
    const target = event.target;

    // Wenn der Klick nicht auf das Popup oder den Button erfolgt, schließe das Popup
    if (!userPopup.contains(target) && !userInitialsButton.contains(target)) {
        userPopup.classList.add('d-none');
    }
}
document.onload = initBoard;