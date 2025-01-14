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
    overlayRef.innerHTML = taskOverlayTemplate(task, taskId);
    overlayRef.classList.add("show");
}

function closeTaskOverlay() {
    let overlayRef = document.getElementById("taskOverlay");
    overlayRef.classList.remove("show");
    overlayRef.innerHTML = "";
}

async function deleteTask(taskId) {
    if (!globalTasks || typeof globalTasks !== "object") {
        console.error("globalTasks ist nicht definiert oder hat das falsche Format.");
        return;
    }
    const task = globalTasks[taskId];
    if (!task) {
        console.error("Task mit ID", taskId, "nicht gefunden.");
        return;
    }
    try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error(`Fehler beim Löschen der Aufgabe: ${response.statusText}`);
        }
        delete globalTasks[taskId];
        console.log("Task mit ID", taskId, "erfolgreich gelöscht.");
        displayTasks(globalTasks);
    } catch (error) {
        console.error("Fehler beim Löschen des Tasks:", error);
    }
    closeTaskOverlay();
}

function searchTask() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    if (!globalTasks || typeof globalTasks !== "object") {
        console.error("globalTasks ist nicht definiert oder hat das falsche Format.");
        return;
    }
    const filteredTasks = Object.entries(globalTasks).filter(([id, task]) => {
        const title = task.title?.toLowerCase() || "";
        const description = task.description?.toLowerCase() || "";
        return title.includes(searchTerm) || description.includes(searchTerm);
    });
    displayTasks(Object.fromEntries(filteredTasks));
}

