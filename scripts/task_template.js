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

// Subtask als Balken darstellen

function taskSubtasksTemplate(task) {
    if (task.subtasks && task.subtasks.length > 0) {
        const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
        const totalSubtasks = task.subtasks.length;
        const progressPercent = (completedSubtasks / totalSubtasks) * 100;
        console.log(task.subtasks[0]);
        return `
        <div class="taskSubtaskContainer">
            <div class="progressBarContainer">
                <div class="progressBar" style="width: ${progressPercent}%;"></div>
            </div>
            <p class="progressText">${completedSubtasks}/${totalSubtasks} Subtasks</p>
        </div>
        `;
    } else {
        return `<p>No Subtasks available</p>`;
    }
}

function taskSubtasksTemplateOverlay(task) {
    if (task.subtasks && task.subtasks.length > 0) {
        const subtasksHtml = task.subtasks.map(subtask => `
            <p id="taskSubtasksID" class="openTaskOverlaySubtask">
                <input type="checkbox" required/> ${subtask}
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

//Nur Farbe mit Kürzel anzeigen
function taskAssignedTemplate(task) {
    if (task.assignedTo && task.assignedTo.length > 0) {
        return `
        <div id="taskAssignedID" class="taskAssigned">
            ${task.assignedTo
                .map(name => {
                    const initials = name
                        .split(" ")
                        .map(part => part.charAt(0))
                        .join("");
                    return `<p class="initialsTemplate">${initials}</p>`;
                })
                .join("")}
        </div>
        `;
    } else {
        return ``;
    }
}

// Benutzer nicht mit komma trennen und Vor/Nachname + Farbe mit Kürzel anzeigen
function taskAssignedTemplateOverlay(task) {
    if (task.assignedTo && task.assignedTo.length > 0) {
        return `
        <div id="taskAssignedID" class="taskAssigned">
            ${task.assignedTo
                .map(name => {
                    const initials = name
                        .split(" ")
                        .map(part => part.charAt(0))
                        .join("");
                    return `<p><span class="initialsOverlay">${initials}</span> - ${name}</p>`;
                })
                .join("")}
        </div>
        `;
    } else {
        return ``;
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
            Assigned to: ${taskAssignedTemplateOverlay(task)}
        </div>
        ${taskStatusTemplate(task)}
        
        ${taskSubtasksTemplateOverlay(task)}
        <div class="openTaskOverlayButtonContainer">
            <button class="openTaskOverlayDeleteButton" onclick="deleteTask('${taskId}')"><img src="../assets/svg/delete.svg" alt=""> Delete</button>
            <button class="openTaskOverlayEditButton" onclick="closeTaskOverlay()"><img src="../assets/svg/edit.svg" alt=""> Edit</button>
        </div>
    </div>
    `
}