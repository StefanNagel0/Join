function onload() {
    loadTask("/tasks");
}

const BASE_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadTask(path = "/tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
    postTask();
    
}

async function postTask(path = "/tasks", data = {}) {
    let url = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
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