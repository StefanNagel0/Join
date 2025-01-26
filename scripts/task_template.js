/* Displays a confirmation when a task has been added. */
function addTaskSuccessTemplate() {
    return `
    <div class="addTaskSuccess" id="signUpSuccessID">
        <p class="addTaskSuccessP">Task added to board  <img src="../assets/svg/add_task/addedTask.svg" alt=""></p>
    </div>
    `
}

/* Renders the category of the task */
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

/* Renders the title of the task */
function taskTitleTemplate(task) {
    return `
    <h3 id="taskTitleID" class="taskTitle">${task.title}</h3>
    `
}

/* Renders the description of the task */

function taskDescriptionTemplate(task) {
    const truncatedDescription = task.description.length > 30 ? task.description.substring(0, 30) + '...' : task.description;
    return `
    <p id="taskDescriptionID" class="taskDescription">${truncatedDescription}</p>
    `;
}

/* Renders the date of the task */
function taskDateTemplate(task) {
    return `
    <p id="taskDateID" class="taskDate"> ${task.dueDate || "No Date"}</p>
    `
}

/* Renders the subtask of the task */
function taskSubtasksTemplate(task, taskId) {
    if (task.subtasks && task.subtasks.length > 0) {
        const completedSubtasks = task.subtasks.filter(subtask => subtask && subtask.completed).length;
        const totalSubtasks = task.subtasks.filter(subtask => subtask).length;
        const progressPercent = (completedSubtasks / totalSubtasks) * 100;
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

/* Renders the subtask of the task in the overlay */
function taskSubtasksTemplateOverlay(task, taskId) {
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

/* Renders the assigned employees from the task */
async function openTaskOverlay(taskId) {
    let task = await getOneTask(taskId);
    document.getElementById('taskOverlayContainer').innerHTML = taskSubtasksTemplateOverlay(task, taskId);
    document.getElementById('taskContainer').innerHTML = taskSubtasksTemplate(task, taskId);
}

/* Fetches a single task from the database */
async function getOneTask(taskId) {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`);
    if (!response.ok) {
        throw new Error(`Fehler beim Laden der Aufgabe: ${response.statusText}`);
    }
    return await response.json();
}

/* Toggles the subtask of the task in the overlay */
async function toggleSubtask(subtaskIndex, taskId) {
    const checkbox = document.getElementById(`subtask-${taskId}-${subtaskIndex}`);
    if (!checkbox) {
        console.error(`Checkbox element for subtask-${taskId}-${subtaskIndex} not found`);
        return;
    }
    let task = await getOneTask(taskId);
    console.log(task);
    if (!task) {
        console.error(`Task with ID ${taskId} not found`);
        return;
    }
    if (task.subtasks && task.subtasks[subtaskIndex]) {
        task.subtasks[subtaskIndex].completed = checkbox.checked;
        console.log("Checkbox checked");
        console.log(subtaskIndex);
        console.log(globalTasks);
        await updateSubtaskDB(task, taskId);
        updateSubtaskProcess(taskId, task);
        openTaskOverlay(taskId);
    } else {
        console.error(`Subtask with index ${subtaskIndex} not found in task`);
    }
}

/* Updates the subtask progress of the task */
async function updateSubtaskProcess(taskId, task) {
    if (!task || !task.subtasks) {
        console.error('Task or subtasks not defined');
        return;
    }
    const completedSubtasks = task.subtasks.filter(sub => sub.completed).length;
    const totalSubtasks = task.subtasks.length;
    const progressPercent = (completedSubtasks / totalSubtasks) * 100;
    const progressBar = document.querySelector(`.progressBar[data-task-id="${taskId}"]`);
    const progressText = document.querySelector(`.progressText[data-task-id="${taskId}"]`);
    if (progressBar) progressBar.style.width = `${progressPercent}%`;
    if (progressText) progressText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    taskSubtasksTemplate(taskId, task);
    await loadTask("/tasks");
}

/* Fetches all tasks from the database */
async function updateSubtaskDB(task, taskId) {
    console.log(task);
    const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });
    if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren des Subtask: ${response.statusText}`);
    }
}

/* Renders the assigned employees from the task */
function taskAssignedTemplate(task) {
    if (Array.isArray(task.assignedTo) && task.assignedTo.length > 0) {
        return `
        <div id="taskAssignedID" class="taskAssigned">
            ${task.assignedTo
                .map((name) => {
                    const initials = name
                        .split(" ")
                        .map(part => part.charAt(0).toUpperCase())
                        .join("");
                    const circleColor = getContactColor(name);
                    return `
                        <div class="assigned-contact">
                            <div class="initials-circle-board" style="background-color: ${circleColor};">
                                ${initials}
                            </div>
                        </div>
                    `;
                })
                .join("")}
        </div>
        `;
    }
    return ``;
}

/* Renders the assigned employees from the task in the overlay */
function taskAssignedTemplateOverlay(task) {
    if (Array.isArray(task.assignedTo) && task.assignedTo.length > 0) {
        return `
        <div id="taskAssignedID" class="taskAssigned">
            ${task.assignedTo
                .map(name => {
                    const initials = name
                        .split(" ")
                        .map(part => part.charAt(0))
                        .join("");
                    const circleColor = getContactColor(name);
                    return `
                        <p class="board_overlay_contact_box">
                            <span class="initialsOverlay" style="background-color: ${circleColor};">
                                ${initials}
                            </span> 
                            ${name}
                        </p>
                    `;
                })
                .join("")}
        </div>
        `;
    } else if (task.assignedTo && typeof task.assignedTo === 'string') {
        const name = task.assignedTo;
        const initials = name
            .split(" ")
            .map(part => part.charAt(0))
            .join("");
        const circleColor = getContactColor(name);
        return `
        <div id="taskAssignedID" class="taskAssigned">
            <p>
                <span class="initialsOverlay" style="background-color: ${circleColor};">
                    ${initials}
                </span> 
                - ${name}
            </p>
        </div>
        `;
    } else {
        return ``;
    }
}

/* Renders the priority of the task */
function taskPriorityTemplate(task) {
    if (task.priority.toLowerCase() === "urgent") {
        return `
        <p id="taskPriorityID" class="taskPriority  taskPriorityUrgent"><img src="../assets/svg/add_task/prio_urgent.svg" alt=""></p>
        `
    } else if (task.priority.toLowerCase() === "medium") {
        return `
        <p id="taskPriorityID" class="taskPriority data-priority taskPriorityMedium"><img src="../assets/svg/add_task/prio_medium.svg" alt=""></p>
        `
    } else if (task.priority.toLowerCase() === "low") {
        return `
        <p id="taskPriorityID" class="taskPriority data-priority taskPriorityLow"><img src="../assets/svg/add_task/prio_low.svg" alt=""></p>
        `;
    }
}

/* Renders the priority of the task in the overlay */
function taskPriorityTemplateName(task) {
    if (task.priority.toLowerCase() === "urgent") {
        return `
        <p id="taskPriorityIDName">Urgent</p>
        <p id="taskPriorityIDName" data-priority="Urgent" class=""><img src="../assets/svg/add_task/prio_urgent.svg" alt=""></p>
        `
    } else if (task.priority.toLowerCase() === "medium") {
        return `
        <p id="taskPriorityIDName">Medium</p>
        <p id="taskPriorityIDName" data-priority="Medium" class="taskPriorityMedium"><img src="../assets/svg/add_task/prio_medium.svg" alt=""></p>
        `
    } else if (task.priority.toLowerCase() === "low") {
        return `
        <p id="taskPriorityIDName">Low</p>
        <p id="taskPriorityIDName" data-priority="Low" class="taskPriorityLow"><img src="../assets/svg/add_task/prio_low.svg" alt=""></p>
        `
    }
}

/* Renders the status of the task */
function taskStatusTemplate(task) {
    return `
    <p id="taskStatusID" class="taskStatus">${task.status}</p>
    `
}

/* editing priority */
function editingPriority(task) {
    const priorityOptions = ["Urgent", "Medium", "Low"];
    return priorityOptions.map(
        (priority) => `<option value="${priority}" ${task.priority === priority ? "selected" : ""}>${priority}</option>`
    ).join("");

}
/* editing the task */
function editTask(taskId) {
    const task = globalTasks[taskId];
    if (!task) {
        console.error(`Task mit ID ${taskId} nicht gefunden.`);
        return;
    }
    const optionsHtml = editingPriority(task);
    const overlayRef = document.querySelector(".openTaskOverlayMain");
    overlayRef.innerHTML = `
    <button class="closeEditButton" onclick="closeTaskOverlay()">X</button>
<div class="openEditTaskOverlayMain">
    <div class="openEditTaskOverlayTitle">
        <label for="editTitle">Title</label>
        <input id="editTitle" type="text" value="${task.title}" />
    </div>
    <div class="openEditTaskOverlayDescription">
        <label for="editDescription">Description</label>
        <textarea id="editDescription">${task.description}</textarea>
    </div>
    <div class="openEditTaskOverlayDueDate">
        <label for="editDueDate">Due Date</label>
        <input class="taskEditDate" id="editDueDate" type="date" value="${task.dueDate}" />
    </div>
    <div class="openEditTaskOverlayPriority">
        <label for="editPriority">Priority</label>
        <select id="editPriority">
            ${optionsHtml}
        </select>
    </div>
    <div class="openEditTaskOverlaySubtasks">
        <label for="editSubtasks">Subtasks</label>
        <div>
            ${task.subtasks?.map((subtask, index) => `
            <div>
                <input type="text" id="subtask-title-${index}" value="${subtask.name || ''}" />
            </div>
            `).join("")}
        </div>
    </div>
</div>
<div>
    <button onclick="saveTask('${taskId}')">Save</button>
</div>
    `;
}

/* save the editing task */
async function saveTask(taskId) {
    const task = globalTasks[taskId];
    if (!task) {
        console.error(`Task mit ID ${taskId} nicht gefunden.`);
        return;
    }
    task.title = document.getElementById("editTitle").value;
    task.description = document.getElementById("editDescription").value;
    task.dueDate = document.getElementById("editDueDate").value;
    task.priority = document.getElementById("editPriority").value;
    task.subtasks = Array.from(document.querySelectorAll("[id^='subtask-']")).map(input => input.value);
    if (taskId in globalTasks)
        await updateTaskInDatabase(taskId, task);
    closeTaskOverlay();
    displayTasks(globalTasks);

}
/* edited task update to database */
async function updateTaskInDatabase(taskId, updatedTask) {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTask)
    });
    if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren der Aufgabe: ${response.statusText}`);
    }
}