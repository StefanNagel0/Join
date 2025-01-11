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
        const categoryClass = task.category == "User Story" ? "taskCategoryUserStory" : "taskCategoryTechnical";
        return `
        <p id="taskCategoryID" class="taskDescription ${categoryClass}">${task.category}</p>
        `;
    } else {
        return `
        <p id="taskCategoryID" class="taskDescription taskCategoryTechnical">Technical Task</p>
        `;
    }
}

function taskTitleTemplate(task) {
    return `
    <h3 id="taskTitleID" class="taskTitle">${task.title}</h3>
    `
}

function taskDescriptionTemplate(task) {
    return `
    <p id="taskDescriptionID" class="taskDescription">${task.description}</p>
    `
}

function taskDateTemplate(task) {
    return `
    <p id="taskDateID" class="taskDate">${task.dueDate || "No Date"}</p>
    `
}

function taskSubtasksTemplate(task) {
    if (!task.subtasks) {
        return ``
    } else {
        return `
        <p id="taskSubtasksID" class="taskSubtasks">${task.subtasks}</p>
        `
    }
}

function taskAssignedTemplate(task) {
    if (task.assignedTo) {
        return `
        <p id="taskAssignedID" class="taskAssigned">${task.assignedTo}</p>
        `
    } else {
        return ``
    }
}

function taskAssignedTemplateOverlay(task) {
    if (task.assignedTo) {
        return `
        <p id="taskAssignedID" class="taskAssigned">${task.assignedTo}</p>
        `
    } else {
        return ``
    }
}

function taskPriorityTemplate(task) {
    if (task.priority == "Urgent") {
        return `
        <p id="taskPriorityID" class="taskPriority taskPriorityUrgent"><img src="../assets/svg/add_task/prio_urgent.svg" alt=""></p>
        `
    } else if (task.priority == "Medium") {
        return `
        <p id="taskPriorityID" class="taskPriority taskPriorityMedium"><img src="../assets/svg/add_task/prio_medium.svg" alt=""></p>
        `
    } else if (task.priority == "Low") {
        return `
        <p id="taskPriorityID" class="taskPriority taskPriorityLow"><img src="../assets/svg/add_task/prio_low.svg" alt=""></p>
        `
    }
}

function taskPriorityTemplateName(task) {
    if (task.priority == "Urgent") {
        return `
        <p id="taskPriorityIDName">Urgent</p>
        <p id="taskPriorityIDName" class=""><img src="../assets/svg/add_task/prio_urgent.svg" alt=""></p>
        `
    } else if (task.priority == "Medium") {
        return `
        <p id="taskPriorityIDName">Medium</p>
        <p id="taskPriorityIDName" class="taskPriorityMedium"><img src="../assets/svg/add_task/prio_medium.svg" alt=""></p>
        `
    } else if (task.priority == "Low") {
        return `
        <p id="taskPriorityIDName">Low</p>
        <p id="taskPriorityIDName" class="taskPriorityLow"><img src="../assets/svg/add_task/prio_low.svg" alt=""></p>
        `
    }
}

function taskStatusTemplate(task) {
    return `
    <p id="taskStatusID" class="taskStatus">${task.status}</p>
    `
}

function taskOverlayTemplate(task, taskId) {
    return `
    <div class="openTaskOverlayMain">
        ${taskCategoryTemplate(task)}
        ${taskTitleTemplate(task)}
        ${taskDescriptionTemplate(task)}
        <div class="openTaskOverlayDateContainer">
            Due Date: ${taskDateTemplate(task)}
        </div>
        <div class="openTaskOverlayPriorityContainer">
            Priority: ${taskPriorityTemplateName(task)}
        </div>
        <div class="openTaskOverlayAssignedContainer">
            Assigned to: ${taskAssignedTemplate(task)}
        </div>
        ${taskStatusTemplate(task)}
        ${taskSubtasksTemplate(task)}
        <button onclick="deleteTask('${taskId}')">Löschen</button>
        <button onclick="closeTaskOverlay()">Schließen</button>
    </div>
    `
}