let detailTask

// Funktion zur Normalisierung der Priorität
function normalizePriority(priority) {
    return priority ? priority.toLowerCase() : ''; // Konvertiert die Priorität in Kleinbuchstaben
}


function editTask(taskId) {
    console.log("Aufruf von editTask mit Task ID:", taskId);  // Debugging
    if (!taskId) {
        console.error("Fehler: taskId ist undefined oder null!");
        return;
    }
    const task = globalTasks[taskId];
    detailTask = task;
    console.log(detailTask);
    if (!task) {
        console.error(`Task mit ID ${taskId} nicht gefunden.`);
        return;
    }
    console.log("Gefundene Task:", task);
    console.log("Subtasks:", task.subtasks);

    // Lade das Overlay mit den bearbeitbaren Feldern
    const overlayRef = document.querySelector(".openTaskOverlayMain");
    overlayRef.innerHTML = `
        <input id="editTitle" type="text" value="${task.title}">
        <textarea id="editDescription">${task.description}</textarea>
        <input id="editDueDate" type="date" value="${task.dueDate}">
        ${taskEditPriority(task)} <!-- Füge Priorität hinzu -->
        ${taskEditAssignedTo(task)} <!-- Füge Assigned to hinzu -->
        ${taskEditSubtasks(task, taskId)} <!-- Füge Subtasks hinzu und übergebe taskId -->
        <button onclick="saveTask('${taskId}')">OK</button>
    `;
    // Stelle sicher, dass der richtige Prioritätsbutton die 'active' Klasse bekommt
    applyActivePriorityButton(task.priority);
    // Füge Event-Listener für das Umschalten der Priorität hinzu
    document.querySelectorAll("#task-priority .prio-btn").forEach(button => {
        button.onclick = function () {
            // Entferne die aktive Klasse von allen Buttons
            document.querySelectorAll("#task-priority .prio-btn").forEach(btn => btn.classList.remove("active"));
            // Setze die aktive Klasse auf den angeklickten Button
            button.classList.add("active");
            // Speichere die neue Priorität im `data-priority`-Attribut
            document.getElementById("task-priority").setAttribute("data-priority", button.getAttribute("data-prio"));
        };
    });
    setupDateValidation();
}

// Funktion, um die 'active' Klasse basierend auf der Priorität zu setzen
function applyActivePriorityButton(priority) {
    // Warten Sie, bis das DOM vollständig geladen ist
    const priorityButton = document.querySelector(`#task-priority .prio-btn[data-prio="${priority}"]`);
    
    if (priorityButton) {
        // Entferne die aktive Klasse von allen Buttons
        document.querySelectorAll("#task-priority .prio-btn").forEach(btn => btn.classList.remove("active"));
        // Füge die aktive Klasse dem entsprechenden Button hinzu
        priorityButton.classList.add("active");
    } else {
        console.log(`Kein Button mit der Priorität "${priority}" gefunden.`);
    }
}

function taskEditTitle(task) {
    return `
    <div class="openEditTaskOverlayTitle">
        <label for="editTitle">Title</label>
        <input id="editTitle" type="text" value="${task.title}" />
    </div>
    `;
}

function taskEditDescription(task) {
    return `
    <div class="openEditTaskOverlayDescription">
        <label for="editDescription">Description</label>
        <textarea class="" maxlength="150" id="editDescription">${task.description}</textarea>
    </div>
    `;
}

function taskEditDate(task) {
    return `
    <div class="openEditTaskOverlayDueDate">
        <label for="editDueDate">Due Date</label>
        <input type="date" id="editDueDate" value="${task.dueDate}" />
        <small id="dateError" style="color: red; display: none;">Datum muss zwischen heute und 100 Jahre in der Zukunft liegen</small>
    </div>
    `;
}

function setupDateValidation() {
    const dateInput = document.getElementById("editDueDate");
    const errorText = document.getElementById("dateError");
    if (!dateInput) {
        console.error("Fehler: Kein Eingabefeld für das Datum gefunden.");
        return;
    }
    const today = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 100);
    const maxDateString = maxDate.toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
    dateInput.setAttribute("max", maxDateString);
    dateInput.addEventListener("input", function () {
        const selectedDate = new Date(dateInput.value);
        const minDate = new Date(today);
        if (selectedDate < minDate || selectedDate > maxDate) {
            dateInput.style.border = "2px solid red";
            errorText.style.display = "block";
        } else {
            dateInput.style.border = "";
            errorText.style.display = "none";
        }
        dateInput.style.color = "black";
    });
}


// Hauptfunktion zum Erstellen des Bearbeitungsformulars für das Fälligkeitsdatum
// function taskEditDate(task) {
//     return `
//     <div class="openEditTaskOverlayDueDate">
//         <label for="editDueDate">Due Date</label>
//         <input type="date" id="editDueDate" value="${task.dueDate}" />
//     </div>
//     `;
// }

function taskEditPriority(task) {
    return `
        <div class="gap_8">
            <p class="prio_text">Prio</p>
            <div id="task-priority" data-priority="${task.priority}">
                <button type="button" class="prio-btn urgent" data-prio="Urgent">
                    Urgent <img src="../assets/svg/add_task/prio_urgent.svg" alt="">
                </button>
                <button type="button" class="prio-btn medium" data-prio="Medium">
                    Medium <img src="../assets/svg/add_task/prio_medium.svg" alt="">
                </button>
                <button type="button" class="prio-btn low" data-prio="Low">
                    Low <img src="../assets/svg/add_task/prio_low.svg" alt="">
                </button>
            </div>
        </div>
    `;
}

function taskEditAssignedTo(task) {
    const assignedContacts = task.assignedTo || []; // Bereits zugewiesene Kontakte
    const contactListHtml = contacts.map(contact => {
        const isSelected = assignedContacts.includes(contact.name);
        return `
            <div class="contact-item ${isSelected ? 'selected' : ''}" data-fullname="${contact.name}" onclick="toggleContactSelectionUI(this, '${contact.name}')">
                <div class="contact-circle-label">
                    <div class="initials-circle" style="background-color: ${getContactColor(contact.name)}">
                        ${getInitials(contact.name)}
                    </div>
                    <span class="contact-label">${contact.name}</span>
                </div>
                <input type="checkbox" ${isSelected ? 'checked' : ''} />
            </div>
        `;
    }).join("");

    return `
        <div id="task-assigned" class="dropdown-wrapper">
            <div class="dropdown-toggle" onclick="toggleEditTaskDropdown(event, this, document.querySelector('.dropdown-content'))">
                <span>Select contacts to assign</span>
                <span class="dropdown-arrow"></span>
            </div>
            <div class="dropdown-content">
                ${contactListHtml}
            </div>
            <div id="selected-contacts" class="selected-contacts">
                ${assignedContacts.map(contactName => `
                    <div class="selected-contact" data-fullname="${contactName}">
                        <div class="initials-circle" style="background-color: ${getContactColor(contactName)}">
                            ${getInitials(contactName)}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function toggleEditTaskDropdown(event, toggle, options) {
    event.stopPropagation(); // Verhindert, dass der Klick außerhalb das Dropdown schließt
    const visible = options.classList.contains('visible'); // Prüft, ob es bereits sichtbar ist
    options.classList.toggle('visible', !visible); // Fügt die 'visible'-Klasse hinzu oder entfernt sie
    toggle.classList.toggle('open', !visible); // Fügt 'open'-Klasse hinzu, um das Pfeilsymbol zu toggeln
}

function toggleEditTaskDropdown(event, toggle, options) {
    // Prüfen, ob das Event ein echtes Event-Objekt ist
    if (event && typeof event.stopPropagation === 'function') {
        event.stopPropagation();
    }

    // Überprüfen, ob das Dropdown sichtbar ist
    const visible = options.classList.contains('visible');
    options.classList.toggle('visible', !visible);
    options.classList.toggle('hidden', visible);
    toggle.classList.toggle('open', !visible);
}


function toggleContactSelectionUI(container, contactName) {
    const checkbox = container.querySelector("input[type='checkbox']");
    const isSelected = checkbox.checked = !checkbox.checked; // Umschalten des Status
    container.classList.toggle("selected", isSelected);

    const selectedContactsContainer = document.getElementById('selected-contacts');
    toggleContactSelection({ name: contactName }, isSelected, selectedContactsContainer);
}

function taskEditSubtasks(task, taskId) {
    if (!task || !task.subtasks) return ''; // Sicherstellen, dass task existiert
    console.log("task.id in taskEditSubtasks:", taskId);  // Debugging für task.id

    const subtasksHtml = task.subtasks.map((subtask, index) => {
        return `
            <div class="openEditTaskOverlaySubtask" id="subtask-container-${index}">
                <label id="subtask-${index}">${subtask.text}</label>
                <div class="subtaskEditingContainer">
                    <button onclick="toggleEditSubtask(${index}, '${taskId}')">
                        <img src="../assets/svg/edit.svg" alt="">
                    </button>
                    <button onclick="deleteSubtask(${index}, '${taskId}')">
                        <img src="../assets/svg/delete.svg" alt="">
                    </button>
                </div>
            </div>
        `;
    }).join("");

    return `
        <div class="openTaskOverlaySubtaskContainer">
            <p class="openTaskOverlaySubtaskTitle">Subtasks</p>
            ${subtasksHtml}
        </div>
    `;
}

function toggleEditSubtask(index, taskId) {
    console.log("taskId in toggleEditSubtask:", taskId);  // Debugging für taskId
    let subtaskContainer = document.getElementById(`subtask-container-${index}`);
    if (!subtaskContainer) return console.error("Subtask-Container nicht gefunden!");
    let subtaskLabel = document.getElementById(`subtask-${index}`);
    if (!subtaskLabel) return console.error("Subtask-Label nicht gefunden!");
    let currentText = subtaskLabel.innerText; // Aktueller Text des Subtasks
    subtaskContainer.innerHTML = `
        <input type="text" id="edit-subtask-${index}" value="${currentText}" />
        <button data-task-id="${taskId}" onclick="saveEditedSubtask(${index}, this)">Save</button>
    `;
}

function subtaskCompletedCheckbox(index, completed) {
    return `
        <input type="checkbox" id="subtask-completed-${index}" ${completed ? 'checked' : ''} />
    `;
}

/* save the editing Subtask */
async function saveEditedSubtask(index, buttonElement) {
    const taskId = buttonElement.getAttribute('data-task-id'); // Hole die Task ID vom Button
    if (!taskId) return console.error("Task ID fehlt!"); // Debugging
    console.log("Task ID:", taskId); // Debugging
    let editedInput = document.getElementById(`edit-subtask-${index}`);
    if (!editedInput) return console.error("Bearbeitungsfeld nicht gefunden!");
    let newText = editedInput.value.trim();
    if (newText === "") return console.warn("Leere Eingabe, nichts wird gespeichert.");
    let task = await fetchTaskFromFirebase(taskId);
    if (!task || !task.subtasks) return console.error("Task oder Subtasks nicht gefunden!");
    console.log("Generiere Subtasks für Task:", task); // Debugging-Ausgabe
    task.subtasks[index].text = newText;
    let subtaskContainer = document.getElementById(`subtask-container-${index}`);
    console.log(`Speichern der bearbeiteten Subtask: ${index}, Task ID: ${taskId}`);
    subtaskContainer.innerHTML = `
        <label id="subtask-${index}">${newText}</label>
        <div class="subtaskEditingContainer">
            <button onclick="toggleEditSubtask(${index}, '${taskId}')">
                <img src="../assets/svg/edit.svg" alt="">
            </button>
            <button onclick="deleteSubtask(${index}, '${taskId}')">
                <img src="../assets/svg/delete.svg" alt="">
            </button>
        </div>
    `;
    await updateSubtaskDB(task, taskId);
}

function toggleDeleteSubtask(task, index) {
    const subtask = task.subtasks[index];

}

async function fetchTaskFromFirebase(taskId) {
    console.log("Abruf der Task mit ID:", taskId); // Debugging-Ausgabe
    if (!taskId) {
        console.error("Fehler: Task ID ist undefined!");
        return null;
    }

    const response = await fetch(`${BASE_URL}tasks/${taskId}.json`);
    const taskData = await response.json();

    console.log("Erhaltene Task-Daten:", taskData); // Debugging

    if (!taskData) {
        console.error("Task nicht gefunden in Firebase!");
        return null;
    }

    return { id: taskId, ...taskData };
}


async function saveTask(taskId) {
    const task = globalTasks[taskId];
    if (!task) {
        console.error(`Task mit ID ${taskId} nicht gefunden.`);
        return;
    }

    try {
        const taskFromDB = await fetchTaskFromFirebase(taskId);
        const subtasksFromDB = taskFromDB ? taskFromDB.subtasks : task.subtasks;

        task.title = document.getElementById("editTitle")?.value || task.title;
        task.description = document.getElementById("editDescription")?.value || task.description;
        task.dueDate = document.getElementById("editDueDate")?.value || task.dueDate;
        
        // Aktualisiert die Priorität
        task.priority = document.getElementById("task-priority").dataset.priority || task.priority;

        // Holt die ausgewählten Kontakte
        task.assignedTo = Array.from(document.querySelectorAll('#selected-contacts .selected-contact'))
            .map(el => el.dataset.fullname);

        // Verhindert das Überschreiben der Subtasks
        task.subtasks = subtasksFromDB;

        console.log("Updated Task ohne Subtasks-Überschreibung:", task);

        if (taskId in globalTasks) {
            await updateTaskInDatabase(taskId, task);
        }

        displayTasks(globalTasks);
        closeTaskOverlay();
    } catch (error) {
        console.error("Fehler beim Speichern der Aufgabe:", error);
    }
}


// async function saveTask(taskId) {
//     const task = globalTasks[taskId];
//     if (!task) {
//         console.error(`Task mit ID ${taskId} nicht gefunden.`);
//         return;
//     }
//     try {
//         const taskFromDB = await fetchTaskFromFirebase(taskId);
//         const subtasksFromDB = taskFromDB ? taskFromDB.subtasks : task.subtasks;
//         const titleInput = document.getElementById("editTitle");
//         task.title = titleInput?.value || task.title;
//         const descriptionInput = document.getElementById("editDescription");
//         task.description = descriptionInput?.value || task.description;
//         const dueDateInput = document.getElementById("editDueDate");
//         task.dueDate = dueDateInput?.value || task.dueDate;
//         const priorityElement = document.getElementById("task-priority");
//         if (priorityElement) {
//             task.priority = priorityElement.getAttribute("data-priority") || task.priority;
//         }
//         const selectedContacts = Array.from(document.querySelectorAll('#selected-contacts .selected-contact'))
//             .map(el => el.dataset.fullname);
//         task.assignedTo = selectedContacts;
//         task.subtasks = subtasksFromDB;
//         console.log("Updated Task ohne Subtasks-Überschreibung:", task);
//         if (taskId in globalTasks) {
//             await updateTaskInDatabase(taskId, task);
//         }
//         displayTasks(globalTasks);
//         closeTaskOverlay();
//     } catch (error) {
//         console.error("Fehler beim Speichern der Aufgabe:", error);
//     }
// }

/* edited task update to database */
async function updateTaskInDatabase(taskId, task) {
    try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
            method: "PATCH",  // PATCH anstelle von PUT verwenden
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });

        if (response.ok) {
            console.log("Task erfolgreich aktualisiert:", taskId);
        } else {
            console.error("Fehler beim Aktualisieren des Tasks:", taskId);
        }
    } catch (error) {
        console.error("Fehler beim Speichern des Tasks in der Datenbank:", error);
    }
}

async function updateSubtaskDB(task, taskId) {
    if (!task || !taskId) return console.error("Task oder Task ID fehlen!");
    const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subtasks: task.subtasks
        }) // Nur die Subtasks aktualisieren
    });
    if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren des Subtasks: ${response.statusText}`);
    }
}