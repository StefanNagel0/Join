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

function taskDateTemplate(task) {
    return `
    <p class="taskDate">${task.dueDate || "No Date"}</p>
    `
}

function taskAssignedTemplate(task) {
    if (task.assignedTo) {
        return `
        <p class="taskAssigned">${task.assignedTo}</p>
        `
    } else {
        return ``
    }
}

function taskPriorityTemplate(task) {
    if (task.priority == "Urgent") {
        return `
        <p class="taskPriority taskPriorityUrgent"><img src="../assets/svg/add_task/prio_urgent.svg" alt=""></p>
        `
    } else if (task.priority == "Medium") {
        return `
        <p class="taskPriority taskPriorityMedium"><img src="../assets/svg/add_task/prio_medium.svg" alt=""></p>
        `
    } else if (task.priority == "Low") {
        return `
        <p class="taskPriority taskPriorityLow"><img src="../assets/svg/add_task/prio_low.svg" alt=""></p>
        `
    }
}


function taskStatusTemplate(task) {
    return `
    <p class="taskStatus">${task.status}</p>
    `
}

function taskSubtasksTemplate(task) {
    if (!task.subtasks) {
        return ``
    } else {
        return `
        <p class="taskSubtasks">${task.subtasks}</p>
        `
    }
}

function taskOverlayTemplate(task, taskId) {
    return `
    <div class="openTaskOverlayMain">
            <div class="openTaskOverlayChildContainer">
                ${taskCategoryTemplate(task)}
                <div class="openTaskOverlayTitle">
                    ${taskTitleTemplate(task)}
                    ${taskDescriptionTemplate(task)}
                </div>
                ${taskSubtasksTemplate(task)}
                <div class="openTaskOverlayAssigned">
                    ${taskAssignedTemplate(task)}
                    ${taskPriorityTemplate(task)}
                </div>
                <div class="openTaskOverlayDate">
                <!-- ${taskStatusTemplate(task)} -->
                Due Date: ${taskDateTemplate(task)}
                </div>
            </div>
            <button onclick="deleteTask('${taskId}')">Löschen</button>
            <button onclick="closeTaskOverlay()">Schließen</button>
        </div>
    `
}