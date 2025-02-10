
/** Initializes the login process by animating the logo. */
function loginInit() {
    animateLogo();
}

/** Animates the logo based on screen width */
function animateLogo() {
    let isLargeScreen = window.matchMedia("(min-width: 900px)").matches;
    isLargeScreen ? animateLargeLogo() : animateSmallLogo();
}

/** Animation for large screens */
function animateLargeLogo() {
    let logo = document.getElementById('logo');
    logo.style.opacity = '1';
    setTimeout(() => moveLogo(logo, '10%', '25%'), 150);
    setTimeout(() => logo.style.opacity = '0', 1400);
    setTimeout(toggleLoginPage, 1800);
}

/** Animation for small screens */
function animateSmallLogo() {
    let logoSmall = document.getElementById('logoSmall');
    let logoImg = logoSmall.querySelector('img');
    document.body.style.backgroundColor = 'rgb(42,54,71)';
    logoSmall.style.opacity = '1';
    setTimeout(() => moveLogo(logoSmall, '0%', '10%', 0.5), 2000);
    setTimeout(() => logoImg.src = '../assets/svg/logo.svg', 2150);
    setTimeout(() => document.body.style.backgroundColor = "transparent", 2200);
    setTimeout(() => logoSmall.style.opacity = '0', 3000);
    setTimeout(toggleLoginPage, 3200);
}

/** Moves the logo to a new position */
function moveLogo(logo, top, left, scale = 1) {
    logo.style.top = top;
    logo.style.left = left;
    logo.style.transform = `translate(0, 0) scale(${scale})`;
}

/**Toggles the login page by hiding the logo and displaying the login template.*/
function toggleLoginPage() {
    let OverlayloginPage = document.getElementById('loginPage');
    let OverlayLogo = document.getElementById('logo');
    OverlayloginPage.innerHTML = loginTemplate();
    OverlayLogo.style.display = 'none';
    OverlayloginPage.style.display = 'block';
}

const LOGIN_URL = 'https://secret-27a6b-default-rtdb.europe-west1.firebasedatabase.app/registrations';

/** Handles user login */
async function login() {
    let { email, password } = loginForm();
    if (!loginFormValidation(email, password)) return;
    if (!(await validateCredentials(email, password))) {
        return showError("Passwort oder Email falsch!");
    }
    localStorage.setItem('loggedInEmail', email);
    window.location.href = 'summary.html?showGreeting=true';
}

/** Validates email and password in the database */
async function validateCredentials(email, password) {
    let emailIsValid = await emailValid(email);
    let passwordIsValid = await passwordValid(password, email);
    return emailIsValid && passwordIsValid;
}

/**Retrieves and trims the values from the email and password input fields.*/
function loginForm() {
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();
    return { email, password };
}

/**Allows a guest to log in by setting a placeholder email and redirecting to the summary page.*/
function guestLogin() {
    localStorage.setItem('loggedInEmail', 'guest@example.com');
    window.location.href = 'summary.html?showGreeting=true';
}

/** Prüft, ob eine E-Mail in der Datenbank existiert. */
async function emailValid(email) {
    let usersId = await loadLoginDb();
    usrValidation = Object.values(usersId || {}).some(userObj => userObj.email === email);
    if (usrValidation) {
        return true;
    } else {
        return false;
    }
}

/** Prüft, ob das Passwort mit einer E-Mail übereinstimmt. */
async function passwordValid(password, email) {
    let usersId = await loadLoginDb();
    for (let userId in usersId) {
        let user = usersId[userId];
        if (user.password === password) {
            return true;
        }
    }
    return false;
}

/** Lädt die Login-Datenbank aus der API. */
async function loadLoginDb() {
    return fetch(LOGIN_URL + ".json").then((userId) => userId.json());
}

/**Validates the email and password inputs, ensuring they are not empty.*/
function loginFormValidation(email, password) {
    if (!email || !password) {
        showError('Bitte geben Sie Ihre E-Mail und Ihr Passwort ein.');
        document.getElementById("email").style.borderColor = "red";
        document.getElementById("password").style.borderColor = "red";
        setTimeout(function () {
            document.getElementById("email").style.borderColor = "rgba(204, 204, 204, 1)";
            document.getElementById("password").style.borderColor = "rgba(204, 204, 204, 1)";
        }, 2000);
        return false;
    }
    return true;
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
    let errorMessage = document.getElementById('loginError');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 2000);
}