/**URL of the Firebase Realtime Database.*/
const SINGUP_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/";

/**Saves the registration data to the database.*/
async function updateRegistration(path = "/registrations", data) {
    let response = await fetch(SINGUP_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Fehler beim Speichern der Registrierung: ${response.statusText}`);
    }
}

function createRegistration(regiForm) {
    let data = {
        name: regiForm.querySelector('#name').value.trim(),
        email: regiForm.querySelector('#email').value.trim(),
        password: regiForm.querySelector('#password').value.trim(),
    };
    return data;
}

async function saveRegistration() {
    let regiForm = document.querySelector('.loginForm');
    let data = createRegistration(regiForm);
    updateRegistration("/registrations", data).then(() => {
        console.log(data);
        console.log("Registrierung erfolgreich gespeichert.");
        userSuccessRegistration();
    }).catch((error) => {
        console.error("Fehler beim Speichern der Registrierung:", error);
    });
}

async function loadRegistration(data) {
    console.log(data);
    return fetch(`${SINGUP_URL}registrations/${data}.json`).then((response) => response.json());
}

async function isUsernameTaken(username) {
    return fetch(SINGUP_URL + ".json").then((response) => response.json()).then((registrations) => {
        return Object.values(registrations).some((registration) => registration.name === username);
    });
}

async function isEmailTaken(email) {
    return fetch(SINGUP_URL + ".json").then((response) => response.json()).then((registrations) => {
        return Object.values(registrations).some((registration) => registration.email === email);
    });
}

function mainCheckTaken() {
    let regiForm = document.querySelector('.loginForm');
    let data = createRegistration(regiForm);
    console.log(data);
    if (isUsernameTaken(data.name)) {
        showError('Diese Benutzername ist bereits vergeben.');
        return;
    } else if (isEmailTaken(data.email)) {
        showError('Diese E-Mail ist bereits vergeben.');
        return;
    } else {
        saveRegistration();
    }
}