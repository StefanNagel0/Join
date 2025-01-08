function addTaskSuccessTemplate() {
    return `
    <div class="addTaskSuccess" "id="signUpSuccessID">
        <p class="addTaskSuccessP">Task added to board  <img src="../assets/svg/add_task/addedTask.svg" alt=""></p>
    </div>
    `
}

function taskCategoryTemplate(task) {
    if (task.category) {
        task.category = task.category == "User Story" ? "User Story" : "Technical Task";
        return `
    <p class="taskDescription taskCategoryUserStory">${task.category}</p>
    `
    } else {
        return `
    <p class="taskDescription taskCategoryTechnical">Technical Task</p>
    `
    }
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

function taskOverlayTemplate(task, taskId) {
    return `
    <div class="taskOverlay">
            <div class="taskChildContainer">
                ${taskCategoryTemplate(task)}
                <div class="taskTitleContainer">
                    ${taskTitleTemplate(task)}
                    ${taskDescriptionTemplate(task)}
                </div>
                ${taskSubtasksTemplate(task)}
                <div class="taskAssignedMain">
                    ${taskAssignedTemplate(task)}
                    ${taskPriorityTemplate(task)}
                </div>
                <!-- ${taskStatusTemplate(task)} -->
                <!-- ${taskDateTemplate(task)} -->
            </div>
            <button onclick="deleteTask('${taskId}')">Löschen</button>
            <button onclick="closeTaskOverlay()">Schließen</button>
        </div>
    `
}