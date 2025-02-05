/**Initializes the registration page and button state.*/
function reginit() {
    toggleSignUpPage();
    toggleSignUpButton();
}

/**Displays the registration page and injects the registration template.*/
function toggleSignUpPage() {
    let overlayRef = document.getElementById("registrationPage");
    overlayRef.innerHTML = registrationTemplate();
    overlayRef.style.display = "block";
}

/**Enables or disables the "Sign up" button based on the checkbox state.*/
function toggleSignUpButton() {
    let checkbox = document.getElementById('checkbox');
    let signUpButton = document.querySelector('.signUpButton');
    if (checkbox.checked) {
        signUpButton.disabled = false;
        signUpButton.style.cursor = 'pointer';
        signUpButton.style.background = '#2A3647';
        signUpButton.style.color = 'white';
    } else {
        signUpButton.disabled = true;
        signUpButton.style.cursor = 'not-allowed';
        signUpButton.style.background = '#808080';
        signUpButton.classList.add('signUpButton');
    }
    return;
}

/**Handles the registration process by validating the input fields and submitting the form.*/
function signUp(event) {
    event.preventDefault();
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();
    let checkbox = document.getElementById("checkbox");
    if (!FieldsFilled(name, email, password, confirmPassword)) return;
    if (!PasswordsMatching(password, confirmPassword)) return;
    // if (EmailTaken(email)) return;
    // if (UsernameTaken(name)) return;
    if (!PasswordValid(password)) return;
    mainCheckTaken();
    // saveRegistration(name, email, password);
    // userSuccessRegistration();
}

/**Checks if all the required fields are filled.*/
function FieldsFilled(name, email, password, confirmPassword) {
    if (!name || !email || !password || !confirmPassword) {
        showError('Bitte alle Felder ausfüllen.');
        return false;
    }
    return true;
}

/**Checks if the password and confirmation password match.*/
function PasswordsMatching(password, confirmPassword) {
    if (password !== confirmPassword) {
        document.getElementById("password").style.borderColor = "red";
        document.getElementById("confirmPassword").style.borderColor = "red";
        setTimeout(function () {
            document.getElementById("password").style.borderColor = "rgba(204, 204, 204, 1)";
            document.getElementById("confirmPassword").style.borderColor = "rgba(204, 204, 204, 1)";
        }, 2000);
        showError('Passwörter stimmen nicht überein.');
        return false;
    }
    return true;
}

/**Checks if the provided email is already taken.*/
// function EmailTaken(email) {
//     if (users.some(user => user.email === email)) {
//         showError('Diese E-Mail ist bereits vergeben.');
//         document.getElementById("email").style.borderColor = "red";
//         setTimeout(function () {
//             document.getElementById("email").style.borderColor = "rgba(204, 204, 204, 1)";
//         }, 2000);
//         return true;
//     }
//     return false;
// }

/**Checks if the provided username is already taken.*/
// function UsernameTaken(name) {
//     if (users.some(user => user.name === name)) {
//         showError('Dieser Benutzername ist bereits vergeben.');
//         document.getElementById("name").style.borderColor = "red";
//         setTimeout(function () {
//             document.getElementById("name").style.borderColor = "rgba(204, 204, 204, 1)";
//         }, 2000);
//         return true;
//     }
//     return false;
// }

/**Validates if the password meets the required complexity.*/
function PasswordValid(password) {
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        document.getElementById("password").style.borderColor = "red";
        document.getElementById("confirmPassword").style.borderColor = "red";
        setTimeout(function () {
            document.getElementById("password").style.borderColor = "rgba(204, 204, 204, 1)";
            document.getElementById("confirmPassword").style.borderColor = "rgba(204, 204, 204, 1)";
        }, 2000);
        showError('Passwort: mind. 8 Zeichen, Groß-/Kleinbuchstabe, Zahl.');
        return false;
    }
    return true;
}

function togglePasswordVisibility(inputId, eyeIcon) {
    let passwordField = document.getElementById(inputId);
    let isPasswordHidden = passwordField.type === 'password';
    passwordField.type = isPasswordHidden ? 'text' : 'password';
    let newEyeSrc = isPasswordHidden ? '../assets/svg/regi_eye_open.svg' : '../assets/svg/regi_eye_closed.svg';
    eyeIcon.src = newEyeSrc;
    if (isPasswordHidden) {
        eyeIcon.style.height = '13px';
    } else {
        eyeIcon.style.height = '';
    }
}

/**Displays an error message.*/
function showError(message) {
    let errorMessage = document.getElementById('signUpError');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
}

/**Displays a success message upon successful registration and hides the registration page.*/
function userSuccessRegistration() {
    let overlayRef = document.getElementById("signUpSuccess");
    overlayRef.innerHTML = signUpSuccess();
    overlayRef.style.display = "block";
    let overlayRefSignUp = document.getElementById("registrationPage");
    overlayRefSignUp.style.display = "none";
    setTimeout(() => {
        window.location.href = "login.html";
        overlayRef.style.display = "none";
    }, 4000);
}