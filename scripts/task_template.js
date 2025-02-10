/**Displays a confirmation when a task has been added.*/
function addTaskSuccessTemplate() {
    return `
    <div class="addTaskSuccess" id="signUpSuccessID">
        <p class="addTaskSuccessP">Task added to board <img src="../assets/svg/add_task/addedTask.svg" alt=""></p>
    </div>
    `;
}

/**Renders the category of the task.*/
function taskCategoryTemplate(task, taskId) {
    let category = task.category === "User Story" ? "User Story" : "Technical Task";
    let categoryClass = category === "User Story" ? "taskCategoryUserStory" : "taskCategoryTechnical";
    return `
    <div class="taskCategorySwitchContainer">
        <button class="openTaskOverlayChangeButton" onclick="event.stopPropagation(), taskSwitchMainCategory('${taskId}', '${task.mainCategory}')">
            <img src="../assets/svg/add_task/closeXSymbol.svg" alt="">
        </button>
        <div id="taskSwitchOverlay-${taskId}" class="taskSwitchOverlay" style="display: none;">
            ${taskSwitchTemplate(task.mainCategory, taskId)}
        </div>
    <p id="taskCategoryID" class="taskDescription ${categoryClass}">${category}</p>
    </div>
    `;
}

/**Renders the title of the task.*/
function taskTitleTemplate(task) {
    return `<h3 id="taskTitleID" class="taskTitle">${task.title}</h3>`;
}

/**Renders the description of the task.*/
function taskDescriptionTemplate(task) {
    let truncated = task.description.length > 30 ? task.description.substring(0, 30) + "..." : task.description;
    return `<p id="taskDescriptionID" class="taskDescription">${truncated}</p>`;
}

/**Renders the due date of the task.*/
function taskDateTemplate(task) {
    return `<p id="taskDateID" class="taskDate">${task.dueDate || "No Date"}</p>`;
}

/** Renders the subtask of the task */
function taskSubtasksTemplate(task, taskId) {
    if (task.subtasks && task.subtasks.length > 0) {
        let completedSubtasks = task.subtasks.filter(subtask => subtask && subtask.completed).length;
        let totalSubtasks = task.subtasks.filter(subtask => subtask).length;
        let progressPercent = (completedSubtasks / totalSubtasks) * 100;
        return `
        <div class="taskSubtaskContainer">
            <div class="progressBarContainer">
                <div class="progressBar" style="width: ${progressPercent}%;"></div>
            </div>
            <p class="progressText">${completedSubtasks}/${totalSubtasks} Subtasks</p>
        </div>`;
    } else {
        return `<p>No Subtasks available</p>`;
    }
}

/** Renders the subtask of the task in the overlay */
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
        </div>`;
    } else {
        return ``;
    }
}

/**Opens the task overlay and populates it with task details.*/
function openTaskOverlay(taskId) {
    let task = globalTasks[taskId];
    if (!task) return console.error(`Task with ID ${taskId} not found.`);
    let overlayRef = document.querySelector(".openTaskOverlayMain");
    if (!overlayRef) return console.error("Overlay not found.");
    overlayRef.innerHTML = getTaskOverlayContent(task, taskId);
    overlayRef.classList.add('active');
}

/**Generates the HTML content for the task overlay.*/
function getTaskOverlayContent(task, taskId) {
    return `
        <div>
            ${taskEditTitle(task)}
            ${taskEditDescription(task)}
            ${taskEditDate(task)}
            ${taskEditPriority(task)}
            ${taskEditAssignedTo(task)}
            ${taskEditSubtasks(task)}
            <button onclick="saveTask('${taskId}')">OK</button>
        </div>
    `;
}

/** Fetches a single task from the database */
async function getOneTask(taskId) {
    let response = await fetch(`${BASE_URL}/tasks/${taskId}.json`);
    if (!response.ok) {
        throw new Error(`Fehler beim Laden der Aufgabe: ${response.statusText}`);
    }
    return await response.json();
}

/**Toggles the completion state of a subtask in the overlay.*/
async function toggleSubtask(subtaskIndex, taskId) {
    const checkbox = document.getElementById(`subtask-${taskId}-${subtaskIndex}`);
    let task = await getOneTask(taskId);
    task.subtasks[subtaskIndex].completed = checkbox.checked;
    await updateSubtaskDB(task, taskId);
    refreshTaskOverlay(taskId, task);
}

/**Updates the subtask progress and reopens the task overlay.*/
function refreshTaskOverlay(taskId, task) {
    updateSubtaskProcess(taskId, task);
    openTaskOverlay(taskId);
}

/** Updates the subtask progress of the task */
async function updateSubtaskProcess(taskId, task) {
    if (!task || !task.subtasks) {
        console.error('Task or subtasks not defined');
        return;
    }
    let completedSubtasks = task.subtasks.filter(sub => sub.completed).length;
    let totalSubtasks = task.subtasks.length;
    let progressPercent = (completedSubtasks / totalSubtasks) * 100;
    let progressBar = document.querySelector(`.progressBar[data-task-id="${taskId}"]`);
    let progressText = document.querySelector(`.progressText[data-task-id="${taskId}"]`);
    if (progressBar) progressBar.style.width = `${progressPercent}%`;
    if (progressText) progressText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    taskSubtasksTemplate(taskId, task);
    await loadTask("/tasks");
}

/** Fetches all tasks from the database */
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

/** Renders the assigned employees from the task.*/
function taskAssignedTemplate(task) {
    if (!Array.isArray(task.assignedTo) || task.assignedTo.length === 0) return "";
    const displayed = task.assignedTo.slice(0, 3).map(renderAssignee).join("");
    const hiddenCount = task.assignedTo.length - 3;
    return `<div id="taskAssignedID" class="taskAssigned">${displayed}${hiddenCount > 0 ? `<p class="assignedHiddenCount">+${hiddenCount}</p>` : ""}</div>`;
}

/** Generates the HTML for an assigned employee.*/
function renderAssignee(name) {
    let initials = name.split(" ").map(part => part.charAt(0).toUpperCase()).join("");
    return `<div class="assigned-contact"><div class="initials-circle-board" style="background-color: ${getContactColor(name)};">${initials}</div></div>`;
}

/** Renders the assigned employees from the task in the overlay.*/
function taskAssignedTemplateOverlay(task) {
    if (!task.assignedTo) return "";
    return `<div id="taskAssignedID" class="taskAssigned">
                ${Array.isArray(task.assignedTo) ? task.assignedTo.map(renderOverlayAssignee).join("") : renderOverlayAssignee(task.assignedTo)}
            </div>`;
}

/** Generates the HTML for an assigned employee in the overlay.*/
function renderOverlayAssignee(name) {
    let initials = name.split(" ").map(part => part.charAt(0)).join("");
    return `<p class="board_overlay_contact_box">
                <span class="initialsOverlay" style="background-color: ${getContactColor(name)};">${initials}</span> ${name}
            </p>`;
}

/** Generates the HTML for assigned employees in the edit dropdown.*/
function taskAssignedEdit(task) {
    if (!task.assignedTo) return "";
    return Array.isArray(task.assignedTo)
        ? task.assignedTo.map(renderEditOption).join("")
        : renderEditOption(task.assignedTo);
}

/** Generates an option element for an assigned employee.*/
function renderEditOption(name) {
    return `<option value="${name}" selected>${name}</option>`;
}

/** Renders the priority of the task */
function taskPriorityTemplate(task) {
    if (task.priority.toLowerCase() === "urgent") {
        return `
        <p id="taskPriorityID" class="taskPriority  taskPriorityUrgent"><img src="../assets/svg/add_task/prio_urgent.svg" alt=""></p>`
    } else if (task.priority.toLowerCase() === "medium") {
        return `
        <p id="taskPriorityID" class="taskPriority data-priority taskPriorityMedium"><img src="../assets/svg/add_task/prio_medium.svg" alt=""></p>`
    } else if (task.priority.toLowerCase() === "low") {
        return `
        <p id="taskPriorityID" class="taskPriority data-priority taskPriorityLow"><img src="../assets/svg/add_task/prio_low.svg" alt=""></p>`;
    }
}

/** Renders the priority of the task in the overlay */
function taskPriorityTemplateName(task) {
    if (task.priority.toLowerCase() === "urgent") {
        return `
        <p id="taskPriorityIDName">Urgent</p>
        <p id="taskPriorityIDName" data-priority="Urgent" class=""><img src="../assets/svg/add_task/prio_urgent.svg" alt=""></p>`
    } else if (task.priority.toLowerCase() === "medium") {
        return `
        <p id="taskPriorityIDName">Medium</p>
        <p id="taskPriorityIDName" data-priority="Medium" class="taskPriorityMedium"><img src="../assets/svg/add_task/prio_medium.svg" alt=""></p>`
    } else if (task.priority.toLowerCase() === "low") {
        return `
        <p id="taskPriorityIDName">Low</p>
        <p id="taskPriorityIDName" data-priority="Low" class="taskPriorityLow"><img src="../assets/svg/add_task/prio_low.svg" alt=""></p>`
    }
}

/** Renders the status of the task */
function taskStatusTemplate(task) {
    return `
    <p id="taskStatusID" class="taskStatus">${task.status}</p>
    `
}

/** editing priority */
function editingPriority(task) {
    const priorityOptions = ["Urgent", "Medium", "Low"];
    return priorityOptions.map(
        (priority) => `<option value="${priority}" ${task.priority === priority ? "selected" : ""}>${priority}</option>`
    ).join("");

}

/** Renders the assigned employees from the task */
function getAssignedOptions(assignedTo, users) {
    if (!users || !Array.isArray(users)) {
        console.error("Users array is undefined or not an array.");
        return "";
    }
    return users.map(
        (user) => `<option value="${user}" ${assignedTo.includes(user) ? "selected" : ""}>${user}</option>`
    ).join("");
}