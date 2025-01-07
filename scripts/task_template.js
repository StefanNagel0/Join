function addTaskSuccessTemplate() {
    return `
    <div class="addTaskSuccess" "id="signUpSuccessID">
        <p class="addTaskSuccessP">Task added to board  <img src="../assets/svg/add_task/addedTask.svg" alt=""></p>
    </div>
    `
}

function taskCategoryTemplate(task) {
    return `
    <p>${task.category || "None"}</p>
    `
}

function taskTitleTemplate(task) {
    return `
    <h3 class="taskTitle">${task.title}</h3>
    `
}

function taskDescriptionTemplate(task) {
    return `
    <p class="taskDescription">${task.description}</p>
    `
}

function taskAssignedTemplate(task) {
    return `
    <p class="taskAssigned">${task.assignedTo || "Not Assigned"}</p>
    `
}

function taskDateTemplate(task) {
    return `
    <p class="taskDate">${task.dueDate || "No Date"}</p>
    `
}

function taskPriorityTemplate(task) {
    return `
    <p class="taskPriority">${task.priority || "Normal"}</p>
    `
}

function taskStatusTemplate(task) {
    return `
    <p class="taskStatus">${task.status}</p>
    `
}

function taskSubtasksTemplate(task) {
    return `
    <p class="taskSubtasks">${task.subtasks || ""}</p>
    `
}

function taskOverlayTemplate(task) {
    return `
    <div class="taskOverlay" id="taskOverlay">
    <div>${task.description}</div>
    <div>${task.title}</div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    </div>
    `
}