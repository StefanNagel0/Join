function onload() {
    loadTask("/tasks");
}

const BASE_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadTask(path = "/tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    let tasks = await response.json();
    displayTasks(tasks);
}

function displayTasks(tasks) {
    const tasksContainer = document.getElementById("tasksContainer");
    tasksContainer.innerHTML = "";
    for (const taskId in tasks) {
        const task = tasks[taskId];
        const taskElement = document.createElement("div");
        taskElement.className = "task";
        taskElement.innerHTML = `
        <div class="taskContainer">
            <div class="taskChildContainer">
                ${taskCategoryTemplate(task)}
                <div class="taskTitleContainer">
                    ${taskTitleTemplate(task)}
                    ${taskDescriptionTemplate(task)}
                </div>
                <div class="taskAssignedMain">
                    ${taskAssignedTemplate(task)}
                    ${taskPriorityTemplate(task)}
                </div>
                <!-- ${taskStatusTemplate(task)} -->
                <!-- ${taskDateTemplate(task)} -->
            </div>
        </div>
        `;
        tasksContainer.appendChild(taskElement);
    }
}

// async function postTask(path = "/tasks", data = {}) {
//         let url = await fetch(BASE_URL + path + ".json", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(data)
//         });
//         return responseToJson = await response.json();
//     }