
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
    }, 150);
    setTimeout(() => {
        logo.style.opacity = '0';
    }, 1500);
    setTimeout(() => {
        toggleLoginPage();
    }, 2500);
}

/**Toggles the login page by hiding the logo and displaying the login template.*/
function toggleLoginPage() {
    let OverlayloginPage = document.getElementById('loginPage');
    let OverlayLogo = document.getElementById('logo');
    OverlayloginPage.innerHTML = loginTemplate();
    OverlayLogo.style.display = 'none';
    OverlayloginPage.style.display = 'block';
}

const LOGIN_URL = 'https://join-408-default-rtdb.europe-west1.firebasedatabase.app/registrations';

/**Handles the login process, validates the inputs, checks user credentials, and redirects upon success.*/
async function login() {
    let { email, password } = loginForm();
    if (!loginFormValidation(email, password)) {
        return;
    } else {
        let emailIsInDb = await emailValid(email);
        let passwordIsInDb = await passwordValid(password, email);
        if (emailIsInDb) {
        } else {
            showError("Passwort oder Email falsch!");
        }
        if (passwordIsInDb) {
        } else {
            showError("Passwort oder Email falsch!");
        }
        if (emailIsInDb && passwordIsInDb) {
            localStorage.setItem('loggedInEmail', email);
            window.location.href = 'summary.html?showGreeting=true';
        } else {
            showError('Die eingegebenen Daten sind nicht korrekt.');
        }
    }
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

async function emailValid(email) {
    let usersId = await loadLoginDb();
    console.log(usersId);
    console.log(email);
    usrValidation = Object.values(usersId || {}).some(userObj => userObj.email === email);
    if (usrValidation) {
        return true;
    } else {
        return false;
    }
}

async function passwordValid(password, email) {
    let usersId = await loadLoginDb();  
    console.log(usersId);
    console.log(password);
    console.log(email);
    for (let userId in usersId) {
        let user = usersId[userId];
        if (user.password === password) {
            return true;
        }
    }
    return false;
}

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
    const errorMessage = document.getElementById('loginError');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 2000);
}