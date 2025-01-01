function Reginit() {
    document.addEventListener('DOMContentLoaded', toggleSignUpButton);
    toggleSignUpPage();
    toggleSignUpButton();
}

function toggleSignUpPage() {
    let overlayRef = document.getElementById("registrationPage");
    overlayRef.innerHTML = registration();
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
    userSuccessRegistration();
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
    setTimeout(() => {
        // window.location.href = "login.html";
        overlayRef.style.display = "none";
    }, 2000);
}

function signUpSuccess() {
    return `
    <div class="signUpSuccessClass" id="signUpSuccessID">
        <p class="signUpSuccessP">Du bist jetzt erfolgreich registriert.</p>
    </div>
    `
}