/** initalizes the board */
function initBoard() {
    toggleBoardPage();
    setDateValidation();
    initHeader();
}

/** Initailization of the Add Task function */
function addTaskButton() {
    boardAddTask();
    addTaskSuccess();
}

/** The board is loaded */
function toggleBoardPage() {
    let boardPage = document.getElementById('content');
    boardPage.innerHTML = boardTemplate();
    boardPage.style.display = 'block';
}

/** Displays a success message overlay when a task is added successfully. */
function addTaskSuccess() {
    let overlayRef = document.getElementById('addTaskSuccess');
    overlayRef.innerHTML = addTaskSuccessTemplate();
    overlayRef.style.display = "flex";
    setTimeout(() => {
        overlayRef.style.display = "none";
    }, 2000);
}

/** Task has been badged */
function boardAddTask() {
    let overlayRef = document.getElementById("boardAddTask");
    let darkOverlay = document.getElementById("darkOverlay");
    overlayRef.innerHTML = boardAddTaskTemplate();
    darkOverlay.classList.add("show");
    overlayRef.classList.add("show");
    initializeContactsDropdown();
    initializeSubtasks();
    initializePriorityButtons();
}

/** Closure of the task */
function closeBoardAddTask() {
    let overlayRef = document.getElementById("boardAddTask");
    let darkOverlay = document.getElementById("darkOverlay");
    overlayRef.classList.remove("show");
    darkOverlay.classList.remove("show");
    closeTaskOverlay();
}

/** Displays the task overlay along with a dark background overlay. */
function showOverlayTask() {
    let showOverlay = document.getElementById("taskOverlay");
    let darkOverlay = document.getElementById("darkOverlay");
    darkOverlay.classList.add("show");
    showOverlay.classList.add("show");
}

/** Opens the task overlay */
async function openTaskOverlay(taskId) {
    let task = await getOneTask(taskId);
    if (!task) return console.error("Task mit ID", taskId, "nicht gefunden.");
    let overlayRef = document.getElementById("taskOverlay");
    overlayRef.innerHTML = taskOverlayTemplate(task, taskId);
    applyOverlayStyles(taskId, task);
    overlayRef.classList.add("show");
    showOverlayTask();
}

/** Applies styles to the task overlay elements */
function applyOverlayStyles(taskId, task) {
    let elements = {
        title: "taskTitleID",
        description: "taskDescriptionID",
        date: "taskDateID",
        assigned: "taskAssignedID",
        priority: "taskPriorityIDName",
        status: "taskStatusID"
    };
    toggleCategory(taskId);
    Object.entries(elements).forEach(([key, id]) => updateOverlayClass(id, key));
    document.getElementById(elements.description).innerText = task.description;
}

/** Updates CSS classes for overlay elements */
function updateOverlayClass(id, type) {
    let element = document.getElementById(id);
    if (!element) return;
    let baseClass = `task${type.charAt(0).toUpperCase() + type.slice(1)}`;
    let overlayClass = `openTaskOverlay${type.charAt(0).toUpperCase() + type.slice(1)}`;
    element.classList.replace(baseClass, overlayClass);
}

/** Task update */
function toggleCategory(taskId) {
    let taskElement = document.querySelector(`#task-${taskId}`);
    if (!taskElement) {
        console.error();
        return;
    }
    let userStoryElement = taskElement.querySelector(".taskCategoryUserStory");
    let technicalElement = taskElement.querySelector(".taskCategoryTechnical");
    if (userStoryElement && userStoryElement.classList.contains('taskCategoryUserStory')) {
        userStoryElement.classList.remove('taskCategoryUserStory');
        userStoryElement.classList.add('openTaskOverlayCategoryUserStory');
    } else if (technicalElement && technicalElement.classList.contains('taskCategoryTechnical')) {
        technicalElement.classList.remove('taskCategoryTechnical');
        technicalElement.classList.add('openTaskOverlayCategoryTechnical');
    }
}

/** Closes the task that is open in the overlay */
function closeTaskOverlay() {
    let overlayRef = document.getElementById("taskOverlay");
    let darkOverlay = document.getElementById("darkOverlay");
    darkOverlay.classList.remove("show");
    overlayRef.classList.remove("show");
    overlayRef.innerHTML = "";
    selectedContactsGlobal = [];
    const selectedContactsContainer = document.getElementById('selected-contacts');
    if (selectedContactsContainer) {
        selectedContactsContainer.innerHTML = '';
    }
}

/** Deletes a task */
async function deleteTask(taskId) {
    if (!isValidGlobalTasks()) return;
    let task = globalTasks[taskId];
    if (!task) return console.error("Task mit ID", taskId, "nicht gefunden.");
    try {
        await deleteTaskFromDB(taskId);
        delete globalTasks[taskId];
        displayTasks(globalTasks);
    } catch (error) {
        console.error("Fehler beim Löschen des Tasks:", error);
    }
    closeTaskOverlay();
}

/** Checks if globalTasks is valid */
function isValidGlobalTasks() {
    if (!globalTasks || typeof globalTasks !== "object") {
        console.error("globalTasks ist nicht definiert oder hat das falsche Format.");
        return false;
    }
    return true;
}

/** Sends a DELETE request to remove a task */
async function deleteTaskFromDB(taskId) {
    let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Fehler beim Löschen der Aufgabe: ${response.statusText}`);
}

/** Task search */
function searchTask() {
    let searchTerm = document.getElementById("search").value.toLowerCase();
    if (!globalTasks || typeof globalTasks !== "object") {
        console.error("globalTasks ist nicht definiert oder hat das falsche Format.");
        return;
    }
    let filteredTasks = Object.entries(globalTasks).filter(([id, task]) => {
        let title = task.title?.toLowerCase() || "";
        let description = task.description?.toLowerCase() || "";
        return title.includes(searchTerm) || description.includes(searchTerm);
    });
    displayTasks(Object.fromEntries(filteredTasks));
}

/** validate and format the due date */
function validateDueDate() {
    let dateInput = document.getElementById('editDueDate').value;
    let datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/;
    if (!datePattern.test(dateInput)) {
        alert('Bitte gib das Datum im Format DD/MM/YYYY ein.');
    } else {
        let parts = dateInput.split('/');
        let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        alert(`Datum ist gültig: ${formattedDate}`);
    }
}