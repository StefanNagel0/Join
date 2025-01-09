function reginit() {
    // document.addEventListener('DOMContentLoaded', toggleSignUpButton);
    toggleSignUpPage();
    toggleSignUpButton();
}

function toggleSignUpPage() {
    let overlayRef = document.getElementById("registrationPage");
    overlayRef.innerHTML = registrationTemplate();
    overlayRef.style.display = "block";
}

function toggleSignUpButton() {
    const checkbox = document.getElementById('checkbox');
    const signUpButton = document.querySelector('.signUpButton');
    if (checkbox.checked) {
        signUpButton.disabled = false;
        signUpButton.style.cursor = 'pointer';
        signUpButton.style.background = '#2A3647';
        signUpButton.style.color = 'white';
    } else {
        signUpButton.disabled = true;
        signUpButton.style.cursor = 'not-allowed';
        signUpButton.style.background = '#808080';
    }
    return;
}

function signUp(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const checkbox = document.getElementById("checkbox");

    if (!FieldsFilled(name, email, password, confirmPassword)) return;
    if (!PasswordsMatching(password, confirmPassword)) return;
    if (EmailTaken(email)) return;
    if (UsernameTaken(name)) return;
    if (!PasswordValid(password)) return;
    users.push({ name, email, password });
    userSuccessRegistration();
}

function FieldsFilled(name, email, password, confirmPassword) {
    if (!name || !email || !password || !confirmPassword) {
        showError('Bitte alle Felder ausfüllen.');
        return false;
    }
    return true;
}

function PasswordsMatching(password, confirmPassword) {
    if (password !== confirmPassword) {
        showError('Passwörter stimmen nicht überein.');
        return false;
    }
    return true;
}

function EmailTaken(email) {
    if (users.some(user => user.email === email)) {
        showError('Diese E-Mail ist bereits vergeben.');
        return true;
    }
    return false;
}

function UsernameTaken(name) {
    if (users.some(user => user.name === name)) {
        showError('Dieser Benutzername ist bereits vergeben.');
        return true;
    }
    return false;
}

function PasswordValid(password) {
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        showError('Das Passwort muss mindestens 8 Zeichen lang sein, einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten.');
        return false;
    }
    return true;
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

function userSuccessRegistration() {
    let overlayRef = document.getElementById("signUpSuccess");
    overlayRef.innerHTML = signUpSuccess();
    overlayRef.style.display = "block";
    let overlayRefSignUp = document.getElementById("registrationPage");
    overlayRefSignUp.style.display = "none";
    setTimeout(() => {
        // window.location.href = "login.html";
        overlayRef.style.display = "none";
    }, 20000);
}