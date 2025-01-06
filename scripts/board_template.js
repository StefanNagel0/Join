function boardTemplate() {
    return `
    <div class="mainContent">
    <div class="contentHeading">
        <div class="contentHeadingMain">
            <div>
                <h2 class="contentHeadingH2">Board</h2>
            </div>
            <div class="contentHeadingOrder">
                <div class="contentHeadingSearchMain">
                    <div class="contentHeadingSearchSecond">
                        <div class="contenHeadingSearchMain">
                            <input class="contentHeadingSearch" type="search" id="search" placeholder="Search Task">
                        </div>
                        <div>
                            <img class="contentHeadingSearchImg" src="../assets/svg/searching.svg" alt="search">
                        </div>
                    </div>
                </div>
                <div class="contentHeadingRight">
                    <div>
                        <Button id="addTaskButton" class="addTaskButton" onclick="boardAddTask()">
                        <p class="addTaskButtonText">Add Task</p>
                        <img class="addTaskButtonImg" src="../assets/svg/add_task/add_task.svg" alt="">
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="contentBoard">
        <div class="board">
            <div class="boardColumn">
                <div class="boardColumnHeader">
                    <h3 class="boardColumnHeaderH3">To do</h3>
                    <p onclick="boardAddTask()" class="boardAddTaskText">+</p>
                    </div>
<<<<<<< HEAD
                    <div id="tasksToDo"></div>
=======
                <div id="tasksContainer"></div>
>>>>>>> 35266db71deba4e8a692fdcb91fec033de96ffe9
            </div>
            <div class="boardColumn">
                <div class="boardColumnHeader">
                    <h3 class="boardColumnHeaderH3">In progress</h3>
                    <p onclick="boardAddTask()" class="boardAddTaskText">+</p>
                </div>
            </div>
            <div class="boardColumn">
                <div class="boardColumnHeader">
                    <h3 class="boardColumnHeaderH3">Await feedback</h3>
                    <p onclick="boardAddTask()" class="boardAddTaskText">+</p>
                </div>
            </div>
            <div class="board_column">
                <div class="boardColumnHeader">
                    <h3 class="boardColumnHeaderH3">Done</h3>
                </div>
            </div>
        </div>
    </div>
</div>
    `
}

function boardAddTaskTemplate() {
    return `
<section>
    <section class="add_task_form_box">
        <div class="add_task_left_box addTaskLeftBoxBoard">
            <!-- Title -->
            <label for="task-title">Title *</label>
            <input type="text" id="task-title" name="title" placeholder="Enter task title" required>

            <!-- Description -->
            <label for="task-desc">Description</label>
            <textarea id="task-desc" name="description" placeholder="Enter task description"></textarea>

            <!-- Assigned To -->
            <label for="task-assigned">Assigned To *</label>
            <select id="task-assigned" name="assignedTo" required>
                <!-- Dynamically populated -->
            </select>
        </div>
        <div class="add_task_mid_box">
            <img src="../assets/svg/add_task/add_tastk_vertical_line.svg" alt="">
        </div>
        <div class="add_task_right_box">
            <!-- Due Date -->
            <label for="task-date">Due Date *</label>
            <input type="date" id="task-date" name="dueDate" required>

            <!-- Priority -->
            <div>
                <p>Priority *</p>
                <div id="task-priority">
                    <button type="button" class="prio-btn" data-prio="Urgent">Urgent</button>
                    <button type="button" class="prio-btn" data-prio="Medium">Medium</button>
                    <button type="button" class="prio-btn" data-prio="Low">Low</button>
                </div>
                <input type="hidden" id="task-priority-hidden" name="priority" required>
            </div>

            <!-- Category -->
            <label for="task-category">Category *</label>
            <input type="text" id="task-category" name="category" placeholder="Enter category" required>

            <!-- Subtasks -->
            <label for="task-subtasks">Subtasks</label>
            <div id="subtask-container">
                <input type="text" id="new-subtask" placeholder="Add subtask">
                <button type="button" id="add-subtask">Add</button>
            </div>
            <ul id="subtask-list"></ul>
        </div>
    </section>
    <p class="requiredFields">* Required fields</p>
    <div class="addTaskBottomBox">
        <Button id="addTaskButton" class="addTaskButton" onclick="postTask()">
            <p class="addTaskButtonText">Add Task</p>
            <img class="addTaskButtonImgBottomBox" src="../assets/svg/add_task/check.svg" alt="">
        </Button>
        <Button id="cancelTaskButton" class="cancelAddTaskButton" onclick="closeBoardAddTask()">
            <p class="cancelTaskButtonText">Cancel X</p>
        </Button>
    </div>
</section>
    `
}

function addTaskSuccessTemplate() {
    return `
    <div class="addTaskSuccess" "id="signUpSuccessID">
        <p class="addTaskSuccessP">Task added to board  <img src="../assets/svg/add_task/addedTask.svg" alt=""></p>
    </div>
    `
}

function getTasksTemplate(tasks) {
    return `
    ${tasks.map(task => `
    <div class="task">
        <div class="taskTitle">
            <p class="taskTitleP">${task.title}</p>
            <p class="taskTitleP">${task.priority}</p>
        </div>
        <div class="taskDescription">
            <p class="taskDescriptionP">${task.description}</p>
        </div>
        <div class="taskAssigned">
            <p class="taskAssignedP">${task.assignedTo}</p>
        </div>
        <div class="taskCategory">
            <p class="taskCategoryP">${task.category}</p>
        </div>
        <div class="taskDueDate">
            <p class="taskDueDateP">${task.dueDate}</p>
        </div>
    </div>
    `).join('')}
    `
}

function getTaskTemplate2(task) {
    return `
    <h3>${task.title}</h3>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Category:</strong> ${task.category || "None"}</p>
            <p><strong>Assigned To:</strong> ${task.assignedTo || "Not Assigned"}</p>
            <p><strong>Due Date:</strong> ${task.dueDate || "No Date"}</p>
            <p><strong>Priority:</strong> ${task.priority || "Normal"}</p>
            <p><strong>Status:</strong> ${task.status}</p>
        `;
}