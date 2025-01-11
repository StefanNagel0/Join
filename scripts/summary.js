// Funktion, um die Begrüßung basierend auf der Uhrzeit zu setzen
function setGreetingMessage() {
    const greetingMessageDiv = document.getElementById('greeting-message');
    const userNameGreetingDiv = document.getElementById('user-name-greeting');
    // Aktuelle Uhrzeit abrufen
    const currentHour = new Date().getHours();
    // Begrüßung basierend auf der Uhrzeit setzen
    let greeting = '';
    if (currentHour >= 5 && currentHour < 12) {
        greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = 'Good Afternoon';
    } else {
        greeting = 'Good Evening';
    }
    // Beispiel: Benutzername abrufen (kann z. B. aus einer Session oder einem Eingabeformular stammen)
    const userName = getUserName(); // Diese Funktion simuliert die Benutzerdaten
    // Überprüfen, ob der Benutzer "Guest" ist
    if (userName && userName.toLowerCase() !== 'guest') {
        // Benutzer ist kein Gast: Begrüßung mit Komma und Name anzeigen
        greetingMessageDiv.textContent = `${greeting},`;
        userNameGreetingDiv.textContent = `Welcome, ${userName}!`;
    } else {
        // Benutzer ist ein Gast: Nur Begrüßung ohne Komma
        greetingMessageDiv.textContent = greeting;
        userNameGreetingDiv.textContent = ''; // Leer lassen, wenn der Benutzer ein Gast ist
    }
}
// Funktion, um einen Benutzernamen zu simulieren (kann später ersetzt werden)
function getUserName() {
    // Hier kannst du den Benutzernamen dynamisch aus einer Quelle abrufen
    return 'Guest'; // Beispiel: "John Doe" oder "Guest"
}
// Begrüßungsnachricht anzeigen lassen, wenn die Seite geladen wird
document.addEventListener('DOMContentLoaded', setGreetingMessage);