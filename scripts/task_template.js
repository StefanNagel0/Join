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

// /* Renders the subtask of the task */


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


// /* Renders the subtask of the task in the overlay */
function taskSubtasksTemplateOverlay(task, taskId) {
    if (task.subtasks && task.subtasks.length > 0) {
        const subtasksHtml = task.subtasks.map((subtask, index) => `
            <p id="taskSubtasksID-${index}" class="openTaskOverlaySubtask">
                <input title="Toggle Subtask" type="checkbox" id="subtask-${taskId}-${index}" onclick="toggleSubtask(${index}, '${taskId}')" ${subtask.completed ? 'checked' : ''} required/> ${subtask.text}
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


function openTaskOverlay(taskId) {
    const task = globalTasks[taskId];
    if (!task) {
        console.error(`Task mit ID ${taskId} nicht gefunden.`);
        return;
    }

    // Stelle sicher, dass das Overlay existiert
    const overlayRef = document.querySelector(".openTaskOverlayMain");
    if (!overlayRef) {
        console.error("Overlay konnte nicht gefunden werden.");
        return;
    }

    // Füge die HTML-Inhalte hinzu
    overlayRef.innerHTML = `
        <div>
            ${taskEditTitle(task)}
            ${taskEditDescription(task)}
            ${taskEditDate(task)}
            ${taskEditPriority(task)}
            ${taskEditAssignedTo(task)}
            ${taskEditSubtasks(task)}  <!-- Unteraufgaben hinzufügen -->
            <button onclick="saveTask('${taskId}')">OK</button>
        </div>
    `;
    overlayRef.classList.add('active'); // Beispiel, um das Overlay zu aktivieren
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
    if (!task) {
        console.error(`Task with ID ${taskId} not found`);
        return;
    }
    if (task.subtasks && task.subtasks[subtaskIndex]) {
        task.subtasks[subtaskIndex].completed = checkbox.checked;
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
        let maxDiplayed = 3;
        let displayedAssignees = task.assignedTo.slice(0, maxDiplayed);
        let hiddenCount = task.assignedTo.length - maxDiplayed;
        return `
        <div id="taskAssignedID" class="taskAssigned">
            ${displayedAssignees
                .map((name) => {
                    let initials = name
                        .split(" ")
                        .map(part => part.charAt(0).toUpperCase())
                        .join("");
                    let circleColor = getContactColor(name);
                    return `
                        <div class="assigned-contact">
                            <div class="initials-circle-board" style="background-color: ${circleColor};">
                                ${initials}
                            </div>
                        </div>
                    `;
                })
                .join("")}
            ${hiddenCount > 0 ? `<p class="assignedHiddenCount">+${hiddenCount}</p>` : ""}
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
                    let initials = name
                        .split(" ")
                        .map(part => part.charAt(0))
                        .join("");
                    let circleColor = getContactColor(name);
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
        let name = task.assignedTo;
        let initials = name
            .split(" ")
            .map(part => part.charAt(0))
            .join("");
        let circleColor = getContactColor(name);
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

function taskAssignedEdit(task) {
    if (Array.isArray(task.assignedTo) && task.assignedTo.length > 0) {
        return task.assignedTo
            .map(name => {
                return `
                    <option value="${name}" selected>
                        ${name}
                    </option>
                `;
            })
            .join("");
    } else if (task.assignedTo && typeof task.assignedTo === 'string') {
        const name = task.assignedTo;
        return `
            <option value="${name}" selected>
                ${name}
            </option>
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

/* Renders the assigned employees from the task */
function getAssignedOptions(assignedTo, users) {
    if (!users || !Array.isArray(users)) {
        console.error("Users array is undefined or not an array.");
        return "";
    }
    return users.map(
        (user) => `<option value="${user}" ${assignedTo.includes(user) ? "selected" : ""}>${user}</option>`
    ).join("");
}