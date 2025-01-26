let currentDraggedElement;

/* Initializes the drag process and saves the task ID */
function dragInit(event, taskId) {
    currentDraggedElement = taskId;
    event.dataTransfer.setData("text/plain", taskId);
    startDrag(taskId);
}

/* Allows tasks to be placed in the target container */
function allowDrop(event) {
    event.preventDefault();
}

/* Handles the filing of tasks and updates the data structure */
function drop(event, newStatus) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    moveTaskToNewStatus(taskId, newStatus);
    endDrag();
}

/* Updates the task in the data structure and database */
function moveTaskToNewStatus(taskId, newStatus) {
    const task = globalTasks[taskId];
    task.mainCategory = newStatus;
    updateTaskInDatabase(taskId, task);
    displayTasks(globalTasks);
}

/* Highlights the task visually while it is being dragged */
function startDrag(taskId) {
    const taskElement = document.getElementById(`task-${taskId}`);
    taskElement.classList.add("dragging");
}

/* Removes the visual highlighting when dragging ends */
function endDrag() {
    const taskElement = document.querySelector(".task.dragging");
    if (taskElement) taskElement.classList.remove("dragging");
}

/* Updates the task in the database */
async function updateTaskInDatabase(taskId, updatedTask) {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTask)
    });
    if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren: ${response.statusText}`);
    }
}