
document.addEventListener("DOMContentLoaded", () => {
    initializeKanban();
});

/** Initialisiert das Kanban-Board */
function initializeKanban() {
    loadTasks(); // Tasks laden
}

/** Lädt die Tasks aus der Datenbank */
async function loadTasks() {
    try {
        const response = await fetch(`${BASE_URL}/tasks.json`);
        if (!response.ok) throw new Error("Fehler beim Laden der Tasks.");
        const tasks = await response.json() || {};
        globalTasks = tasks;
        updateHTML();
    } catch (error) {
        console.error("Fehler beim Laden der Tasks:", error);
    }
}

/** Aktualisiert das HTML des Boards */
function updateHTML() {
    const categories = ["to-do", "in-progress", "await-feedback", "done"];
    categories.forEach(category => {
        const container = document.getElementById(`${category}-tasks`);
        if (!container) {
            console.error(`Container für Kategorie '${category}' nicht gefunden.`);
            return;
        }
        container.innerHTML = ""; // Container leeren

        const filteredTasks = Object.entries(globalTasks).filter(
            ([, task]) => task.category === category
        );

        filteredTasks.forEach(([id, task]) => {
            container.innerHTML += generateTaskHTML(id, task);
        });
    });

    enableDragAndDrop();
}

/** Generiert das HTML für eine einzelne Aufgabe */
function generateTaskHTML(taskId, task) {
    return `
        <div class="task" draggable="true" ondragstart="startDragging('${taskId}')">
            <h3>${task.title}</h3>
            <p>${task.description || "Keine Beschreibung"}</p>
            <p><strong>Priorität:</strong> ${task.priority || "N/A"}</p>
        </div>
    `;
}

/** Aktiviert Drag-and-Drop für die Tasks */
function enableDragAndDrop() {
    const tasks = document.querySelectorAll(".task");
    tasks.forEach(task => {
        task.setAttribute("draggable", "true");
    });

    const columns = document.querySelectorAll(".boardColumn");
    columns.forEach(column => {
        column.addEventListener("dragover", allowDrop);
        column.addEventListener("drop", event => dropTask(event, column.id));
    });
}

/** Startet das Dragging einer Aufgabe */
function startDragging(taskId) {
    currentDraggedTask = taskId;
}

/** Erlaubt das Ablegen einer Aufgabe */
function allowDrop(event) {
    event.preventDefault();
}

/** Behandelt das Ablegen einer Aufgabe */
async function dropTask(event, category) {
    event.preventDefault();
    if (currentDraggedTask) {
        globalTasks[currentDraggedTask].category = category;
        await updateTaskInDatabase(currentDraggedTask, globalTasks[currentDraggedTask]);
        updateHTML();
    }
}

/** Aktualisiert eine Aufgabe in der Datenbank */
async function updateTaskInDatabase(taskId, updatedTask) {
    try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTask)
        });
        if (!response.ok) throw new Error("Fehler beim Aktualisieren der Aufgabe.");
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Aufgabe:", error);
    }
}

/** Fügt eine neue Aufgabe hinzu */
async function postTask() {
    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-desc").value.trim();
    const assignedTo = document.getElementById("task-assigned").textContent.trim();
    const dueDate = document.getElementById("task-date").value;
    const priority = document.querySelector(".prio-btn.active")?.dataset.prio || "";
    const category = "to-do";
    const subtasks = Array.from(document.querySelectorAll("#subtask-list li")).map(li => li.textContent);

    const newTask = { title, description, assignedTo, dueDate, priority, category, subtasks };

    try {
        const response = await fetch(`${BASE_URL}/tasks.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTask)
        });
        if (!response.ok) throw new Error("Fehler beim Hinzufügen der Aufgabe.");
        console.log("Aufgabe erfolgreich hinzugefügt:", await response.json());
        closeBoardAddTask();
        loadTasks();
    } catch (error) {
        console.error("Fehler beim Hinzufügen der Aufgabe:", error);
    }
}

/** Löscht eine Aufgabe */
async function deleteTask(taskId) {
    try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Fehler beim Löschen der Aufgabe.");
        console.log(`Aufgabe mit ID ${taskId} erfolgreich gelöscht.`);
        delete globalTasks[taskId];
        updateHTML();
    } catch (error) {
        console.error("Fehler beim Löschen der Aufgabe:", error);
    }
}