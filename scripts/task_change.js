/**
 * Executes when the document is fully loaded.
 * Initiates the loading of tasks from the specified path.
 */

function onload() {
    loadTask("/tasks");
}

/** global definition of task */
let globalTasks = {};

/** global definition of mainCategory */
let mainCategory = '';

/** define Firebase URL */
const BASE_URL = "https://secret-27a6b-default-rtdb.europe-west1.firebasedatabase.app/";

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
    let taskArray = Object.entries(tasks);
    taskArray.forEach(([taskId, task]) => {
        if (!task.mainCategory) {
            return;
        }
        let taskElement = createTaskElement(task, taskId);
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
    let taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.innerHTML = `
        <div draggable="true" ondragstart="dragInit(event, '${taskId}')" class="taskContainer" onclick="openTaskOverlay('${taskId}')">
            <div class="taskChildContainer">
                ${taskCategoryTemplate(task, taskId)}
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
    let category = task.mainCategory;
    let containerId = `tasksContainer${category}`;
    document.getElementById(containerId).appendChild(taskElement);
}

/**Handles the click event for the "To Do" button.*/
function getToDoButton() {
    if (window.innerWidth <= 900) {
        window.location.href = './add_task.html';
    } else {
        mainCategory = "ToDo";
        boardAddTask();
    }
};

/**mainCategory assign */
function getInProgressButton() {
    mainCategory = "InProgress";
    boardAddTask();
}

/** mainCategory assign */
function getAwaitFeedbackButton() {
    mainCategory = "AwaitFeedback";
    boardAddTask();
}

/** Posts the task after validating the category.*/
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

/**Toggles the error message for the category field.*/
function toggleCategoryError(isValid) {
    let categoryElement = document.getElementById('dropdown-toggle-category');
    let errorElement = document.getElementById('category-error');
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
        text: li.textContent.trim().replace('• ', ''),
        completed: false
    }));
}

/** Handles task submission, validates category, and adds the task to Firebase.*/
function submitAddTask(event) {
    event.preventDefault();
    if (!validateCategorySubmit()) return;
    let task = createTaskObject(document.getElementById('task-form'));
    addTaskToFirebase(task).then(() => {
        resetFormAndNotify(document.getElementById('task-form'));
        getToDoAddTaskPage(event);
    }).catch(console.error);
}

/** Validates the selected category. */
function validateCategorySubmit() {
    let categoryText = document.querySelector('#dropdown-toggle-category span').textContent;
    let categoryError = document.getElementById('category-error');
    if (categoryText === 'Select task category') {
        document.getElementById('dropdown-toggle-category').classList.add('error');
        categoryError.classList.remove('hidden');
        return false;
    }
    document.getElementById('dropdown-toggle-category').classList.remove('error');
    categoryError.classList.add('hidden');
    return true;
}

/** Adds a task to Firebase */
async function addTaskToFirebase(task) {
    try {
        let response = await sendTaskToFirebase(task);
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Speichern des Tasks:', error);
        throw error;
    }
}

/** Sends the task data to Firebase */
async function sendTaskToFirebase(task) {
    const TASKS_URL = `${BASE_URL}tasks.json`;
    let response = await fetch(TASKS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error(`Fehler: ${response.statusText}`);
    return response;
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
            text: li.textContent.trim(),
            completed: false
        })),
        mainCategory: "ToDo"
    };
}

/** Displays a confirmation message to the user and redirects to the board page */
function showConfirmationAndRedirect() {
    let confirmationMessage = document.getElementById('confirmation-message');
    confirmationMessage.classList.add('show');
    setTimeout(() => {
        confirmationMessage.classList.remove('show');
        window.location.href = 'board.html';
    }, 1500);
}

/**Sends task data to the server and saves it.*/
async function postTaskToServer(taskData) {
    let response = await fetch(`${BASE_URL}/tasks.json`, {
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

/** empty task container */
function emptyTaskContainer() {
    let containers = [
        "tasksContainerAwaitFeedback",
        "tasksContainerInProgress",
        "tasksContainerDone",
        "tasksContainerToDo"
    ];
    containers.forEach(containerId => {
        let container = document.getElementById(containerId);
        if (container.innerHTML.trim() === "") {
            container.innerHTML = `<div class='noTasksParent'><p class='noTasksChild'>No tasks To do</p></div>`;
        }
    });
}

/** add task to container */
function addTaskToContainer(containerId, taskHTML) {
    let container = document.getElementById(containerId);
    if (container.innerHTML.trim() === `<div class='noTasksParent'><p class='noTasksChild'>No tasks To do</p></div>`) {
        container.innerHTML = "";
    }
    container.innerHTML += taskHTML;
}

/**Fixes missing main categories for tasks by setting a default value ('ToDo').*/
async function fixTasksMainCategory() {
    let response = await fetch(BASE_URL + "/tasks.json");
    let tasks = await response.json();
    for (let [taskId, task] of Object.entries(tasks)) {
        if (!task.mainCategory) {
            task.mainCategory = 'ToDo';
            await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mainCategory: 'ToDo' }),
            });
        }
    }
}
fixTasksMainCategory();

/**
 * Toggles the display of the task switch overlay for a given task.
 * Updates the overlay content with task switch options.
 */
function taskSwitchMainCategory(taskId, task) {
    console.log(taskId, task);
    let overlayRef = document.getElementById("openTaskSwitchOverlay");
    overlayRef.innerHTML = taskSwitchTemplate(task, taskId);
}

/**
 * Generates an HTML template for task status change buttons.
 * The buttons allow users to move a task between different stages:
 * ToDo, In Progress, Await Feedback, and Done.
 * */
function taskSwitchTemplate(task, taskId) {
    return `
        <div class="taskSwitchContainer">
            <button onclick="event.stopPropagation(), moveToCategory('${taskId}', 'ToDo')">ToDo</button>
            <button onclick="event.stopPropagation(), moveToCategory('${taskId}', 'InProgress')">In Progress</button>
            <button onclick="event.stopPropagation(), moveToCategory('${taskId}', 'AwaitFeedback')">Await Feedback</button>
            <button onclick="event.stopPropagation(), moveToCategory('${taskId}', 'Done')">Done</button>
            <button id="taskSwitchCancel" onclick="event.stopPropagation(), closeTaskSwitchTemplate('${taskId}'), closeTaskOverlay()">X</button>
            </div>
    `;
}

/**
 * Toggles the visibility of the task switch overlay for a specific task.
 */
function taskSwitchMainCategory(taskId, currentCategory) {
    let overlayRef = document.getElementById(`taskSwitchOverlay-${taskId}`);
    overlayRef.style.display = overlayRef.style.display === "none" ? "block" : "none";
}

/**
 * Moves a task to a new category.
 * Updates the main category of the task with the given taskId,
 * saves the changes to the database, and refreshes the task display.
 * Logs an error if the task is not found.
*/
async function moveToCategory(taskId, newCategory) {
    let task = globalTasks[taskId];
    if (!task) return console.error(`Task with ID ${taskId} not found.`);
    task.mainCategory = newCategory;
    await updateTaskInDatabase(taskId, task);
    displayTasks(globalTasks);
    closeTaskOverlay();
}

function closeTaskSwitchTemplate(taskId) {
    let overlayRef = document.getElementById(`taskSwitchOverlay-${taskId}`);
    overlayRef.style.display = "none";
}