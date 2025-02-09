let detailTask

/* Normalizes the given priority string to lowercase. */
function normalizePriority(priority) {
    return priority ? priority.toLowerCase() : '';
}

/* Opens the task overlay and populates it with the task details for editing. */
function editTask(taskId) {
    if (!taskId) return console.error("Fehler: taskId ist undefined oder null!");
    let task = globalTasks[taskId];
    if (!task) return console.error(`Task mit ID ${taskId} nicht gefunden.`);
    detailTask = task;
    let overlayRef = document.querySelector(".openTaskOverlayMain");
    overlayRef.innerHTML = taskEditTemplate(task, taskId);
    document.querySelectorAll('.selected-contacts').forEach(e => e.style.position = 'static');
    applyActivePriorityButton(task.priority);
    document.querySelectorAll("#task-priority .prio-btn").forEach(button => {
        button.onclick = function () {
            document.querySelectorAll("#task-priority .prio-btn").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            document.getElementById("task-priority").setAttribute("data-priority", button.getAttribute("data-prio"));
        };
    });
    setupDateValidation();
    initTaskEditAddSubtask(taskId);
}

/* Activates the priority button corresponding to the given priority.*/
function applyActivePriorityButton(priority) {
    let priorityButton = document.querySelector(`#task-priority .prio-btn[data-prio="${priority}"]`);
    if (priorityButton) {
        document.querySelectorAll("#task-priority .prio-btn").forEach(btn => btn.classList.remove("active"));
        priorityButton.classList.add("active");
    }
}

/* Sets up the date validation for the task edit overlay.
 * After a short delay, sets the minimum date to today and adds an event listener to the date input.
 * If the user selects a date in the past, shows an error message and if the date is valid, hides the error message.*/
function setupDateValidation() {
    setTimeout(() => {
        let dateInput = document.getElementById("editDueDate"),
            errorText = document.getElementById("dateError");
        if (!dateInput || !errorText) return console.error("Fehlendes Element!");
        let today = new Date().toISOString().split("T")[0];
        dateInput.min = today;
        dateInput.addEventListener("input", () => {
            let selectedDate = new Date(dateInput.value);
            if (selectedDate < new Date(today)) showDateError(dateInput, errorText, today);
            else hideDateError(dateInput, errorText);
        });
    }, 100);
}

/* Shows a date error message. */
function showDateError(input, error, today) {
    input.style.border = "2px solid red";
    error.textContent = "Das Datum darf nicht in der Vergangenheit liegen!";
    error.style.display = "block";
    setTimeout(() => input.value = today, 500);
}

/* Hides a date error message */
function hideDateError(input, error) {
    input.style.border = "";
    error.style.display = "none";
}

/* Generates the HTML for the assigned contacts dropdown in the task edit overlay. */
function taskEditAssignedTo(task, taskId) {
    let assignedContacts = task.assignedTo || [];
    let maxDisplay = 8;
    let displayedContacts = assignedContacts.slice(0, maxDisplay);
    return getTaskAssignedHTML(assignedContacts, displayedContacts);
}

/* Toggles the visibility of the edit task dropdown menu.
 * Closes any other open dropdowns and prevents event bubbling. */
function toggleEditTaskDropdown(event, toggle, options) {
    event.stopPropagation();
    if (options.classList.contains("visible")) {
        options.classList.remove("visible");
    } else {
        document.querySelectorAll(".dropdown-content-edit.visible").forEach(dropdown => {
            dropdown.classList.remove("visible");
        });
        options.classList.add("visible");
    }
}

/* Toggles the selection of a contact in the edit task overlay. */
function toggleContactSelectionUI(container, contactName) {
    let checkbox = container.querySelector("input[type='checkbox']");
    let isSelected = checkbox.checked = !checkbox.checked;
    container.classList.toggle("selected", isSelected);
    let selectedContactsContainer = document.getElementById('selected-contacts');
    let task = detailTask;
    if (!task) return console.error("Fehler: Keine Task gefunden!");
    if (isSelected) {
        if (!task.assignedTo.includes(contactName)) task.assignedTo.push(contactName);
    } else {
        task.assignedTo = task.assignedTo.filter(name => name !== contactName);
    }
    updateSelectedContactsUI();
}

/* Updates the list of selected contacts in the task edit overlay.
 * Uses the detailTask.assignedTo array to generate the HTML for the selected contacts. */
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

/* Returns the HTML template for the add subtask input field.
 * This function is used by the task edit overlay. */
function taskEditAddSubtask() {
    return taskEditAddSubtaskTemplate();
}

/* Initializes the 'Add Subtask' elements in the task edit overlay.
 * Retrieves the HTML elements, sets input and button events and a keyboard event. */
function initTaskEditAddSubtask(taskId) {
    let elements = getTaskEditElements();
    if (!elements) return;
    let { input, addBtn, clearBtn, list } = elements;
    setInputEvents(input, clearBtn);
    setButtonEvents(addBtn, input, list, taskId);
    setKeyboardEvent(input, list, taskId);
}

/* Retrieves the HTML elements for the 'Add Subtask' input field, add button, clear button and the list of subtasks in the task edit overlay. */
function getTaskEditElements() {
    let input = document.getElementById('newEditSubtask');
    let addBtn = document.getElementById('addEditSubtask');
    let clearBtn = document.getElementById('clearEditSubtask');
    let list = document.getElementById('addEditSubtaskNew');
    if (!input || !addBtn || !clearBtn || !list) {
        console.error("Einige Elemente für 'Add Subtask' wurden im DOM nicht gefunden.");
        return null;
    }
    return { input, addBtn, clearBtn, list };
}

/**
 * Sets event listeners for the 'Add Subtask' input field and clear button in the task edit overlay.
 * Listens for input events on the input field and sets the visibility of the clear button based on the input field's value.
 * Listens for click events on the clear button and clears the input field if the button is clicked.
 */
function setInputEvents(input, clearBtn) {
    input.oninput = () => clearBtn.classList.toggle('d-none', !input.value.trim());
    clearBtn.onclick = () => { input.value = ''; clearBtn.classList.add('d-none'); };
}

/**
 * Sets the event listener for the 'Add Subtask' button in the task edit overlay.
 * Listens for click events on the button and calls the addEditNewSubtask function if the button is clicked.
 */
function setButtonEvents(addBtn, input, list, taskId) {
    addBtn.onclick = () => addEditNewSubtask(input, list, taskId);
}

/**
 * Sets a keyboard event listener for the 'Add Subtask' input field in the task edit overlay.
 * Listens for the Enter key and calls the addEditNewSubtask function if it is pressed.
 */
function setKeyboardEvent(input, list, taskId) {
    input.onkeydown = function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addEditNewSubtask(input, list, taskId);
        }
    };
}

/* Adds a new subtask to the task edit overlay. */
function addEditNewSubtask(input, list, taskId) {
    let taskText = input.value.trim();
    if (!taskText || !taskId) return console.error("Fehler: Kein gültiger taskId oder leerer Text.");
    if (!globalTasks[taskId].subtasks) globalTasks[taskId].subtasks = [];
    const index = addSubtaskToModel(taskId, taskText);
    const subtaskElement = createEditSubtaskElement(taskText, index, taskId);
    list.appendChild(subtaskElement);
    input.value = '';
}

/* Adds a new subtask to the task model with the given taskId and taskText. */
function addSubtaskToModel(taskId, taskText) {
    globalTasks[taskId].subtasks.push({ text: taskText, completed: false });
    return globalTasks[taskId].subtasks.length - 1;
}

/* Creates a subtask element for the task edit overlay. */
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

/* Creates a div element with the point and the label for a subtask in the task edit overlay. */
function createSubtaskPoint(taskText, index) {
    const subtaskPoint = document.createElement('div');
    subtaskPoint.classList.add('editSubtaskPoint');
    subtaskPoint.innerHTML = `<p>•</p><label id="subtask-${index}">${taskText}</label>`;
    return subtaskPoint;
}

/**
 * Adds the hoverSubtask class to the subtask element with the given index if it exists in the task with the given taskId.
 * If the subtask element does not have a .subtaskEditingContainer child, creates it and appends it to the subtask element.
 */
function hoverSubtask(taskId, index) {
    let task = globalTasks[taskId];
    if (!task || !task.subtasks || !task.subtasks[index]) return;
    let subtaskElement = document.getElementById(`subtask-container-${index}`);
    if (subtaskElement) {
        subtaskElement.classList.add('hoverSubtask');
        if (!subtaskElement.querySelector('.subtaskEditingContainer')) {
            let subtaskEditingContainer = document.createElement('div');
            subtaskEditingContainer.classList.add('subtaskEditingContainer');
            subtaskEditingContainer.innerHTML = `
                <button onclick="toggleEditSubtask(${index}, '${taskId}')">
                    <img id="subtaskEditIcon" class="subtaskEditImg" src="../assets/svg/summary/pencil2.svg" alt="">    
                </button>
                <button onclick="deleteEditSubtask(${index}, '${taskId}')">
                    <img id="subtaskDeleteIcon" src="../assets/svg/add_task/trash.svg" alt="">
                </button>
            `;
            subtaskElement.appendChild(subtaskEditingContainer);
        }
    }
}

/**
 * Removes the 'hoverSubtask' class from the subtask element with the given index if it exists in the task with the given taskId.
 * Removes the .subtaskEditingContainer child from the subtask element if it exists.
 */
function hoverOutSubtask(taskId, index) {
    let subtaskElement = document.getElementById(`subtask-container-${index}`);
    if (subtaskElement) {
        subtaskElement.classList.remove('hoverSubtask');
        let editingContainer = subtaskElement.querySelector('.subtaskEditingContainer');
        if (editingContainer) editingContainer.remove();
    }
}

/**
 * Toggles the edit mode of the subtask with the given index in the task with the given taskId.
 * If the subtask is not in edit mode, it enters edit mode. If it is in edit mode, it leaves edit mode.
 */
function toggleEditSubtask(index, taskId) {
    let subtaskContainer = document.getElementById(`subtask-container-${index}`);
    let subtaskLabel = document.getElementById(`subtask-${index}`);
    if (!subtaskContainer || !subtaskLabel) return console.error("Subtask-Element nicht gefunden!");
    let currentText = subtaskLabel.innerText;
    document.getElementById("subtaskDeleteIcon")?.classList.add("d-none");
    document.getElementById("subtaskEditIcon")?.classList.add("d-none");
    subtaskContainer.classList.remove('hoverSubtask');
    subtaskContainer.onmouseenter = subtaskContainer.onmouseleave = null;
    subtaskContainer.querySelector('.subtaskEditingContainer')?.remove();
    subtaskContainer.innerHTML = getEditSubtaskHTML(index, currentText, taskId);
}

/**
 * Saves the changes made to the subtask with the given index in the task with the given taskId,
 * and leaves the subtask in edit mode.
 */
function saveEditStaySubtask(index, taskId) {
    let editedInput = document.getElementById(`edit-subtask-${index}`);
    let newText = editedInput.value.trim();
    let task = globalTasks[taskId];
    if (task && task.subtasks && task.subtasks[index]) task.subtasks[index].text = newText;
    let subtaskContainer = document.getElementById(`subtask-container-${index}`);
    if (subtaskContainer) {
        subtaskContainer.innerHTML = `
            <div class="editSubtaskPoint">
                <p>•</p><label id="subtask-${index}">${newText}</label>
            </div>
            <div class="subtaskEditingContainer">
                <button onclick="toggleEditSubtask(${index}, '${taskId}')">
                    <img id="subtaskEditIcon" class="subtaskEditImg" src="../assets/svg/summary/pencil2.svg" alt="">
                </button>
                <button onclick="deleteEditSubtask(${index}, '${taskId}')">
                    <img id="subtaskDeleteIcon" src="../assets/svg/add_task/trash.svg" alt="">
                </button>
            </div>
        `;
    }
}

/**
 * Returns the HTML for a subtask completion checkbox.
 */
function subtaskCompletedCheckbox(index, completed) {
    return `
        <input type="checkbox" id="subtask-completed-${index}" ${completed ? 'checked' : ''} />
    `;
}

/**
 * Saves the edited text of a subtask and updates it in the database.
 * Retrieves the taskId from the button element and the new text from the input field.
 * Fetches the task from Firebase, updates the subtask text, and modifies the DOM
 * to reflect the changes. Finally, updates the subtask in the database.
 */
async function saveEditedSubtask(index, buttonElement) {
    let taskId = buttonElement.getAttribute('data-task-id');
    let editedInput = document.getElementById(`edit-subtask-${index}`);
    if (!editedInput) return console.error("Bearbeitungsfeld nicht gefunden!");
    let newText = editedInput.value.trim();
    let task = await fetchTaskFromFirebase(taskId);
    if (!task || !task.subtasks) return console.error("Task oder Subtasks nicht gefunden!");
    task.subtasks[index].text = newText;
    let subtaskContainer = document.getElementById(`subtask-container-${index}`);
    subtaskContainer.innerHTML = getSubtaskHTML(index, newText, taskId);
    await updateSubtaskDB(task, taskId);
}

/**
 * Deletes the subtask with the given index from the task with the given taskId.
 * Retrieves the task from the globalTasks object, removes the subtask from the task's subtask array,
 * removes the subtask element from the DOM, and updates the subtask in the database.
 */
function deleteEditSubtask(index, taskId) {
    let task = globalTasks[taskId];
    if (!task || !task.subtasks) return console.error("Task oder Subtasks nicht gefunden!");
    task.subtasks.splice(index, 1);
    let subtaskContainer = document.getElementById(`subtask-container-${index}`);
    subtaskContainer.remove();
    updateSubtaskDB(task, taskId);
}

/**
 * Fetches a task from Firebase using the provided taskId.
 * If the taskId is undefined or the task is not found in Firebase, logs an error
 * and returns null. Otherwise, returns the task data along with its ID.
 */
async function fetchTaskFromFirebase(taskId) {
    if (!taskId) {
        console.error("Fehler: Task ID ist undefined!");
        return null;
    }
    let response = await fetch(`${BASE_URL}tasks/${taskId}.json`);
    let taskData = await response.json();
    if (!taskData) {
        console.error("Task nicht gefunden in Firebase!");
        return null;
    }
    return { id: taskId, ...taskData };
}

/**
 * Saves the changes made to the task with the given taskId.
 * Retrieves the task from the globalTasks object, updates the task's properties
 * with the values from the task edit overlay, and updates the task in the database.
 * If the task ID is not found in globalTasks, logs an error and returns.
 * If there is an error saving the task, logs the error.
 * If the task is saved successfully, updates the task list display and closes the task overlay.
 */
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
        if (!task.assignedTo) task.assignedTo = [];
        subtasksFromDB;
        if (taskId in globalTasks) await updateTaskInDatabase(taskId, task);
        displayTasks(globalTasks);
        closeTaskOverlay();
    } catch (error) {
        console.error("Fehler beim Speichern der Aufgabe:", error);
    }
}

/* Updates the task with the given taskId in the Firebase database. */
async function updateTaskInDatabase(taskId, task) {
    try {
        let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });
    } catch (error) {
        console.error("Fehler beim Speichern des Tasks in der Datenbank:", error);
    }
}

/* Updates the subtasks of the task with the given taskId in the Firebase database. */
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