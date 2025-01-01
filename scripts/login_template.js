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