let users = [
    { 'email': 'test@test.de', 'password': 'test' }
];

function addUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    users.push({ 'email': email, 'password': password });
    window.location.href = "login.html";
}