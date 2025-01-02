// Function to initialize the user button and popup
function initializeUserButton() {
    const userInitialsButton = document.getElementById('user-initials-button');
    const userPopup = document.getElementById('user-popup');

    // Example function to get the current user's name
    function getCurrentUserName() {
        // Replace this with actual logic to fetch the current user's name
        return "Guest"; // Example: "John Doe" or "Guest"
    }

    // Set the button text to the user's initials
    const userName = getCurrentUserName();
    if (userName.toLowerCase() === "guest") {
        userInitialsButton.textContent = "G";
    } else {
        const [firstName, lastName] = userName.split(" ");
        userInitialsButton.textContent =
            (firstName ? firstName[0] : "") + (lastName ? lastName[0] : "");
    }

    // Add event listener to toggle the popup
    userInitialsButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent closing the popup immediately
        userPopup.classList.toggle('d-none');
    });

    // Close popup when clicking outside
    document.addEventListener('click', (event) => {
        if (
            !userPopup.contains(event.target) &&
            !userInitialsButton.contains(event.target)
        ) {
            userPopup.classList.add('d-none');
        }
    });
}
document.addEventListener('DOMContentLoaded', initializeUserButton);