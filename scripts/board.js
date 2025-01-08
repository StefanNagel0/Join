function initBoard() {
    toggleBoardPage();
}

function addTaskButton() {
    boardAddTask();
    addTaskSuccess();
}

function toggleBoardPage() {
    let boardPage = document.getElementById('content');
    boardPage.innerHTML = boardTemplate();
    boardPage.style.display = 'block';
}

function addTaskSuccess() {
    let overlayRef = document.getElementById('addTaskSuccess');
    overlayRef.innerHTML = addTaskSuccessTemplate();
    overlayRef.style.display = "block";

    setTimeout(() => {
        overlayRef.style.display = "none";
        closeBoardAddTask();
    }, 2000);
}

function boardAddTask() {
    let overlayRef = document.getElementById("boardAddTask");
    let darkOverlay = document.getElementById("darkOverlay");
    overlayRef.innerHTML = boardAddTaskTemplate();
    darkOverlay.classList.add("show");
    overlayRef.classList.add("show");
    populateAssignedToDropdown();
}

function closeBoardAddTask() {
    let overlayRef = document.getElementById("boardAddTask");
    let darkOverlay = document.getElementById("darkOverlay");

    overlayRef.classList.remove("show");
    darkOverlay.classList.remove("show");
}

function openTaskOverlay(taskId) {
    const task = globalTasks[taskId];
    if (!task) {
        console.error("Task mit ID", taskId, "nicht gefunden.");
        return;
    }
    const overlayRef = document.getElementById("taskOverlay");
    overlayRef.innerHTML = taskOverlayTemplate(task);
    overlayRef.classList.add("show");
}

function closeTaskOverlay() {
    let overlayRef = document.getElementById("taskOverlay");
    overlayRef.classList.remove("show");
    overlayRef.innerHTML = "";
}

function populateAssignedToDropdown() {
    const assignedToDropdown = document.getElementById("task-assigned");
    const users = [];

    assignedToDropdown.innerHTML = "";
    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user;
        option.textContent = user;
        assignedToDropdown.appendChild(option);
    });
}