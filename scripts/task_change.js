/* Tasks are loaded in */
function onload() {
    loadTask("/tasks");
}

/* Global definition of task */
let globalTasks = {};

/* Global definition of mainCategory */
let mainCategory = '';

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
    document.getElementById("tasksContainerToDo").innerHTML = "";
    document.getElementById("tasksContainerInProgress").innerHTML = "";
    document.getElementById("tasksContainerAwaitFeedback").innerHTML = "";
    document.getElementById("tasksContainerDone").innerHTML = "";
    // const tasksContainer = document.getElementById("tasksContainerToDo");
    // tasksContainer.innerHTML = "";
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
        // tasksContainer.appendChild(taskElement);
        for (const taskId in tasks) {
            const task = tasks[taskId];
            // console.log(`Task ID: ${taskId}, Mainkategorie: ${task.mainCategory}`);
        }
        emptyTaskContainer();
    }
}

/*  */
function getToDoButton() {
    mainCategory = "ToDo";
    boardAddTask();
}

function getInProgressButton() {
    mainCategory = "InProgress";
    boardAddTask();
}

function getAwaitFeedbackButton() {
    mainCategory = "AwaitFeedback";
    boardAddTask();
}

/* Add task */
async function postTask() {
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-desc").value;
    const assignedToElement = document.getElementById("task-assigned");
    const assignedTo = assignedToElement ? assignedToElement.textContent.trim() : '';
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
        subtasks,
        mainCategory
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

function emptyTaskContainer() {
    const container = document.getElementById("tasksContainerAwaitFeedback");
    if (container.innerHTML === "") {
        container.innerHTML = `<h1>Keine Aufgaben</h1>`;
    }
    const container2 = document.getElementById("tasksContainerInProgress");
    if (container2.innerHTML === "") {
        container2.innerHTML = `<h1>Keine Aufgaben</h1>`;
    }
    const container3 = document.getElementById("tasksContainerDone");
    if (container3.innerHTML === "") {
        container3.innerHTML = `<h1>Keine Aufgaben</h1>`;
    }
    const container4 = document.getElementById("tasksContainerToDo");
    if (container4.innerHTML === "") {
        container4.innerHTML = `<h1>Keine Aufgaben</h1>`;
    }
}