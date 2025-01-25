/** Initializes the login process by animating the logo. */
function loginInit() {
    animateLogo();
}

/**Animates the logo by fading it in, moving it, and then fading it out before toggling the login page.*/
function animateLogo() {
    const logo = document.getElementById('logo');
    
    setTimeout(() => {
        logo.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        logo.style.top = '10%';
        logo.style.left = '20%';
        logo.style.transform = 'translate(0, 0)';
    }, 1000);
    setTimeout(() => {
        logo.style.opacity = '0';
    }, 2000);
    setTimeout(() => {
        toggleLoginPage();
    }, 3500);
}

/**Toggles the login page by hiding the logo and displaying the login template.*/
function toggleLoginPage() {
    let OverlayloginPage = document.getElementById('loginPage');
    let OverlayLogo = document.getElementById('logo');
    OverlayloginPage.innerHTML = loginTemplate();
    OverlayLogo.style.display = 'none';
    OverlayloginPage.style.display = 'block';
}

/**Handles the login process, validates the inputs, checks user credentials, and redirects upon success.*/
function login() {
    const { email, password } = valueInput();
    if (!inputValidation(email, password)) {
        return;
    }
    if (isValidUser(email, password)) {
        localStorage.setItem('loggedInEmail', email);
        window.location.href = 'summary.html?showGreeting=true';
    } else {
        showError('E-Mail oder Passwort falsch.');
    }
}

/**Logs out the current user by removing stored data from localStorage and redirecting to the login page.*/
function logout(event) {
    event.preventDefault();
    localStorage.removeItem('loggedInEmail');
    localStorage.removeItem('greetingShown');
    window.location.href = 'login.html';
}

/** Displays an error message for the login process. */
function showError(message) {
    const errorMessage = document.getElementById('loginError');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 2000);
}

/**Allows a guest to log in by setting a placeholder email and redirecting to the summary page.*/
function guestLogin() {
    localStorage.setItem('loggedInEmail', 'guest@example.com');
    window.location.href = 'summary.html?showGreeting=true';
}

/**Retrieves and trims the values from the email and password input fields.*/
function valueInput() {
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();
    return { email, password };
}

/**Validates the email and password inputs, ensuring they are not empty.*/
function inputValidation(email, password) {
    if (!email || !password) {
        showError('Bitte geben Sie Ihre E-Mail und Ihr Passwort ein.');
        return false;
    }
    return true;
}

/**Checks if the provided email and password match a valid user in the system.*/
function isValidUser(email, password) {
    return users.some(user => user.email === email && user.password === password);
}