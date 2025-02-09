function taskEditTitle(task) {
    return `
    <div class="openEditTaskOverlayTitle">
        <label for="editTitle">Title</label>
        <input id="editTitle" type="text" maxlength="30" value="${task.title}" />
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

function createSelectedContactsHtml(displayedContacts) {
    return displayedContacts.map(contactName => `
        <div class="selected-contact" data-fullname="${contactName}">
            <div class="initials-circle" style="background-color: ${getContactColor(contactName)}">
                ${getInitials(contactName)}
            </div>
        </div>
    `).join('');
}

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