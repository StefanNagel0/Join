function signUp() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let checkbox = document.getElementById("checkbox");
    if (!name || !email || !password || !confirmPassword || !checkbox.checked) {
        showError('Bitte alle Felder ausfüllen.');
        return;
    }
    if (password !== confirmPassword) {
        showError('Passwörter stimmen nicht überein.');
        return;
    }
    if (checkbox.checked === false) {
        showError('Bitte akzeptieren Sie unsere Datenschutzbestätigung.');
        return;
    }
    users.push({ 'name': name, 'email': email, 'password': password });
    window.location.href = 'login.html';
}

function showError(message) {
    const errorMessage = document.getElementById('signUpError');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 2000);
}