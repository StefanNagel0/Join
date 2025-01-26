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

/**Loads tasks from a specified path and displays them.*/
async function loadTask(path = "/tasks") {
    let response = await fetch(BASE_URL + path + ".json");
    let tasks = await response.json();
    globalTasks = tasks;
    displayTasks(tasks);
}

/**Displays tasks in their corresponding containers.*/
function displayTasks(tasks) {
    clearTaskContainers();
    const taskArray = Object.entries(tasks);
    taskArray.forEach(([taskId, task]) => {
        const taskElement = createTaskElement(task, taskId);
        appendTaskToCategory(task, taskElement);
    });
    emptyTaskContainer();
}

/**Clears all task containers.*/
function clearTaskContainers() {
    document.getElementById("tasksContainerToDo").innerHTML = "";
    document.getElementById("tasksContainerInProgress").innerHTML = "";
    document.getElementById("tasksContainerAwaitFeedback").innerHTML = "";
    document.getElementById("tasksContainerDone").innerHTML = "";
}

/**Creates a task element with the provided task data.*/
function createTaskElement(task, taskId) {
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
            </div>
        </div>
    `;
    return taskElement;
}

/**Appends the task element to the correct category container.*/
function appendTaskToCategory(task, taskElement) {
    const category = task.mainCategory;
    const containerId = `tasksContainer${category}`;
    document.getElementById(containerId).appendChild(taskElement);
}

/**
 * Handles the click event for the "To Do" button.
 * Redirects to add_task.html if the window width is 900px or less.
 * Otherwise, sets the main category to "ToDo" and calls boardAddTask().
 */
function getToDoButton() {
    if (window.innerWidth <= 900) {
        window.location.href = './add_task.html';
    } else {
        mainCategory = "ToDo";
        boardAddTask();
    }
};

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

/**Posts the task after validating the category.*/
async function postTask() {
    if (!validateCategory()) return;
    try {
        const result = await postTaskToServer(getTaskData());
        addTaskSuccess();
        closeBoardAddTask();
    } catch (error) {
        console.error('Error posting task:', error);
    }
    onload();
}

/**Validates whether a valid category has been selected.*/
function validateCategory() {
    const categoryText = document.querySelector('#dropdown-toggle-category span').textContent;
    const isValid = categoryText !== 'Select task category';
    toggleCategoryError(isValid);
    return isValid;
}

/**Toggles the error message for the category field.*/
function toggleCategoryError(isValid) {
    const categoryElement = document.getElementById('dropdown-toggle-category');
    const errorElement = document.getElementById('category-error');
    categoryElement.classList.toggle('error', !isValid);
    errorElement.classList.toggle('hidden', isValid);
}

/**Collects task data from the form fields and returns an object.*/
function getTaskData() {
    return {
        title: getTitle(),
        description: getDescription(),
        assignedTo: getSelectedContacts(),
        dueDate: getDueDate(),
        priority: getPriority(),
        category: getCategory(),
        subtasks: getSubtasks(),
        mainCategory
    };
}

/**Retrieves the task title from the input field.*/
function getTitle() {
    return document.getElementById("task-title").value;
}

/**Retrieves the task description from the input field.*/
function getDescription() {
    return document.getElementById("task-desc").value;
}

/**Retrieves the task due date from the input field.*/
function getDueDate() {
    return document.getElementById("task-date").value;
}

/**Retrieves the selected task priority from the active priority button.*/
function getPriority() {
    return document.querySelector('.prio-btn.active')?.dataset.prio || '';
}

/**Retrieves the selected task category from the dropdown.*/
function getCategory() {
    return document.querySelector('#dropdown-toggle-category span').textContent.trim();
}

/**Collects the subtasks from the list and returns an array of objects.*/
function getSubtasks() {
    return Array.from(document.querySelectorAll("#subtask-list li")).map(li => ({
        name: li.textContent.trim(), completed: false
    }));
}

/**Handles the submission of the add-task form, collects task data*/
function submitAddTask(event) {
    event.preventDefault();
    const categoryText = document.querySelector('#dropdown-toggle-category span').textContent;
    if (categoryText === 'Select task category') {
        document.getElementById('dropdown-toggle-category').classList.add('error');
        document.getElementById('category-error').classList.remove('hidden');
        return;
    } else {
        document.getElementById('dropdown-toggle-category').classList.remove('error');
        document.getElementById('category-error').classList.add('hidden');
    }
    const form = document.getElementById('task-form');
    const task = createTaskObject(form);
    resetFormAndNotify(form);
}

/**Collects task data from the add-task form fields and constructs a task object.*/
function collectTaskData() {
    return {
        title: document.getElementById("task-title").value,
        description: document.getElementById("task-desc").value,
        assignedTo: getSelectedContacts(),
        dueDate: document.getElementById("task-date").value,
        priority: document.querySelector('.prio-btn.active')?.dataset.prio || '',
        category: document.querySelector('#dropdown-toggle-category span').textContent.trim(),
        subtasks: Array.from(document.querySelectorAll("#subtask-list li")).map(li => ({
            name: li.textContent.trim(),
            completed: false
        })),
        mainCategory: "ToDo"
    };
}

/** Displays a confirmation message to the user and redirects to the board page */
function showConfirmationAndRedirect() {
    const confirmationMessage = document.getElementById('confirmation-message');
    confirmationMessage.classList.add('show');
    setTimeout(() => {
        confirmationMessage.classList.remove('show');
        window.location.href = 'board.html';
    }, 1500);
}

/**Sends task data to the server and saves it.*/
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