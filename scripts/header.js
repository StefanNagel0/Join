/** Initializes the header by setting up the user button. */
function initHeader() {
    initializeUserButton();
}

/** Initializes the user button and sets the user initials. */
async function initializeUserButton() {
    const userInitialsButton = document.getElementById('user-initials-button');
    await setUserInitials(userInitialsButton);
}

/** Sets the user initials to the button text content. */
async function setUserInitials(button) {
    const userName = await getCurrentUserName();
    const initials = (typeof userName === 'string' && userName.toLowerCase() === "guest")
        ? "G"
        : getInitials(userName || "Guest");
    button.textContent = initials;
}

/** Retrieves the current user's name based on the logged-in email. */
async function getCurrentUserName() {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (!loggedInEmail || loggedInEmail === 'guest@example.com') {
        return "Guest";
    }
    try {
        const response = await fetch(`${BASE_URL}registrations.json`);
        if (!response.ok) throw new Error('Fehler beim Abrufen der Benutzerdaten');
        const users = await response.json();
        if (users) {
            const user = Object.values(users).find(user => user.email === loggedInEmail);
            return user ? user.name : "Guest";
        }
    } catch (error) { }
    return "Guest";
}

/** Generates initials from a name by taking the first letter of the first and last name. */
function getInitials(name) {
    if (!name || typeof name !== 'string') return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Toggles the visibility of the user popup. */
function toggleUserPopup(event) {
    const userPopup = document.getElementById('user-popup');
    event.stopPropagation();
    userPopup.classList.toggle('d-none');
}

/** Closes the user popup if the user clicks outside the popup or the user initials button. */
function closePopup(event) {
    const userPopup = document.getElementById('user-popup');
    const userInitialsButton = document.getElementById('user-initials-button');
    const target = event.target;
    if (!userPopup.contains(target) && !userInitialsButton.contains(target)) {
        userPopup.classList.add('d-none');
    }
}

/** Initializes the header by calling the `initHeader` function when the document is loaded. */
document.addEventListener('DOMContentLoaded', initHeader);