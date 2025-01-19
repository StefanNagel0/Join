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
    return `
    <p id="taskDescriptionID" class="taskDescription">${task.description}</p>
    `
}

/* Renders the date of the task */
function taskDateTemplate(task) {
    return `
    <p id="taskDateID" class="taskDate"> ${task.dueDate || "No Date"}</p>
    `
}

// Subtask als Balken darstellen
/* Renders the subtask of the task */
function taskSubtasksTemplate(task) {
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
// Benutzer nicht mit Komma trennen und Vor/Nachname + Farbe mit Kürzel anzeigen
function taskAssignedTemplateOverlay(task) {
    // Überprüfen, ob task.assignedTo existiert und ein Array ist
    if (Array.isArray(task.assignedTo) && task.assignedTo.length > 0) {
        return `
        <div id="taskAssignedID" class="taskAssigned">
            ${task.assignedTo
                .map(name => {
                    const initials = name
                        .split(" ")
                        .map(part => part.charAt(0))
                        .join("");
                    const circleColor = getContactColor(name); // Holen der zufälligen Farbe
                    return `
                        <p>
                            <span class="initialsOverlay" style="background-color: ${circleColor};">
                                ${initials}
                            </span> 
                            - ${name}
                        </p>
                    `;
                })
                .join("")}
        </div>
        `;
    } else if (task.assignedTo && typeof task.assignedTo === 'string') {
        // Falls assignedTo ein einzelner Name (String) ist, es in ein Array umwandeln
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



// /* Renders the assigned employees from the task in the overlay */
// // Benutzer nicht mit komma trennen und Vor/Nachname + Farbe mit Kürzel anzeigen
// function taskAssignedTemplateOverlay(task) {
//     if (task.assignedTo && task.assignedTo.length > 0) {
//         return `
//         <div id="taskAssignedID" class="taskAssigned">
//             ${task.assignedTo
//                 .map(name => {
//                     const initials = name
//                         .split(" ")
//                         .map(part => part.charAt(0))
//                         .join("");
//                     return `<p><span class="initialsOverlay">${initials}</span> - ${name}</p>`;
//                 })
//                 .join("")}
//         </div>
//         `;
//     } else {
//         return ``;
//     }
// }

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

/* Renders the overlay from the task */
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
            <button class="openTaskOverlayEditButton" onclick="editTask('${taskId}')"><img src="../assets/svg/edit.svg" alt=""> Edit</button>
        </div>
    </div>
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
        <input id="editTitle" type="text" value="${task.title}" />
        <textarea id="editDescription">${task.description}</textarea>
        <input id="editDueDate" type="date" value="${task.dueDate}" />
        <select id="editPriority">
            ${optionsHtml}
        </select>
        <div>
            ${task.subtasks?.map((subtask, index) => `
                <div>
                    <input type="text" id="subtask-${index}" value="${subtask}" />
                </div>
            `).join("")}
        </div>
        <button onclick="saveTask('${taskId}')">Save</button>
        <button onclick="closeTaskOverlay()">Cancel</button>
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