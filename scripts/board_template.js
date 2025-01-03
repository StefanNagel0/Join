function boardTemplate() {
    return `
    <div class="mainContent">
        <div class="contentHeading">
            <div class="contentHeadingMain">
                <div>
                    <h2 class="contentHeadingH2">Board</h2>
                </div>
                <div class="contenHeadingSearchMain">
                    <input class="contentHeadingSearch" type="search" id="search" placeholder="Search Task">
                    <img class="contentHeadingSearchImg" src="../assets/svg/searching.svg" alt="search">
                </div>
                <div class="content_headingRight">
                    <button class="addBoard" id="add_board" onclick="navigateToAddTask()">
                        <img src="../assets/icons/navbar/add_task.png" alt="add_task">
                    </button>
                </div>
            </div>
        </div>
        <div class="contentBoard">
            <div class="board">
                <div class="boardColumn">
                    <div class="boardColumnHeader">
                        <h3>Backlog</h3>
                    </div>
                </div>
                <div class="boardColumn">
                    <div class="boardColumnHeader">
                        <h3>In Progress</h3>
                    </div>
                </div>
                <div class="board_column">
                    <div class="boardColumnHeader">
                        <h3>Done</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}