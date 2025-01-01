function loginInit() {
    toggleLoginPage()
}

function toggleLoginPage() {
    let OverlayloginPage = document.getElementById('loginPage');
    OverlayloginPage.innerHTML = loginTemplate();
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