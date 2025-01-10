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
            <div class="boardColumn">
                <div class="boardColumnHeader">
                    <h3 class="boardColumnHeaderH3">To do</h3>
                    <p onclick="boardAddTask()" class="boardAddTaskText">+</p>
                    </div>
                <div id="tasksContainer"></div>
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
<section class="content">
                <form id="task-form" onsubmit="saveTask(event)">
                    <div class="content_heading">
                        <h2>Add Task</h2>
                    </div>
                    <section class="add_task_form_box">
                        <div class="add_task_left_box">
                            <div class="gap_8">
                                <label for="task-title">Title <span class="red_star">*</span></label>
                                <input type="text" id="task-title" name="title" placeholder="Enter a title" required>
                            </div>
                            <div class="gap_8">
                                <label for="task-desc">Description</label>
                                <textarea id="task-desc" name="description"
                                    placeholder="Enter a Description"></textarea>
                            </div>
                            <div class="gap_8">
                                <label for="task-assigned">Assigned to</label>
                                <div id="task-assigned"> <!-- Hier die ID hinzugefügt -->
                                    <div id="dropdown-wrapper">
                                        <div id="dropdown-toggle">
                                            <span>Select contacts to assign</span>
                                            <div class="dropdown-arrow"></div>
                                        </div>
                                        <div id="dropdown-content">
                                            <!-- Hier werden Kontakte dynamisch eingefügt -->
                                        </div>
                                    </div>
                                    <div id="selected-contacts">
                                        <!-- Ausgewählte Kontakte werden hier angezeigt -->
                                    </div>
                                </div>
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
                                    <div class="dropdown-container">
                                        <div class="custom-dropdown" id="dropdown-toggle-category" onclick="toggleDropdown(event, this, document.getElementById('dropdown-options-category'))">
                                            <span>Select task category</span>
                                            <div class="dropdown-arrow"></div>
                                        </div>
                                        <ul class="dropdown-options hidden" id="dropdown-options-category">
                                            <li class="dropdown-option" data-category="User Story" onclick="selectDropdownOption(event, document.getElementById('dropdown-toggle-category'), this)">User Story</li>
                                            <li class="dropdown-option" data-category="Technical Task" onclick="selectDropdownOption(event, document.getElementById('dropdown-toggle-category'), this)">Technical Task</li>
                                            <!-- Weitere Kategorien können hier hinzugefügt werden -->
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="gap_8">
                                <label for="task-subtasks">Subtasks</label>
                                <div id="subtask-container">
                                    <input type="text" id="new-subtask" placeholder="Add new subtask">
                                    <img id="clear-subtask" class="d-none" src="../assets/svg/add_task/closeXSymbol.svg"
                                        alt="">
                                    <img id="add-subtask" src="../assets/svg/add_task/add+symbol.svg" alt="">
                                </div>
                                <ul id="subtask-list"></ul>
                            </div>
                        </div>
                    </section>
                    <div class="add_task_required_info_box">
                        <div>
                            <span class="add_task_required_info">
                                <span class="red_star">*</span>
                                This field is required
                            </span>
                        </div>
                        <div class="add_task_buttons_box">
                            <div class="clear_save_btns">
                                <div>
                                    <button class="add_task_clear_btn">
                                        <span>Clear</span>
                                        <img src="..//assets/svg/add_task/closeXSymbol.svg" alt="X">
                                    </button>
                                </div>
                            </div>
                            <div class="add_task_submit_btn">
                                <button type="submit">
                                    <span>Create Task</span>
                                    <img src="../assets/svg/add_task/check_create_task.svg" alt="check">
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
`
}