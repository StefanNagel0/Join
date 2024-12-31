document.getElementById('checkbox').addEventListener('change', toggleSignUpButton);

function toggleSignUpButton() {
    const checkbox = document.getElementById('checkbox');
    const signUpButton = document.querySelector('.signUpButton');
    signUpButton.disabled = !checkbox.checked;
}

function signUp(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let checkbox = document.getElementById("checkbox");

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
    users.push({ name, email, password });
    console.log("Benutzer erfolgreich hinzugefügt:", users);
    window.location.href = "login.html";
}

function showError(message) {
    const errorMessage = document.getElementById('signUpError');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 2000);
}
