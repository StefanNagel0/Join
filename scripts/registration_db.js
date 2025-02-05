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

async function saveRegistration(data) {
    let registrationFromDb = await loadRegistration(data);
    data.name = document.getElementById("name")?.value || data.name;
    data.email = document.getElementById("email")?.value || data.email;
    console.log(data);
    console.log(data.name);
    console.log(data.email);
    
    
    await updateRegistration("/registrations", data);
}

async function loadRegistration(data) {
    return fetch(`${SINGUP_URL}registrations/${data}.json`).then((response) => response.json());
}