/* tasks are loaded in */
function onload() {
    loadTask("/tasks");
}

/* global definition of task */
let globalTasks = {};

/* global definition of mainCategory */
let mainCategory = '';

/* define Firebase URL */
const BASE_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/";

/* tasks are loaded from the database */
async function loadTask(path = "/tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    let tasks = await response.json();
    globalTasks = tasks;
    displayTasks(tasks);
}

/* rendering from the task */
function displayTasks(tasks) {
    document.getElementById("tasksContainerToDo").innerHTML = "";
    document.getElementById("tasksContainerInProgress").innerHTML = "";
    document.getElementById("tasksContainerAwaitFeedback").innerHTML = "";
    document.getElementById("tasksContainerDone").innerHTML = "";
    for (const taskId in tasks) {
        const task = tasks[taskId];
        const taskElement = document.createElement("div");
        taskElement.className = "task";
        taskElement.innerHTML = `
        <div draggable="true" ondragstart="dragInit(event, '${taskId}')" class="taskContainer" onclick="openTaskOverlay('${taskId}')">
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
        if (task.mainCategory === "ToDo") {
            document.getElementById("tasksContainerToDo").appendChild(taskElement);
        } else if (task.mainCategory === "InProgress") {
            document.getElementById("tasksContainerInProgress").appendChild(taskElement);
        } else if (task.mainCategory === "AwaitFeedback") {
            document.getElementById("tasksContainerAwaitFeedback").appendChild(taskElement);
        } else if (task.mainCategory === "Done") {
            document.getElementById("tasksContainerDone").appendChild(taskElement);
        }
        for (const taskId in tasks) {
            const task = tasks[taskId];
        }

    }
    emptyTaskContainer();
}

function getToDoAddTaskPage(event) {
    event.preventDefault();
    mainCategory = "ToDo";
    postTask();
}

/* mainCategory assign */
function getToDoButton() {
    mainCategory = "ToDo";
    boardAddTask();
}

/* mainCategory assign */
function getInProgressButton() {
    mainCategory = "InProgress";
    boardAddTask();
}

/* mainCategory assign */
function getAwaitFeedbackButton() {
    mainCategory = "AwaitFeedback";
    boardAddTask();
}

/* add task */
async function postTask() {
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-desc").value;
    const assignedContacts = getSelectedContacts(); // Holt die ausgewählten Kontakte
    const dueDate = document.getElementById("task-date").value;
    const priority = document.querySelector('.prio-btn.active')?.dataset.prio || '';
    const category = document.querySelector('#dropdown-toggle-category span').textContent.trim();
    const subtasks = Array.from(document.querySelectorAll("#subtask-list li")).map(li => ({
        name: li.textContent.trim(),
        completed: false
    }));
    const taskData = {
        title,
        description,
        assignedTo: assignedContacts, // Leer lassen, wenn keine Kontakte ausgewählt wurden
        dueDate,
        priority,
        category,
        subtasks,
        mainCategory
    };
    console.log('Task Data:', taskData);
    try {
        const result = await postTaskToServer(taskData);
        addTaskSuccess();
        closeBoardAddTask();
    } catch (error) {
        console.error('Fehler beim Posten der Aufgabe:', error);
    }
    onload();
}

/* add task */

async function postTaskToServer(taskData) {
    const response = await fetch(`${BASE_URL}/tasks.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    });
    if (!response.ok) {
        console.error(`Server Error: ${response.statusText}`);
        throw new Error(`Folgende Aufgabe konnte nicht geladen werden: ${response.statusText}`);
    }
    return await response.json();
}

/* empty task container */
function emptyTaskContainer() {
    const containers = [
        "tasksContainerAwaitFeedback",
        "tasksContainerInProgress",
        "tasksContainerDone",
        "tasksContainerToDo"
    ];

    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container.innerHTML.trim() === "") {
            container.innerHTML = `<div class='noTasksParent'><p class='noTasksChild'>No tasks To do</p></div>`;
        }
    });
}

/* add task to container */
function addTaskToContainer(containerId, taskHTML) {
    const container = document.getElementById(containerId);
    if (container.innerHTML.trim() === `<div class='noTasksParent'><p class='noTasksChild'>No tasks To do</p></div>`) {
        container.innerHTML = "";
    }
    container.innerHTML += taskHTML;
}