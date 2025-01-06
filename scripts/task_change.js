function onload() {
    loadTask("/tasks");
}

const BASE_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/";

<<<<<<< HEAD
async function loadTask(path = "/tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
    postTask();
    
}
=======
// async function loadTask(path = "/tasks") {
//     let response = await fetch(BASE_URL + path + ".json");
//     let responseToJson = await response.json();
//     console.log(responseToJson);
// }
>>>>>>> 35266db71deba4e8a692fdcb91fec033de96ffe9

async function postTask(path = "/tasks", data = {}) {
    let url = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
<<<<<<< HEAD
    console.log(url);
    getTasks(url);
    
}

async function getTasks() {
    // let response = await fetch(BASE_URL + "/tasks.json");
    let responseToJson = await response.json();
    let newTasks = [];
    for (let i = 0; i < responseToJson.results.length; i++) {
        let taskResponse = await fetch(responseToJson.results[i].url);
        let taskToJson = await taskResponse.json();
        newTasks.push(taskToJson);
    }
    tasks = tasks.concat(newTasks);
    console.log(tasks);
    document.getElementById("tasksToDo").innerHTML += getTaskTemplate2(newTasks);
}


// async function getPokemons() {
//     let response = await fetch(BASE_URL);
//     let responseToJson = await response.json();
//     let newPokemons = [];
//     for (let i = 0; i < responseToJson.results.length; i++) {
//         let pokemonResponse = await fetch(responseToJson.results[i].url);
//         let pokemonToJson = await pokemonResponse.json();
//         newPokemons.push(pokemonToJson);
//     }
//     pokemons = pokemons.concat(newPokemons);
//     console.log(pokemons);
//     document.getElementById("content").innerHTML += getPokemonsTemplate(newPokemons);
// }
=======
    return responseToJson = await response.json();
}


async function loadTask(path = "/tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    let tasks = await response.json();
    displayTasks(tasks);
}

function displayTasks(tasks) {
    const tasksContainer = document.getElementById("tasksContainer");

    // Vorherige Inhalte entfernen (optional)
    tasksContainer.innerHTML = "";

    // Über die Tasks iterieren
    for (const taskId in tasks) {
        const task = tasks[taskId];

        // HTML-Elemente erstellen
        const taskElement = document.createElement("div");
        taskElement.className = "task";
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Category:</strong> ${task.category || "None"}</p>
            <p><strong>Assigned To:</strong> ${task.assignedTo || "Not Assigned"}</p>
            <p><strong>Due Date:</strong> ${task.dueDate || "No Date"}</p>
            <p><strong>Priority:</strong> ${task.priority || "Normal"}</p>
            <p><strong>Status:</strong> ${task.status}</p>
        `;
        // Task-Elemente zum Container hinzufügen
        tasksContainer.appendChild(taskElement);
    }
}
>>>>>>> 35266db71deba4e8a692fdcb91fec033de96ffe9
