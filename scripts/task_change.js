function onload() {
    loadTask("/tasks");
}

let globalTasks = {};

const BASE_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadTask(path = "/tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    let tasks = await response.json();
    globalTasks = tasks;
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
        <div class="taskContainer" onclick="openTaskOverlay('${taskId}')">
            <div class="taskChildContainer">
                ${taskCategoryTemplate(task)}
                <div class="taskTitleContainer">
                    ${taskTitleTemplate(task)}
                    ${taskDescriptionTemplate(task)}
                </div>
                ${taskSubtasksTemplate(task)}
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

async function postTask() {
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-desc").value;
    const assignedTo = document.getElementById("task-assigned").value;
    const dueDate = document.getElementById("task-date").value;
    const priority = document.getElementById("task-priority-hidden").value;
    const category = document.getElementById("task-category").value;
    const subtasks = Array.from(document.querySelectorAll("#subtask-list li")).map(li => li.textContent);
    const taskData = {
        title,
        description,
        assignedTo,
        dueDate,
        priority,
        category,
        subtasks
    };
    try {
        const result = await postTaskToServer(taskData);
        console.log("Tast hinzugefügt:", result);
        closeBoardAddTask();
    } catch (error) {
        console.error("Task fehlerhaft:", error);
    }
    onload();
}

async function postTaskToServer(data) {
    const response = await fetch(`${BASE_URL}/tasks.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`Folgende Aufgabe konnte nicht geladen werden: ${response.statusText}`);
    }
    return await response.json();
}