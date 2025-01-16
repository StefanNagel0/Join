/* Tasks are loaded in */
function onload() {
    loadTask("/tasks");
}

/* Global definition of task */
let globalTasks = {};

/* Define Firebase URL */
const BASE_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/";

/* Tasks are loaded from the database */
async function loadTask(path = "/tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    let tasks = await response.json();
    globalTasks = tasks;
    displayTasks(tasks);
}

/* Rendering from the task */
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

/* Add task */
async function postTask() {
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-desc").value;
    const assignedTo = document.getElementById("task-assigned").textContent.trim();
    const dueDate = document.getElementById("task-date").value;
    const priority = document.querySelector('.prio-btn.active')?.dataset.prio || '';
    const category = document.querySelector('#dropdown-toggle-prio span').textContent;
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
        console.log("Task hinzugefügt:", result);
        addTaskSuccess();
        closeBoardAddTask();
    } catch (error) {
        console.error("Task fehlerhaft:", error);
    }
    onload();
}

/* Send task to server */
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
