document.addEventListener('DOMContentLoaded', toggleSignUpButton);

function toggleSignUpButton() {
    const checkbox = document.getElementById('checkbox');
    const signUpButton = document.querySelector('.signUpButton');
    if (checkbox && signUpButton) {
        signUpButton.disabled = !checkbox.checked;
    }
}

function signUp(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const checkbox = document.getElementById("checkbox");

    if (!name || !email || !password || !confirmPassword) {
        showError('Bitte alle Felder ausfüllen.');
        return;
    }
    if (password !== confirmPassword) {
        showError('Passwörter stimmen nicht überein.');
        return;
    }
    if (users.some(user => user.email === email)) {
        showError('Diese E-Mail ist bereits vergeben.');
        return;
    }
    if (users.some(user => user.name === name)) {
        showError('Dieser Benutzername ist bereits vergeben.');
        return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        showError('Das Passwort muss mindestens 8 Zeichen lang sein, einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten.');
        return;
    }
    if (!checkbox.checked) {
        showError('Bitte akzeptieren Sie die Datenschutzerklärung.');
        return;
    }
    users.push({ name, email, password });
    console.log("Benutzer erfolgreich hinzugefügt:", users);
    window.location.href = "login.html";
}

function showError(message) {
    const errorMessage = document.getElementById('signUpError');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 2000);
    }
}