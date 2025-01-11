function initBoard() {
    toggleBoardPage()
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

    // Popup öffnen/schließen
    userInitialsButton.onclick = function (e) {
        togglePopup(e, userPopup);
    };

    // Schließen des Popups bei Klick außerhalb
    document.onclick = function (e) {
        closePopup(e, userPopup, userInitialsButton);
    };
}

// Setzt die Initialen des aktuellen Benutzers
function setUserInitials(button) {
    const userName = getCurrentUserName();
    button.textContent = userName.toLowerCase() === "guest" 
        ? "G" 
        : getInitials(userName);
}

// Holt den aktuellen Benutzernamen (Mock-Funktion)
function getCurrentUserName() {
    return "Guest";
}

// Generiert die Initialen eines Benutzernamens
function getInitials(name) {
    const [firstName, lastName] = name.split(" ");
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
}

// Schaltet das Popup um
function toggleUserPopup(event) {
    const userPopup = document.getElementById('user-popup');
    event.stopPropagation();
    userPopup.classList.toggle('d-none');
}

// Schließt das Popup, wenn außerhalb geklickt wird
function closePopup(event, userPopup, userInitialsButton) {
    const target = event.target;
    
    // Wenn der Klick nicht auf das Popup oder den Button erfolgt, schließe das Popup
    if (!userPopup.contains(target) && !userInitialsButton.contains(target)) {
        userPopup.classList.add('d-none');
    }
}
document.onload = initBoard;