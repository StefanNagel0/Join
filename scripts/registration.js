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

/** Enables or disables the "Sign up" button based on the checkbox state. */
function toggleSignUpButton() {
    let signUpButton = document.querySelector('.signUpButton');
    let checkbox = document.getElementById('checkbox');
    let [name, email, password, confirmPassword] = ['name', 'email', 'password', 'confirmPassword'].map(id => document.getElementById(id).value);

    if (name && email && password && confirmPassword && checkbox.checked) {
        signUpButton.disabled = false;
        signUpButton.style.cssText = 'cursor: pointer; background: #2A3647; color: white;';
    } else {
        signUpButton.disabled = true;
        signUpButton.style.cssText = 'cursor: not-allowed; background: #808080;';
    }
}

/** Handles the registration process by validating the input fields and submitting the form. */
function signUp(event) {
    event.preventDefault();
    let [name, email, password, confirmPassword] = ['name', 'email', 'password', 'confirmPassword'].map(id => document.getElementById(id).value.trim());
    let checkbox = document.getElementById("checkbox");
    if (![nameValid(name), EmailValid(email), PasswordsMatching(password, confirmPassword), PasswordValid(password)].every(Boolean)) return;
    mainCheckTaken();
    userSuccessRegistration();
}

/** Validates if the provided name contains only alphabetic characters.*/
function nameValid(name) {
    if (!/^[a-zA-Z\s]+$/g.test(name)) {
        showError('Please enter a valid name.');
        return false;
    }
    return true;
}

/** Validates the format of an email address.*/
function EmailValid(email) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email)) {
        let emailInput = document.getElementById("email");
        if (emailInput) {
            emailInput.style.borderColor = "red";
            setTimeout(() => {
                emailInput.style.borderColor = "rgba(204, 204, 204, 1)";
            }, 2000);
        }
        showError('Bitte geben Sie eine gültige E-Mail ein.');
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

/**Validates if the password meets the required complexity.*/
function PasswordValid(password) {
    // (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password))
    if (password.length < 8) {
        document.getElementById("password").style.borderColor = "red";
        document.getElementById("confirmPassword").style.borderColor = "red";
        setTimeout(function () {
            document.getElementById("password").style.borderColor = "rgba(204, 204, 204, 1)";
            document.getElementById("confirmPassword").style.borderColor = "rgba(204, 204, 204, 1)";
        }, 2000);
        // showErrorPassword('Passwort: mind. 8 Zeichen, Groß-/Kleinbuchstabe, Zahl.');
        showErrorPassword('Passwort: mind. 8 Zeichen.');
        return false;
    }
    return true;
}

/** Toggles the visibility of the password input field and updates the eye icon.*/
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

/**Displays an error message.*/
function showErrorPassword(message) {
    let errorMessage = document.getElementById('passwordError');
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