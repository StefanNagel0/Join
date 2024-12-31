let = users = [
    { 'email': 'test@test.de', 'password': 'test' }
];

function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let errorMessage = document.getElementById('loginError');
    errorMessage.style.display = 'none';
    if (!email || !password) {
        showError('Bitte geben Sie Ihre E-Mail und Ihr Passwort ein.');
        return;
    }
    let isValidUser = false;
    for (let i = 0; i < users.length; i++) {
        if (email === users[i].email && password === users[i].password) {
            isValidUser = true;
            break;
        }
    }
    if (isValidUser) {
        window.location.href = 'summary.html';
    } else {
        errorMessage.textContent = 'E-Mail oder Passwort ist falsch.';
        errorMessage.style.display = 'block';
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