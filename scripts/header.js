/**Initializes the header by setting up the user button.*/
function initHeader() {
    initializeUserButton();
}

/**Initializes the user button and sets the user initials.*/
function initializeUserButton() {
    const userInitialsButton = document.getElementById('user-initials-button');
    setUserInitials(userInitialsButton);
}

/*** Sets the user initials to the button text content.*/
function setUserInitials(button) {
    const userName = getCurrentUserName();
    const initials = userName.toLowerCase() === "guest" 
        ? "G" 
        : getInitials(userName);
    button.textContent = initials;
}

/**Retrieves the current user's name based on the logged-in email.*/
function getCurrentUserName() {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (!loggedInEmail || loggedInEmail === 'guest@example.com') {
        return "Guest";
    }
    const user = users.find(user => user.email === loggedInEmail);
    return user ? user.name : "Guest";
}

/**Generates initials from a full name by taking the first letter of the first and last name.*/
function getInitials(name) {
    if (!name) return '';
    const [firstName, lastName] = name.split(" ");
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
}

/**Toggles the visibility of the user popup.*/
function toggleUserPopup(event) {
    const userPopup = document.getElementById('user-popup');
    event.stopPropagation();
    userPopup.classList.toggle('d-none');
}

/**Closes the user popup if the user clicks outside the popup or the user initials button.*/
function closePopup(event) {
    const userPopup = document.getElementById('user-popup');
    const userInitialsButton = document.getElementById('user-initials-button');
    const target = event.target;
    if (!userPopup.contains(target) && !userInitialsButton.contains(target)) {
        userPopup.classList.add('d-none');
    }
}

/**Initializes the header by calling the `initHeader` function when the document is loaded.*/
document.onload = initHeader;