
/** Initializes the login process by animating the logo. */
function loginInit() {
    animateLogo();
}

function animateLogo() {
    let matchMedia = window.matchMedia("(min-width: 900px)");
    if (matchMedia.matches) {
        let logo = document.getElementById('logo');
        logo.style.opacity = '1';
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
        }, 2000);
    } else {
        let backgroundColor = 'rgb(42,54,71)';
        let logoSmall = document.getElementById('logoSmall');
        let logoImg = logoSmall.querySelector('img');
        document.body.style.backgroundColor = backgroundColor;
        logoSmall.style.opacity = '1';
        setTimeout(() => {
            logoSmall.style.top = '10%';
            logoSmall.style.left = '20%';
            logoSmall.style.transform = 'translate(0, 0)';
            setTimeout(() => {
                logoImg.src = '../assets/svg/logo.svg';
            }, 375);
            setTimeout(() => {
                document.body.style.transition = "background-color 1s ease";
                document.body.style.backgroundColor = "transparent";
            }, 500);
        }, 2000);
        setTimeout(() => {
            logoSmall.style.opacity = '0';
        }, 3500);
        setTimeout(() => {
            toggleLoginPage();
        }, 4000);
    }
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
    usrValidation = Object.values(usersId || {}).some(userObj => userObj.email === email);
    if (usrValidation) {
        return true;
    } else {
        return false;
    }
}

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