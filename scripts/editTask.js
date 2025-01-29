// FUNKTIONEN HIER EINFÜGEN!

function editTask(taskId) {
    const task = globalTasks[taskId];
    if (!task) {
        console.error(`Task mit ID ${taskId} nicht gefunden.`);
        return;
    }

    // Lade das Overlay mit den bearbeitbaren Feldern
    const overlayRef = document.querySelector(".openTaskOverlayMain");
    overlayRef.innerHTML = `
        <input id="editTitle" type="text" value="${task.title}">
        <textarea id="editDescription">${task.description}</textarea>
        <input id="editDueDate" type="date" value="${task.dueDate}">
        ${taskEditPriority(task)} <!-- Füge Priorität hinzu -->
        ${taskEditAssignedTo(task)} <!-- Füge Assigned to hinzu -->
        ${taskEditSubtasks(task)} <!-- Füge Subtasks hinzu -->
        <button onclick="saveTask('${taskId}')">OK</button>
    `;

    // Füge Logik hinzu, um Priorität durch Klick zu ändern (ohne EventListener)
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
}


// /* editing the task */
// function editTask(taskId) {
//     const task = globalTasks[taskId];
//     if (!task) {
//         console.error(`Task mit ID ${taskId} nicht gefunden.`);
//         return;
//     }
//     // const optionsHtml = editingPriority(task);
//     // const assignedOptionsHtml = taskAssignedEdit(task);
//     const overlayRef = document.querySelector(".openTaskOverlayMain");
//     overlayRef.innerHTML = taskEditTemplate(task, taskId);
// }

function taskEditTitle(task) {
    return `
    <div class="openEditTaskOverlayTitle">
        <label for="editTitle">Title</label>
        <input id="editTitle" type="text" value="${task.title}" />
    </div>
    `;
}


// function taskEditTitle(task, taskId) {
//     let taskTitle = document.getElementById('taskTitleID');
//     taskTitle.value = task.title;
//     return `
//     <div class="openEditTaskOverlayTitle">
//             <label for="editTitle">Title</label>
//             <input id="editTitle" type="text" value="${task.title}" />
//         </div>
//         `;
// }

function taskEditDescription(task) {
    return `
    <div class="openEditTaskOverlayDescription">
        <label for="editDescription">Description</label>
        <textarea maxlength="150" id="editDescription">${task.description}</textarea>
    </div>
    `;
}

// function taskEditDescription(task, taskId) {
//     let taskBeschreibung = document.getElementById('taskDescriptionID');
//     taskBeschreibung.value = task.beschreibung;
//     return `
//     <div class="openEditTaskOverlayDescription">
//             <label for="editDescription">Description</label>
//             <textarea maxlength="150" id="editDescription">${task.description}</textarea>
//         </div>
//         `;
// }

function taskEditDate(task) {
    return `
    <div class="openEditTaskOverlayDueDate">
        <label for="editDueDate">Due Date</label>
        <input type="date" id="editDueDate" value="${task.dueDate}" />
    </div>
    `;
}


// function taskEditDate(task, taskId) {
//     let taskDate = document.getElementById('taskDateID');
//     taskDate.value = task.date;
//     return `
//     <div class="openEditTaskOverlayDueDate">
//             <label for="editDueDate">Due Date</label>
//             <input type="date" id="editDueDate" value="${task.dueDate}" />
//         </div>
//         `;
// }

function taskEditPriority(task) {
    // Überprüfe die aktuelle Priorität und füge eine aktive Klasse hinzu
    const priorityButtons = `
        <button type="button" class="prio-btn urgent ${task.priority === 'Urgent' ? 'active' : ''}" data-prio="Urgent">
            Urgent <img src="../assets/svg/add_task/prio_urgent.svg" alt="">
        </button>
        <button type="button" class="prio-btn medium ${task.priority === 'Medium' ? 'active' : ''}" data-prio="Medium">
            Medium <img src="../assets/svg/add_task/prio_medium.svg" alt="">
        </button>
        <button type="button" class="prio-btn low ${task.priority === 'Low' ? 'active' : ''}" data-prio="Low">
            Low <img src="../assets/svg/add_task/prio_low.svg" alt="">
        </button>
    `;

    // Enthält die Buttons und ein `data-priority`-Attribut, um die aktuelle Auswahl zu speichern
    return `
        <div class="gap_8">
            <p class="prio_text">Prio</p>
            <div id="task-priority" data-priority="${task.priority}">
                ${priorityButtons}
            </div>
        </div>
    `;
}

// function taskEditPriority(task, taskId) {
//     let taskPriority = document.getElementById('taskPriorityIDName');
//     taskPriority.value = task.priority;
//     return `
//             <div class="gap_8">
//                 <p class="prio_text">Prio</p>
//                 <div id="task-priority">
//                     <button type="button" class="prio-btn urgent" data-prio="urgent">Urgent <img
//                         src="../assets/svg/add_task/prio_urgent.svg" alt=""></button>
//                     <button type="button" class="prio-btn medium" data-prio="medium">Medium <img
//                         src="../assets/svg/add_task/prio_medium.svg" alt=""></button>
//                     <button type="button" class="prio-btn low" data-prio="low">Low <img
//                         src="../assets/svg/add_task/prio_low.svg" alt=""></button>
//                     </div>
//                 </div>
//         `;
// }


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

// function taskEditAssignedTo(task) {
//     const assignedContacts = task.assignedTo || []; // Bereits zugewiesene Kontakte
//     const contactListHtml = contacts.map(contact => {
//         const isSelected = assignedContacts.includes(contact.name);
//         return `
//             <div class="contact-item ${isSelected ? 'selected' : ''}" data-fullname="${contact.name}" onclick="toggleContactSelectionUI(this, '${contact.name}')">
//                 <div class="contact-circle-label">
//                     <div class="initials-circle" style="background-color: ${getContactColor(contact.name)}">
//                         ${getInitials(contact.name)}
//                     </div>
//                     <span class="contact-label">${contact.name}</span>
//                 </div>
//                 <input type="checkbox" ${isSelected ? 'checked' : ''} />
//             </div>
//         `;
//     }).join("");
//     return `
//         <div id="task-assigned" class="dropdown-wrapper">
//                 <div class="dropdown-toggle" onclick="toggleEditTaskDropdown(event, this, document.querySelector('.dropdown-content'))">
//                 <span>Select contacts to assign</span>
//                 <span class="dropdown-arrow"></span>
//             </div>
//             <div class="dropdown-content">
//                 ${contactListHtml}
//             </div>
//             <div id="selected-contacts" class="selected-contacts">
//                 ${assignedContacts.map(contactName => `
//                     <div class="selected-contact" data-fullname="${contactName}">
//                         <div class="initials-circle" style="background-color: ${getContactColor(contactName)}">
//                             ${getInitials(contactName)}
//                         </div>
//                     </div>
//                 `).join('')}
//             </div>
//         </div>
//     `;
// }

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


// function taskEditAssignedTo(task, taskId) {
//     let taskAssignedTo = document.getElementById('taskAssignedID');
//     taskAssignedTo.value = task.assignedTo;
//     return `
//     <label for="editAssigned">Assigned to</label>
//     <div id="editAssigned" style="border: 1px solid #ccc; padding: 10px;"></div>
//         `;
// }

function taskEditSubtasks(task) {
    if (task.subtasks && task.subtasks.length > 0) {
        const subtasksHtml = task.subtasks.map((subtask, index) => `
        <div class="openEditTaskOverlaySubtask" id="subtask-container-${index}">
            <label id="subtask-${index}">${subtask.text}</label>
            <div class="subtaskEditingContainer">
           <button><img src="../assets/svg/edit.svg" alt="" onclick="toggleEditSubtask(${task}, ${index}, ${subtask})"></button>
           <button><img src="../assets/svg/delete.svg" alt="" onclick="deleteSubtask(${task}, ${index}, ${subtask})"></button>
            </div>
        </div>
        `).join("");

        return `
        <div class="openTaskOverlaySubtaskContainer">
            <p class="openTaskOverlaySubtaskTitle">Subtasks</p>
            ${subtasksHtml}
        </div>
        `;
    } else {
        // Fallback für Tasks ohne Unteraufgaben
        return `
        <div class="openTaskOverlaySubtaskContainer">
            <p class="openTaskOverlaySubtaskTitle">Subtasks</p>
            <p>No subtasks available</p>
        </div>
        `;
    }
}

//<input type="checkbox" id="subtask-completed-${index}" ${subtask.completed ? "checked" : ""} />}
function toggleEditSubtask(task, index, subtask) {
    for (let i = 0; i < task.subtasks.length; i++) {
        let subtaskEdit = task.subtasks[i];
        return `
    <input type="text" id="subtask-${i}" value="${subtaskEdit}" />
    `
    }
}

function toggleDeleteSubtask(task, index) {
    const subtask = task.subtasks[index];

}


// function taskEditSubtasks(task, taskId, subtask, index) {
//     if (task.subtasks && task.subtasks.length > 0) {
//         const subtasksHtml = task.subtasks.map((subtask, index) => `
//         <p id="taskSubtasksID-${index}" class="openTaskOverlaySubtask">
//             <input title="Toggle Subtask" type="checkbox" id="subtask-${taskId}-${index}" onclick="toggleSubtask(${index}, '${taskId}')" ${subtask.completed ? 'checked' : ''} required/> ${subtask.name}
//         </p>
//     `).join("");
//         return `
//     <div class="openTaskOverlaySubtaskContainer">
//     <p class="openTaskOverlaySubtaskTitle">Subtasks</p>
//         ${subtasksHtml}
//     </div>
//     `;
//     } else {
//         return ``;
//     }
// }

// function taskEditSubtasks(task, taskId, subtask, index) {
//     let taskSubtasks = document.getElementById("subtask-${taskId}-${index}");
//     taskSubtasks.value = task.subtasks;
//     return `
//     <label for="editSubtasks">Subtasks</label>
//     <div id="subtask-container">
//     <input maxlength="20" type="text" id="new-subtask" placeholder="Add new subtask">
//     <img id="clear-subtask" class="d-none" src="../assets/svg/add_task/closeXSymbol.svg" alt="">
//     <img id="add-subtask" src="../assets/svg/add_task/add+symbol.svg" alt="">
//         `;
// }