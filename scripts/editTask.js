let detailTask

// Funktion zur Normalisierung der Priorität
function normalizePriority(priority) {
    return priority ? priority.toLowerCase() : ''; // Konvertiert die Priorität in Kleinbuchstaben
}


function editTask(taskId) {
    console.log("Aufruf von editTask mit Task ID:", taskId);
    if (!taskId) {
        console.error("Fehler: taskId ist undefined oder null!");
        return;
    }
    let task = globalTasks[taskId];
    detailTask = task;
    if (!task) {
        console.error(`Task mit ID ${taskId} nicht gefunden.`);
        return;
    }
    console.log("Gefundene Task:", task);
    console.log("Subtasks:", task.subtasks);
    let overlayRef = document.querySelector(".openTaskOverlayMain");
    overlayRef.innerHTML = `
        <input id="editTitle" type="text" value="${task.title}">
        <textarea id="editDescription">${task.description}</textarea>
        ${taskEditDate(task)} <!-- Datumseingabe-Funktion -->
        ${taskEditPriority(task)} <!-- Priorität -->
        ${taskEditAssignedTo(task)} <!-- Zuständige Personen -->
        ${taskEditSubtasks(task, taskId)} <!-- Subtasks -->
        <button class="saveButtonOk" onclick="saveTask('${taskId}')">OK <img src="../assets/svg/add_task/check.svg" alt=""></button>
    `;
    applyActivePriorityButton(task.priority);
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
    initTaskEditAddSubtask(taskId);
}

function applyActivePriorityButton(priority) {
    let priorityButton = document.querySelector(`#task-priority .prio-btn[data-prio="${priority}"]`);
    if (priorityButton) {
        document.querySelectorAll("#task-priority .prio-btn").forEach(btn => btn.classList.remove("active"));
        priorityButton.classList.add("active");
    } else {
        console.log(`Kein Button mit der Priorität "${priority}" gefunden.`);
    }
}


function setupDateValidation() {
    setTimeout(() => {
        let dateInput = document.getElementById("editDueDate");
        let errorText = document.getElementById("dateError");
        if (!dateInput || !errorText) {
            console.error("Fehlendes Element: 'editDueDate' oder 'dateError'");
            return;
        }
        let today = new Date().toISOString().split("T")[0];
        let maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 100);
        let maxDateString = maxDate.toISOString().split("T")[0];
        dateInput.setAttribute("min", today);
        dateInput.setAttribute("max", maxDateString);
        dateInput.addEventListener("input", function () {
            if (!dateInput.value) return;
            let selectedDate = new Date(dateInput.value);
            let minDate = new Date(today);
            if (selectedDate < minDate) {
                dateInput.style.border = "2px solid red";
                errorText.textContent = "Das Datum darf nicht in der Vergangenheit liegen!";
                errorText.style.display = "block";
                setTimeout(() => {
                    dateInput.value = today;
                }, 500);
            } else {
                dateInput.style.border = "";
                errorText.style.display = "none";
            }
        });
    }, 100);
}


function taskEditAssignedTo(task, taskId) {
    let assignedContacts = task.assignedTo || [];
    let maxDisplay = 8;
    let displayedContacts = assignedContacts.slice(0, maxDisplay);
    
    const contactListHtml = createContactListHtml(assignedContacts);
    const selectedContactsHtml = createSelectedContactsHtml(displayedContacts);

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
                ${selectedContactsHtml}
            </div>
        </div>
    `;
}


function toggleEditTaskDropdown(event, toggle, options) {
    event.stopPropagation();
    if (options.classList.contains("visible")) {
        options.classList.remove("visible");
    } else {
        document.querySelectorAll(".dropdown-content.visible").forEach(dropdown => {
            dropdown.classList.remove("visible");
        });
        options.classList.add("visible");
    }
}

function toggleContactSelectionUI(container, contactName) {
    let checkbox = container.querySelector("input[type='checkbox']");
    let isSelected = checkbox.checked = !checkbox.checked;
    container.classList.toggle("selected", isSelected);
    let selectedContactsContainer = document.getElementById('selected-contacts');
    let task = detailTask;
    if (!task) {
        console.error("Fehler: Keine Task gefunden!");
        return;
    }
    if (isSelected) {
        if (!task.assignedTo.includes(contactName)) {
            task.assignedTo.push(contactName);
        }
    } else {
        task.assignedTo = task.assignedTo.filter(name => name !== contactName);
    }
    updateSelectedContactsUI();
}

function updateSelectedContactsUI() {
    let selectedContactsContainer = document.getElementById('selected-contacts');
    if (!selectedContactsContainer) return;

    selectedContactsContainer.innerHTML = detailTask.assignedTo.map(contactName => `
        <div class="selected-contact" data-fullname="${contactName}">
            <div class="initials-circle" style="background-color: ${getContactColor(contactName)}">
                ${getInitials(contactName)}
            </div>
        </div>
    `).join('');
}


function taskEditAddSubtask() {
    return taskEditAddSubtaskTemplate();
}



function initTaskEditAddSubtask(taskId) {
    const elements = getTaskEditElements();
    if (!elements) return;

    const { input, addBtn, clearBtn, list } = elements;
    setInputEvents(input, clearBtn);
    setButtonEvents(addBtn, input, list, taskId);
    setKeyboardEvent(input, list, taskId);
}

function getTaskEditElements() {
    const input = document.getElementById('newEditSubtask');
    const addBtn = document.getElementById('addEditSubtask');
    const clearBtn = document.getElementById('clearEditSubtask');
    const list = document.getElementById('addEditSubtaskNew');
    
    if (!input || !addBtn || !clearBtn || !list) {
        console.error("Einige Elemente für 'Add Subtask' wurden im DOM nicht gefunden.");
        return null;
    }
    return { input, addBtn, clearBtn, list };
}

function setInputEvents(input, clearBtn) {
    input.oninput = () => clearBtn.classList.toggle('d-none', !input.value.trim());
    clearBtn.onclick = () => { input.value = ''; clearBtn.classList.add('d-none'); };
}

function setButtonEvents(addBtn, input, list, taskId) {
    addBtn.onclick = () => addEditNewSubtask(input, list, taskId);
}

function setKeyboardEvent(input, list, taskId) {
    input.onkeydown = function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addEditNewSubtask(input, list, taskId);
        }
    };
}


function addEditNewSubtask(input, list, taskId) {
    let taskText = input.value.trim();
    if (!taskText || !taskId) return console.error("Fehler: Kein gültiger taskId oder leerer Text.");
    if (!globalTasks[taskId].subtasks) globalTasks[taskId].subtasks = [];
    const index = addSubtaskToModel(taskId, taskText);
    const subtaskElement = createEditSubtaskElement(taskText, index, taskId);
    list.appendChild(subtaskElement);
    input.value = '';
}

function addSubtaskToModel(taskId, taskText) {
    globalTasks[taskId].subtasks.push({ text: taskText, completed: false });
    return globalTasks[taskId].subtasks.length - 1;
}

function createEditSubtaskElement(taskText, index, taskId) {
    const subtaskElement = document.createElement('div');
    subtaskElement.classList.add('openEditTaskOverlaySubtask');
    subtaskElement.id = `subtask-container-${index}`;
    subtaskElement.appendChild(createSubtaskPoint(taskText, index));
    subtaskElement.onmouseenter = () => hoverSubtask(taskId, index);
    subtaskElement.onmouseleave = () => hoverOutSubtask(taskId, index);
    subtaskElement.appendChild(createEditingContainer(index, taskId));
    return subtaskElement;
}

function createSubtaskPoint(taskText, index) {
    const subtaskPoint = document.createElement('div');
    subtaskPoint.classList.add('editSubtaskPoint');
    subtaskPoint.innerHTML = `<p>•</p><label id="subtask-${index}">${taskText}</label>`;
    return subtaskPoint;
}


function hoverSubtask(taskId, index) {
    let task = globalTasks[taskId];
    if (!task || !task.subtasks || !task.subtasks[index]) {
        console.error(`Task oder Subtask nicht gefunden: ${taskId}, Index: ${index}`);
        return;
    }
    let subtaskElement = document.getElementById(`subtask-container-${index}`);
    if (subtaskElement) {
        subtaskElement.classList.add('hoverSubtask');
        if (!subtaskElement.querySelector('.subtaskEditingContainer')) {
            let subtaskEditingContainer = document.createElement('div');
            subtaskEditingContainer.classList.add('subtaskEditingContainer');
            subtaskEditingContainer.innerHTML = `
                <button onclick="toggleEditSubtask(${index}, '${taskId}')">
                    <img class="subtaskEditImg" src="../assets/svg/summary/pencil2.svg" alt="">    
                </button>
                <button onclick="deleteSubtask(${index}, '${taskId}')">
                    <img src="../assets/svg/add_task/trash.svg" alt="">
                </button>
            `;
            subtaskElement.appendChild(subtaskEditingContainer);
        }
    }
}


function hoverOutSubtask(taskId, index) {
    let subtaskElement = document.getElementById(`subtask-container-${index}`);
    if (subtaskElement) {
        subtaskElement.classList.remove('hoverSubtask');
        let editingContainer = subtaskElement.querySelector('.subtaskEditingContainer');
        if (editingContainer) {
            editingContainer.remove();
        }
    }
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

// function editSubtaskTemplate(index, text) {
//     return `
//         <div class="subtask-controls">
//             <img src="../assets/svg/summary/pencil2.svg" alt="Edit" class="subtask-edit">
//             <img src="../assets/svg/add_task/trash.svg" alt="Delete" class="subtask-trash">
//             <img src="../assets/svg/add_task/check_create_task.svg" alt="Save" class="subtask-check d-none">
//         </div>`;
// }

function subtaskCompletedCheckbox(index, completed) {
    return `
        <input type="checkbox" id="subtask-completed-${index}" ${completed ? 'checked' : ''} />
    `;
}

/* save the editing Subtask */
async function saveEditedSubtask(index, buttonElement) {
    let taskId = buttonElement.getAttribute('data-task-id'); // Hole die Task ID vom Button
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
    let subtask = task.subtasks[index];

}

async function fetchTaskFromFirebase(taskId) {
    console.log("Abruf der Task mit ID:", taskId); // Debugging-Ausgabe
    if (!taskId) {
        console.error("Fehler: Task ID ist undefined!");
        return null;
    }
    let response = await fetch(`${BASE_URL}tasks/${taskId}.json`);
    let taskData = await response.json();
    console.log("Erhaltene Task-Daten:", taskData); // Debugging
    if (!taskData) {
        console.error("Task nicht gefunden in Firebase!");
        return null;
    }
    return { id: taskId, ...taskData };
}




async function saveTask(taskId) {
    let task = globalTasks[taskId];
    if (!task) {
        console.error(`Task mit ID ${taskId} nicht gefunden.`);
        return;
    }
    try {
        let taskFromDB = await fetchTaskFromFirebase(taskId);
        let subtasksFromDB = taskFromDB ? taskFromDB.subtasks : task.subtasks;
        task.title = document.getElementById("editTitle")?.value || task.title;
        task.description = document.getElementById("editDescription")?.value || task.description;
        task.dueDate = document.getElementById("editDueDate")?.value || task.dueDate;
        task.priority = document.getElementById("task-priority").dataset.priority || task.priority;
        task.assignedTo = Array.from(document.querySelectorAll('#selected-contacts .selected-contact'))
            .map(el => el.dataset.fullname);
        if (!task.assignedTo) {
            task.assignedTo = [];
        }
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

/* edited task update to database */
async function updateTaskInDatabase(taskId, task) {
    try {
        let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
            method: "PATCH",
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
    let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subtasks: task.subtasks
        })
    });
    if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren des Subtasks: ${response.statusText}`);
    }
}