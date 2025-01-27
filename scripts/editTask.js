// FUNKTIONEN HIER EINFÜGEN!
/* editing the task */
function editTask(taskId) {
    const task = globalTasks[taskId];
    if (!task) {
        console.error(`Task mit ID ${taskId} nicht gefunden.`);
        return;
    }
    // const optionsHtml = editingPriority(task);
    // const assignedOptionsHtml = taskAssignedEdit(task);
    const overlayRef = document.querySelector(".openTaskOverlayMain");
    overlayRef.innerHTML = taskEditTemplate(task, taskId);
}

function taskEditTitle(task, taskId) {
    let taskTitle = document.getElementById('taskTitleID');
    taskTitle.value = task.title;
    return `
    <div class="openEditTaskOverlayTitle">
            <label for="editTitle">Title</label>
            <input id="editTitle" type="text" value="${task.title}" />
        </div>
        `;
}

function taskEditDescription(task, taskId) {
    let taskBeschreibung = document.getElementById('taskDescriptionID');
    taskBeschreibung.value = task.beschreibung;
    return `
    <div class="openEditTaskOverlayDescription">
            <label for="editDescription">Description</label>
            <textarea maxlength="150" id="editDescription">${task.description}</textarea>
        </div>
        `;
}

function taskEditDate(task, taskId) {
    let taskDate = document.getElementById('taskDateID');
    taskDate.value = task.date;
    return `
    <div class="openEditTaskOverlayDueDate">
            <label for="editDueDate">Due Date</label>
            <input type="date" id="editDueDate" value="${task.dueDate}" />
        </div>
        `;
}

function taskEditPriority(task, taskId) {
    let taskPriority = document.getElementById('taskPriorityIDName');
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
    let taskAssignedTo = document.getElementById('taskAssignedID');
    taskAssignedTo.value = task.assignedTo;
    return `
    <label for="editAssigned">Assigned to</label>
    <div id="editAssigned" style="border: 1px solid #ccc; padding: 10px;"></div>
        `;
}

function taskEditSubtasks(task, taskId, subtask, index) {
    if (task.subtasks && task.subtasks.length > 0) {
        const subtasksHtml = task.subtasks.map((subtask, index) => `
        <p id="taskSubtasksID-${index}" class="openTaskOverlaySubtask">
            <input title="Toggle Subtask" type="checkbox" id="subtask-${taskId}-${index}" onclick="toggleSubtask(${index}, '${taskId}')" ${subtask.completed ? 'checked' : ''} required/> ${subtask.name}
        </p>
    `).join("");
        return `
    <div class="openTaskOverlaySubtaskContainer">
    <p class="openTaskOverlaySubtaskTitle">Subtasks</p>
        ${subtasksHtml}
    </div>
    `;
    } else {
        return ``;
    }
}

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