function onload() {
    loadTask("/tasks");
}

const BASE_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadTask(path = "/tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
}


async function postTask(path = "/tasks", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}