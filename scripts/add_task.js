let tasks = [];
const contactColors = new Map();
let selectedPriority = null;

/** Initialize the application by setting up necessary components */
function initializeApp() {
    initializeContactsDropdown();
    initializePriorityButtons();
    initializeSubtasks();
    setDateValidation();
    initializeClearButton();
    preventFormSubmissionOnEnter();
    initHeader()
}

/** Set validation for the date input to ensure it's not in the past */
function setDateValidation() {
    const today = getCurrentDate();
    const maxDateString = getMaxDateString();
    applyValidation(today, maxDateString);
    observeDomChanges(today, maxDateString);
}

/** Returns the current date in YYYY-MM-DD format. */
function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

/** Returns a date string for a date 100 years in the future in YYYY-MM-DD format.*/
function getMaxDateString() {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 100); // 100 Jahre in die Zukunft
    return maxDate.toISOString().split('T')[0];
}

/** Applies date validation to all task date input fields. */
function applyValidation(today, maxDateString) {
    const dateInputs = document.querySelectorAll('.task-date');
    dateInputs.forEach(dateInput => {
        setDateAttributes(dateInput, today, maxDateString);
        handleInputColorChange(dateInput);
    });
}

/** Sets the min and max attributes for a given date input. */
function setDateAttributes(dateInput, today, maxDateString) {
    dateInput.setAttribute('min', today);
    dateInput.setAttribute('max', maxDateString);
}

/**Changes the color of the date input based on its value.*/
function handleInputColorChange(dateInput) {
    dateInput.oninput = function () {
        dateInput.style.color = dateInput.value ? 'black' : '';
    };
}

/** Observes DOM changes and applies date validation for dynamically added date inputs. */
function observeDomChanges(today, maxDateString) {
    const observer = new MutationObserver(() => {
        applyValidation(today, maxDateString);
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

/** Initialize the subtasks input, add button, and clear button behaviors */
function initializeSubtasks() {
    const input = document.getElementById('new-subtask');
    const addBtn = document.getElementById('add-subtask');
    const clearBtn = document.getElementById('clear-subtask');
    const list = document.getElementById('subtask-list');
    input.oninput = () => clearBtn.classList.toggle('d-none', !input.value.trim());
    clearBtn.onclick = () => (input.value = '') && clearBtn.classList.add('d-none');
    addBtn.onclick = () => addSubtask(input, list);
    input.onkeydown = function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addSubtask(input, list);
        }
    };
}

/**Create an icon element with specified attributes */
function createIcon(src, alt, className) {
    const icon = document.createElement('img');
    icon.src = src;
    icon.alt = alt;
    icon.classList.add(className);
    return icon;
}

/** Toggle visibility of edit, delete, and save icons for subtasks */
function toggleIcons(pencilIcon, trashIcon, checkIcon, editMode) {
    if (editMode) {
        pencilIcon.classList.add('d-none');
        trashIcon.classList.add('d-none');
        checkIcon.classList.remove('d-none');
    } else {
        pencilIcon.classList.remove('d-none');
        trashIcon.classList.remove('d-none');
        checkIcon.classList.add('d-none');
    }
}

/** Edit the subtask in the subtask list */
function editSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon) {
    subtaskElement.classList.add('editing');
    pencilIcon.classList.add('d-none');
    checkIcon.classList.remove('d-none');
    subtaskElement.contentEditable = 'true';
    subtaskElement.focus();
    trashIcon.classList.add('editing')
    const marker = subtaskElement.querySelector('.subtask-marker');
    if (marker) marker.style.display = "none";
}

/** Save the edited subtask */
function saveSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon) {
    subtaskElement.classList.remove('editing');
    pencilIcon.classList.remove('d-none');
    checkIcon.classList.add('d-none');
    subtaskElement.contentEditable = 'false';
    trashIcon.classList.remove('editing');
    const marker = subtaskElement.querySelector('.subtask-marker');
    if (marker) marker.style.display = 'inline';
}

/** Add a subtask to the list */
function addSubtask(input, list) {
    const task = input.value.trim();
    if (!task) return;
    const subtaskElement = createSubtaskElement(task);
    list.appendChild(subtaskElement);
    input.value = '';
    toggleClearButtonVisibility();
}

/**Observes DOM changes and applies date validation for dynamically added date inputs.*/
function createSubtaskElement(task) {
    const subtaskElement = document.createElement('li');
    subtaskElement.classList.add('subtask-item');
    subtaskElement.innerHTML = createSubtaskHTML(task);
    const pencilIcon = subtaskElement.querySelector('.subtask-edit');
    const trashIcon = subtaskElement.querySelector('.subtask-trash');
    const checkIcon = subtaskElement.querySelector('.subtask-check');
    pencilIcon.onclick = () => editSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon);
    checkIcon.onclick = () => saveSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon);
    trashIcon.onclick = () => subtaskElement.remove();
    return subtaskElement;
}

/**Hides the "clear" button for subtasks.*/
function toggleClearButtonVisibility() {
    const clearBtn = document.getElementById('clear-subtask');
    if (clearBtn) clearBtn.classList.add('d-none');
}

/** Initialize the priority buttons */
function initializePriorityButtons() {
    document.querySelectorAll('.prio-btn').forEach(btn =>
        btn.onclick = () => {
            document.querySelectorAll('.prio-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedPriority = btn.dataset.prio;
        }
    );
    const mediumBtn = document.querySelector('.prio-btn[data-prio="medium"]');
    if (mediumBtn) {
        mediumBtn.classList.add('active');
        selectedPriority = mediumBtn.dataset.prio;
    }
}

/** Toggle dropdown visibility */
function toggleDropdown(event, toggle, options) {
    event.stopPropagation();
    const visible = options.classList.contains('visible');
    options.classList.toggle('visible', !visible);
    options.classList.toggle('hidden', visible);
    toggle.classList.toggle('open', !visible);
}

/** Initialize the category dropdown functionality */
function initializeCategoryDropdown() {
    const categoryToggle = document.getElementById('dropdown-toggle-category');
    const categoryContent = document.getElementById('dropdown-options-category');
    categoryToggle.onclick = (event) => {
        event.stopPropagation();
        const isVisible = categoryContent.classList.contains('visible');
        categoryContent.classList.toggle('visible', !isVisible);
        categoryContent.classList.toggle('hidden', isVisible);
        categoryToggle.classList.toggle('open', !isVisible);
    };
}

// /** Select a dropdown option */
function selectDropdownOption(event, dropdown, option) {
    const selectedCategory = option.getAttribute('data-category');
    dropdown.querySelector('span').textContent = selectedCategory;
    document.getElementById('category-error').classList.add('hidden');
    document.getElementById('dropdown-toggle-category').classList.remove('error');
    const categoryContent = document.getElementById('dropdown-options-category');
    categoryContent.classList.remove('visible');
    categoryContent.classList.add('hidden');
    dropdown.classList.remove('open');
}

/** Prevent form submission when Enter is pressed */
function preventFormSubmissionOnEnter() {
    const form = document.getElementById('task-form');
    form.onkeydown = function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };
}

function getSubtasksFromForm(form) {
    const subtaskList = form.querySelector('#subtask-list');
    const subtasks = [];
    if (!subtaskList) {
        return subtasks;
    }
    subtaskList.querySelectorAll('li').forEach((li) => {
        const textElement = li.querySelector('.subtask-text') || li;
        const text = textElement.textContent.trim();
        if (text) {
            subtasks.push({
                text: text,
                completed: li.classList.contains('completed'),
            });
        }
    });
    return subtasks;
}

// /** Create the task object from the form data */
function createTaskObject(form) {
    const task = {
        title: form.querySelector('#task-title').value.trim(),
        description: form.querySelector('#task-desc').value.trim(),
        dueDate: form.querySelector('#task-date').value,
        priority: document.getElementById('task-priority').getAttribute('data-priority') || 'Medium',
        category: document.querySelector('#dropdown-toggle-category span').textContent,
        assignedTo: getSelectedContacts(), // Hole die ausgewählten Kontakte
        subtasks: getSubtasksFromForm(form),
        createdAt: new Date().toISOString(),
        mainCategory: 'ToDo', // Standardkategorie hinzufügen
    };
    return task;
}

/** Reset the form and show a notification */
function resetFormAndNotify(form) {
    form.reset();
}

/** Utility function to create an element with class */
function createElementWithClass(tagName, className, textContent = '', children = [], id = '') {
    const element = document.createElement(tagName);
    if (className) element.classList.add(className);
    if (textContent) element.textContent = textContent;
    if (id) element.id = id;
    children.forEach(child => element.appendChild(child));
    return element;
}

/** Utility function: Generate a random color */
function getRandomDarkColor() {
    let color;
    do {
        color = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);
        if ((r * 0.299 + g * 0.587 + b * 0.114) < 128) {
            break;
        }
    } while (true);
    return `#${color}`;
}

/** Clear the task form by resetting all form fields and UI elements to their initial state */
function clearForm() {
    resetField('task-title');
    resetField('task-desc');
    resetField('task-date');
    resetPriority();
    resetCategory();
    resetSubtasks();
    resetContacts();
    resetDropdown();
}

/** Resets the value of a given form field by its ID.*/
function resetField(id) {
    const field = document.getElementById(id);
    if (field) field.value = '';
}

/**Resets the priority of the task to "medium".*/
function resetPriority() {
    document.querySelectorAll('.prio-btn').forEach(btn => btn.classList.remove('active'));
    const mediumBtn = document.querySelector('.prio-btn[data-prio="medium"]');
    if (mediumBtn) {
        mediumBtn.classList.add('active');
        selectedPriority = mediumBtn.dataset.prio;
    }
}

/**Resets the task category dropdown to its default value.*/
function resetCategory() {
    const categoryText = document.querySelector('#dropdown-toggle-category span');
    if (categoryText) categoryText.textContent = 'Select task category';
}

/**Resets the list of subtasks to an empty state.*/
function resetSubtasks() {
    const subtaskList = document.getElementById('subtask-list');
    if (subtaskList) subtaskList.innerHTML = '';
}

/**Resets the selected contacts container to an empty state.*/
function resetContacts() {
    const selectedContactsContainer = document.getElementById('selected-contacts');
    if (selectedContactsContainer) selectedContactsContainer.innerHTML = '';
}

/**Resets the task category dropdown and hides the dropdown content.*/
function resetDropdown() {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    if (dropdownToggle) {
        const span = dropdownToggle.querySelector('span');
        if (span) span.textContent = 'Select contacts to assign';
    }
    const dropdownContent = document.getElementById('dropdown-content');
    if (dropdownContent) dropdownContent.style.display = 'none';
}

/** Initialize the "Clear" button behavior*/
function initializeClearButton() {
    const clearButton = document.querySelector('.add_task_clear_btn');
    clearButton.onclick = (event) => {
        event.preventDefault();
        clearForm();
    };
}

/**Displays a confirmation message and redirects to the "board.html" page after 1.5 seconds.*/
function getToDoAddTaskPage(event) {
    event.preventDefault();
    const confirmationMessage = document.getElementById('confirmation-message');
    confirmationMessage.classList.add('show');
    setTimeout(() => {
        confirmationMessage.classList.remove('show');
        window.location.href = 'board.html';
    }, 1500);
}

/** Validates the task form fields (Title and Due Date) on submit. */
function validateTaskForm(event) {
    event.preventDefault();
    let isValid = true;
    const title = document.getElementById("task-title"),
        dueDate = document.getElementById("task-date");
    if (title.value.trim() === "") {
        title.classList.add("input-error");
        setErrorMessage(title, "Title is required");
        isValid = false;
    } else {
        title.classList.remove("input-error");
        clearErrorMessage(title);
    }
    if (dueDate.value.trim() === "") {
        dueDate.classList.add("input-error");
        setErrorMessage(dueDate, "Due Date is required");
        isValid = false;
    } else {
        dueDate.classList.remove("input-error");
        clearErrorMessage(dueDate);
    }
    if (isValid) {
        submitAddTask(event);
    }
}


/** Sets an error message below the input element. */
function setErrorMessage(element, message) {
    let error = element.parentElement.querySelector(".error-message");
    
    if (!error) {
        // If there's no existing error message, create one
        error = document.createElement("span");
        error.className = "error-message";
        element.parentElement.appendChild(error);
    }

    error.textContent = message;

    // Remove the error message and red border after 10 seconds
    setTimeout(() => {
        clearErrorMessage(element);
        element.classList.remove("input-error");
    }, 10000);
}

/** Clears the error message below the input element. */
function clearErrorMessage(element) {
    let error = element.parentElement.querySelector(".error-message");
    if (error) {
        error.remove();
    }
}

/** Check for valid fields and remove error messages once fields are populated. */
function clearErrorsOnValidInput() {
    const title = document.getElementById("task-title"),
        dueDate = document.getElementById("task-date");
    if (title.value.trim() !== "") {
        title.classList.remove("input-error");
        clearErrorMessage(title);
    }
    if (dueDate.value.trim() !== "") {
        dueDate.classList.remove("input-error");
        clearErrorMessage(dueDate);
    }
}