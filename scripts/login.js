
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

const REGI_URL = 'https://join-408-default-rtdb.europe-west1.firebasedatabase.app/registrations';

/**Handles the login process, validates the inputs, checks user credentials, and redirects upon success.*/
function login() {
    let {email, password} = valueInput();
    if (!inputValidation(email, password)) {
        return;
    }
    if (validateFromDb(email, password)) {
        if (validateFromDb = true) {
            console.log("Login erfolgreich.");
            // window.location.href = 'summary.html?showGreeting=true';
        } else {
            console.log("Login fehlgeschlagen.");
        }
        // localStorage.setItem('loggedInEmail', email);
        // window.location.href = 'summary.html?showGreeting=true';
    }
}

/**Checks if the provided email and password match a valid user in the system.*/


async function validateFromDb() {
    try {
        let registrationData = await loadRegistration();
        console.log("Registrierungsdaten geladen:", registrationData);
        let email = document.getElementById('email').value.trim();
        let password = document.getElementById('password').value.trim();
        if (emailValid(email) && passwordValid(password)) {
            if (isValidUser(registrationData, email, password)) {
                return true;
            } else {
                showError('E-Mail oder Passwort falsch.');
                document.getElementById("email").style.borderColor="red";
                document.getElementById("password").style.borderColor="red";
                setTimeout(function() {
                    document.getElementById("email").style.borderColor="rgba(204, 204, 204, 1)";
                    document.getElementById("password").style.borderColor="rgba(204, 204, 204, 1)";
                }, 2000);
                return false;
            }
        }
    } catch (error) {
        console.error("Fehler beim Validieren des Users:", error);
    }
    return false;
}

async function loadRegistration() {
    return fetch(REGI_URL + ".json").then((response) => response.json());
}

async function emailValid(email) {
    return fetch(REGI_URL + ".json").then((response) => response.json()).then((registrations) => {
        return Object.values(registrations).some((registration) => registration.email === email);
    });
}

async function passwordValid(password) {
    return fetch(REGI_URL + ".json").then((response) => response.json()).then((registrations) => {
        return Object.values(registrations).some((registration) => registration.password === password);
    });
}

function isValidUser(registrationData, email, password) {
    if (!registrationData) return false;
    for (let key in registrationData) {
        let user = registrationData[key];
        if (user.email === email && user.password === password) {
            return true;
        }
    }
    return false;
}

// function isValidUser(email, password) {
//     return users.some(user => user.email === email && user.password === password);
// }

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
        document.getElementById("email").style.borderColor="red";
        document.getElementById("password").style.borderColor="red";
        setTimeout(function() {
            document.getElementById("email").style.borderColor="rgba(204, 204, 204, 1)";
            document.getElementById("password").style.borderColor="rgba(204, 204, 204, 1)";
        }, 2000);
        return false;
    }
    return true;
}