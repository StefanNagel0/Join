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