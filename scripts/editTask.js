// FUNKTIONEN HIER EINFÜGEN!

function taskEditTitel(task, taskId) {
    let taskTitel = document.getElementById('taskTitel');
    taskTitel.value = task.titel;
    return `
    <div class="openEditTaskOverlayTitle">
            <label for="editTitle">Title</label>
            <input id="editTitle" type="text" value="${task.title}" />
        </div>
        `;
}

function taskEditDescription(task, taskId) {
    let taskBeschreibung = document.getElementById('taskBeschreibung');
    taskBeschreibung.value = task.beschreibung;
    return `
    <div class="openEditTaskOverlayDescription">
            <label for="editDescription">Description</label>
            <textarea maxlength="150" id="editDescription">${task.description}</textarea>
        </div>
        `;
}

function taskEditDate(task, taskId) {
    let taskDate = document.getElementById('taskDate');
    taskDate.value = task.date;
    return `
    <div class="openEditTaskOverlayDueDate">
            <label for="editDueDate">Due Date</label>
            <input type="date" id="editDueDate" value="${task.dueDate}" />
        </div>
        `;
}

function taskEditPriority(task, taskId) {
    let taskPriority = document.getElementById('taskPriority');
    taskPriority.value = task.priority;
    return `
    <label for="taskPriorityIDName">Priority</label>
            <div class="prio">
                <button class="prio-btn urgent" data-prio="urgent">Urgent</button>
                <button class="prio-btn medium" data-prio="medium">Medium</button>
                <button class="prio-btn low" data-prio="low">Low</button>
            </div>
        `;
}

function taskEditAssignedTo(task, taskId) {
    let taskAssignedTo = document.getElementById('taskAssignedTo');
    taskAssignedTo.value = task.assignedTo;
    return `
    <label for="editAssigned">Assigned to</label>
    <div id="editAssigned" style="border: 1px solid #ccc; padding: 10px;"></div>
        `;
}

function taskEditSubtasks(task, taskId) {
    let taskSubtasks = document.getElementById('taskSubtasks');
    taskSubtasks.value = task.subtasks;
    return `
    <label for="editSubtasks">Subtasks</label>
    <div id="subtask-container">
    <input maxlength="20" type="text" id="new-subtask" placeholder="Add new subtask">
    <img id="clear-subtask" class="d-none" src="../assets/svg/add_task/closeXSymbol.svg" alt="">
    <img id="add-subtask" src="../assets/svg/add_task/add+symbol.svg" alt="">
        `;
}