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
                            <input oninput="searchTask()" class="contentHeadingSearch" type="search" id="search" placeholder="Search Task">
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
            <div class="boardColumn" id="to-do" ondragover="allowDrop(event)" ondrop="dropTask(event, 'to-do')">
                <div class="boardColumnHeader">
                    <h3 class="boardColumnHeaderH3">To do</h3>
                    <p onclick="boardAddTask()" class="boardAddTaskText">+</p>
                    </div>
                <div id="tasksContainer"></div>
            </div>
            <div class="boardColumn id="in-progress" ondragover="allowDrop(event)" ondrop="dropTask(event, 'in-progress')">
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
            <div class="gap_8">
                <label for="task-title">Title <span class="red_star">*</span></label>
                <input type="text" id="task-title" name="title" placeholder="Enter a title" required>
            </div>
            <div class="gap_8">
                <label for="task-desc">Description</label>
                <textarea id="task-desc" name="description" placeholder="Enter a Description"></textarea>
            </div>
            <div class="gap_8">
                <label for="task-assigned">Assigned to</label>
                <div id="task-assigned" style="border: 1px solid #ccc; padding: 10px;"></div>
            </div>
        </div>
        <div class="add_task_mid_box">
            <img src="../assets/svg/add_task/add_tastk_vertical_line.svg" alt="">
        </div>
        <div class="add_task_right_box">
            <div class="gap_8">
                <label for="task-date">Due Date <span class="red_star">*</span></label>
                <input type="date" id="task-date" name="dueDate" required>
            </div>
            <div class="gap_8">
                <p class="prio_text">Prio</p>
                <div id="task-priority">
                    <button type="button" class="prio-btn" data-prio="Urgent">Urgent <img
                            src="../assets/svg/add_task/prio_urgent.svg" alt=""></button>
                    <button type="button" class="prio-btn" data-prio="Medium">Medium <img
                            src="../assets/svg/add_task/prio_medium.svg" alt=""></button>
                    <button type="button" class="prio-btn" data-prio="Low">Low <img
                            src="../assets/svg/add_task/prio_low.svg" alt=""></button>
                </div>
            </div>
            <div class="dropdown-container">
                <div class="gap_8">
                    <label for="task-category">Category <span class="red_star">*</span></label>
                    <div class="custom-dropdown" id="dropdown-toggle-prio">
                        <span>Select task category</span>
                        <div class="dropdown-arrow"></div>
                    </div>
                    <ul class="dropdown-options hidden" id="dropdown-options">
                        <li class="dropdown-option">User Story</li>
                        <li class="dropdown-option">Technical Task</li>
                    </ul>
                </div>
            </div>
            <div class="gap_8">
                <label for="task-subtasks">Subtasks</label>
                <div id="subtask-container">
                    <input type="text" id="new-subtask" placeholder="Add new subtask">
                    <img id="clear-subtask" class="d-none" src="../assets/svg/add_task/closeXSymbol.svg" alt="">
                    <img id="add-subtask" src="../assets/svg/add_task/add+symbol.svg" alt="">
                </div>
                <ul id="subtask-list"></ul>
            </div>
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