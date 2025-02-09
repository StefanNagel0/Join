/* Generates the HTML template for the title field in the task edit overlay. */
function taskEditTitle(task) {
    return `
    <div class="openEditTaskOverlayTitle">
        <label for="editTitle">Title</label>
        <input id="editTitle" type="text" maxlength="30" value="${task.title}" />
    </div>
    `;
}

/**
 * Generates the HTML template for editing a task's description.
 * This function returns a div container with a label and a textarea
 * for the description. The description is set to the description of the
 * task passed as a parameter.
 */
function taskEditDescription(task) {
    return `
    <div class="openEditTaskOverlayDescription">
        <label for="editDescription">Description</label>
        <textarea class="" maxlength="150" id="editDescription">${task.description}</textarea>
    </div>
    `;
}

/**
 * Generates the HTML template for editing a task's due date.
 * The function sets the minimum date to today and the maximum date to 100 years from now.
 * It includes an input field for date selection and a small error message for invalid date selections.
 */
function taskEditDate(task) {
    let today = new Date().toISOString().split("T")[0];
    let maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 100);
    let maxDateString = maxDate.toISOString().split("T")[0];
    return `
    <div class="openEditTaskOverlayDueDate">
        <label for="editDueDate">Due Date</label>
        <input 
            type="date" 
            class="duoDateColor"
            id="editDueDate" 
            value="${task.dueDate}" 
            min="${today}" 
            max="${maxDateString}" 
        />
        <small id="dateError" style="color: red; display: none;">
            Datum muss zwischen heute und 100 Jahre in der Zukunft liegen
        </small>
    </div>
    `;
}

/* Generates the HTML template for editing a task's priority. */
function taskEditPriority(task) {
    return `
        <div class="gap_8">
            <p class="prioHeadline">Priority</p>
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

/* Generates HTML for a list of contacts that can be assigned to a task. */
function createContactListHtml(assignedContacts) {
    return contacts.map(contact => {
        const isSelected = assignedContacts.includes(contact.name);
        return `
            <div class="contact-item ${isSelected ? 'selected' : ''}" data-fullname="${contact.name}" onclick="toggleContactSelectionUI(this, '${contact.name}')">
                <div class="contact-circle-label">
                    <div class="initials-circle" style="background-color: ${getContactColor(contact.name)}">
                        ${getInitials(contact.name)}
                    </div>
                    <span class="contact-label">${contact.name}</span>
                </div>
                <input class="checkbox" type="checkbox" ${isSelected ? 'checked' : ''} />
            </div>
        `;
    }).join("");
}

/**
 * Generates the HTML for the displayed selected contacts in the task edit
 * template. The contacts are displayed as a list of divs with an initial circle
 * and a delete button.
 */
function createSelectedContactsHtml(displayedContacts) {
    return displayedContacts.map(contactName => `
        <div class="selected-contact" data-fullname="${contactName}">
            <div class="initials-circle" style="background-color: ${getContactColor(contactName)}">
                ${getInitials(contactName)}
            </div>
        </div>
    `).join('');
}

/**
 * Creates a container element with edit and delete buttons for a subtask
 * with the given index and taskId.
 */
function createEditingContainer(index, taskId) {
    const container = document.createElement('div');
    container.classList.add('subtaskEditingContainer');
    container.innerHTML = `
        <button onclick="toggleEditSubtask(${index}, '${taskId}')">
            <img class="subtaskEditImg" src="../assets/svg/summary/pencil2.svg" alt="">
        </button>
        <button onclick="deleteEditSubtask(${index}, '${taskId}')">
            <img src="../assets/svg/add_task/trash.svg" alt="">
        </button>
    `;
    return container;
}

/**
 * Generates the HTML template for the subtask adder in the task edit overlay.
 * This includes the input field, the clear button, the add button, and the JavaScript
 * initialization for the adder.
 */
function taskEditAddSubtaskTemplate(task, taskId) {
    return `
        <div class="openEditAddSubtask" id="subtask-container-edit">
            <input class="openEditAddSubtaskInput" maxlength="20" type="text" id="newEditSubtask" placeholder="Add new subtask">
            <img id="clearEditSubtask" class="d-none" src="../assets/svg/add_task/closeXSymbol.svg" alt="">
            <img id="addEditSubtask" src="../assets/svg/add_task/add+symbol.svg" alt="">
        </div>
        <script>
            initTaskEditAddSubtask('${taskId}');
        </script>
    `;
}

/**
 * Generates the HTML template for the subtasks of a task in the task edit overlay.
 * If the task has no subtasks, an empty string is returned.
 */
function taskEditSubtasks(task, taskId) {
    if (!task || !task.subtasks) return '';
    let subtasksHtml = task.subtasks.map((subtask, index, task) => {
        return `
            <div class="openEditTaskOverlaySubtask" id="subtask-container-${index}" onmouseenter="hoverSubtask('${taskId}', ${index})" onmouseleave="hoverOutSubtask('${taskId}', ${index})">
                <div class="editSubtaskPoint"><p>• </p><label id="subtask-${index}">${subtask.text}</label></div>
            </div>
        `;
    }).join("");
    return `
        <div id="addEditSubtaskNew" class="openTaskOverlaySubtaskContainer">
            <p class="openTaskOverlayEditSubtaskTitle">Subtasks</p>
            ${taskEditAddSubtaskTemplate(task, taskId)}
            ${subtasksHtml}
        </div>
    `;
}

/**
 * Returns the HTML for a subtask, given its index, the text of the subtask, and the ID of the task it belongs to.
 * The returned HTML includes a label with the subtask text and a container with two buttons: one to toggle the edit mode
 * and one to delete the subtask.
 */
function getSubtaskHTML(index, newText, taskId) {
    return `
        <label id="subtask-${index}">${newText}</label>
        <div class="subtaskEditingContainer">
            <button onclick="toggleEditSubtask(${index}, '${taskId}')">
                <img src="../assets/svg/edit.svg" alt="">
            </button>
            <button onclick="deleteEditSubtask(${index}, '${taskId}')">
                <img src="../assets/svg/delete.svg" alt="">
            </button>
        </div>
    `;
}

/* Returns the HTML for a subtask element in edit mode. */
function getEditSubtaskHTML(index, currentText, taskId) {
    return `
        <div class="subtaskEditingMainContainer">
            <input class="subtaskEditingInput" type="text" id="edit-subtask-${index}" value="${currentText}" />
            <div class="subtaskEditingImgMain">
                <button class="subtaskEditReImg" onclick="deleteEditSubtask(${index}, '${taskId}')">
                    <img src="../assets/svg/deletenew.svg" alt="">
                </button>
                <button class="subtaskEditReImg2" onclick="saveEditStaySubtask(${index}, '${taskId}')">
                    <img src="../assets/svg/add_task/check_create_task.svg" alt="">    
                </button>
            </div>
        </div>`;
}

/* Generates the HTML for the assigned contacts dropdown in the task edit overlay. */
function getTaskAssignedHTML(assignedContacts, displayedContacts) {
    return `
        <div id="task-assigned" class="dropdown-wrapper">
            <div class="dropdown-toggle" onclick="toggleEditTaskDropdown(event, this, document.querySelector('.dropdown-content-edit'))">
                <span>Select contacts to assign</span>
                <span class="dropdown-arrow"></span>
            </div>
            <div class="dropdown-content-edit">
                ${createContactListHtml(assignedContacts)}
            </div>
            <div id="selected-contacts" class="selected-contacts">
                ${createSelectedContactsHtml(displayedContacts)}
            </div>
        </div>
    `;
}