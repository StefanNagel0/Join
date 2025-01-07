function initBoardReloaded() {
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
}

function closeBoardAddTask() {
    let overlayRef = document.getElementById("boardAddTask");
    let darkOverlay = document.getElementById("darkOverlay");

    overlayRef.classList.remove("show");
    darkOverlay.classList.remove("show");
}

function openTaskOverlay() {
    let overlayRef = document.getElementById("taskOverlay");
    overlayRef.innerHTML = taskOverlayTemplate();
    overlayRef.classList.add("show");
}

function closeTaskOverlay() {
    let overlayRef = document.getElementById("taskOverlay");
    overlayRef.classList.remove("show");
}