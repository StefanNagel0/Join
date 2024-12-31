let = users = [
    { 'email': 'test@test.de', 'password': 'test' }
];

function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    for (let i = 0; i < users.length; i++) {
        if (email == users[i].email && password == users[i].password) {
            window.location.href = "summary.html";
        }
    }
}