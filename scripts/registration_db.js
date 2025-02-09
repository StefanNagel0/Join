/**URL of the Firebase Realtime Database.*/
const REGISTRATIONCOMPLETE_URL = "https://secret-27a6b-default-rtdb.europe-west1.firebasedatabase.app/";
const REGISTRATION_URL = "https://secret-27a6b-default-rtdb.europe-west1.firebasedatabase.app/registrations";
/**Saves the registration data to the database.*/
async function updateRegistration(path = "/registrations", data) {
    let response = await fetch(REGISTRATIONCOMPLETE_URL + path + ".json", {
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

/** Creates a registration object from a form.*/
function createRegistration(regiForm) {
    let data = {
        name: regiForm.querySelector('#name').value.trim(),
        email: regiForm.querySelector('#email').value.trim(),
        password: regiForm.querySelector('#password').value.trim(),
    };
    return data;
}

/** Saves the registration data to the database. */

async function saveRegistration() {
    let regiForm = document.querySelector('.loginForm');
    let data = createRegistration(regiForm);
    updateRegistration("/registrations", data).then(() => {
        userSuccessRegistration();
    }).catch((error) => {
        console.error("Fehler beim Speichern der Registrierung:", error);
    });
}

/** Loads the registration database from the API.*/
async function loadRegistration() {
    return fetch(REGISTRATION_URL + ".json").then((userId) => userId.json());
}

/** Checks if a username is already taken.*/
async function isNameTaken(name){
    let usersId = loadRegistration();
    if (usersId === name) {
        return true;
    } else {
        return false;
    }
}

/** Checks if an email is already taken.*/
async function isEmailTaken(email) {
    let usersId = loadRegistration();
    if (usersId === email) {
        return true;
    } else {
        return false;
    }
}

/** Checks if the username or email is already taken and saves the registration if available.*/
async function mainCheckTaken() {
    let regiForm = document.querySelector('.loginForm');
    let data = createRegistration(regiForm);
    let nameIsTaken = await isNameTaken(data.name);
    let emailIsTaken = await isEmailTaken(data.email);
    if (nameIsTaken) {
        showError('Diese Benutzername ist bereits vergeben.');
        return;
    }
    if (emailIsTaken) {
        showError('Diese E-Mail ist bereits vergeben.');
        return;
    }
    saveRegistration();
}