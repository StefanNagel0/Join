function initHeader() {
    initializeUserButton();
}

function initializeUserButton() {
    const userInitialsButton = document.getElementById('user-initials-button');
    setUserInitials(userInitialsButton);
}

function setUserInitials(button) {
    const userName = getCurrentUserName();
    const initials = userName.toLowerCase() === "guest" 
        ? "G" 
        : getInitials(userName);
    button.textContent = initials;
}

function getCurrentUserName() {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (!loggedInEmail || loggedInEmail === 'guest@example.com') {
        return "Guest";
    }
    const user = users.find(user => user.email === loggedInEmail);
    return user ? user.name : "Guest";
}

function getInitials(name) {
    if (!name) return '';
    const [firstName, lastName] = name.split(" ");
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
}

function toggleUserPopup(event) {
    const userPopup = document.getElementById('user-popup');
    event.stopPropagation();
    userPopup.classList.toggle('d-none');
}

function closePopup(event) {
    const userPopup = document.getElementById('user-popup');
    const userInitialsButton = document.getElementById('user-initials-button');
    const target = event.target;
    if (!userPopup.contains(target) && !userInitialsButton.contains(target)) {
        userPopup.classList.add('d-none');
    }
}
document.onload = initHeader;