function loginInit() {
    animateLogo();
}

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

window.onload = animateLogo;

function toggleLoginPage() {
    let OverlayloginPage = document.getElementById('loginPage');
    let OverlayLogo = document.getElementById('logo');
    OverlayloginPage.innerHTML = loginTemplate();
    OverlayLogo.style.display = 'none';
    OverlayloginPage.style.display = 'block';
}

function login() {
    const { email, password } = valueInput();
    if (!inputValidation(email, password)) {
        return;
    }
    if (isValidUser(email, password)) {
        window.location.href = 'summary.html';
    } else {
        showError('E-Mail oder Passwort falsch.');
    }
}

function showError(message) {
    const errorMessage = document.getElementById('loginError');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 2000);
}


function guestLogin() {
    window.location.href = 'summary.html';
}

function valueInput() {
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();
    return { email, password };
}

function inputValidation(email, password) {
    if (!email || !password) {
        showError('Bitte geben Sie Ihre E-Mail und Ihr Passwort ein.');
        return false;
    }
    return true;
}

function isValidUser(email, password) {
    return users.some(user => user.email === email && user.password === password);
}