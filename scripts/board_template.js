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
                        <Button class="addTaskButton">
                        <a href="add_task.html" class="addTaskButtonText">Add Task</a>
                            <img class="addTaskButtonImg" src="../assets/svg/add_task.svg" alt="">
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
                    <input class="boardAddTaskInput" type="image" src="../assets/svg/plusButton.svg" alt="">
                </div>
            </div>
            <div class="boardColumn">
                <div class="boardColumnHeader">
                    <h3 class="boardColumnHeaderH3">In progress</h3>
                    <input class="boardAddTaskInput" type="image" src="../assets/svg/plusButton.svg" alt="">
                </div>
            </div>
            <div class="boardColumn">
                <div class="boardColumnHeader">
                    <h3 class="boardColumnHeaderH3">Await feedback</h3>
                    <input onclick="add_task.js()" class="boardAddTaskInput" type="image" src="../assets/svg/plusButton.svg" alt="">
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