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
}

/** Create an element with initials circle based on contact's name */
function createInitialsCircle(contactName) {
    const circle = document.createElement('div');
    circle.classList.add('initials-circle');
    circle.textContent = getInitials(contactName);
    circle.style.backgroundColor = getContactColor(contactName);
    return circle;
}

/** Create a contact div with a circle, label, and checkbox */
function createContactDiv(contact) {
    const circle = createInitialsCircle(contact.name);
    const label = createElementWithClass('span', 'contact-label', contact.name);
    const checkbox = createElementWithClass('input', 'checkbox');
    checkbox.type = 'checkbox';
    const container = createElementWithClass('div', 'contact-item');
    const circleLabelDiv = createElementWithClass('div', 'contact-circle-label', '', [circle, label]);
    container.append(circleLabelDiv, checkbox);
    container.dataset.fullname = contact.name;
    container.onclick = () => toggleContactDiv(container, checkbox, label, circle, contact);
    return container;
}

/** Toggle contact selection and update UI */
function toggleContactDiv(container, checkbox, label, circle, contact) {
    checkbox.checked = !checkbox.checked;
    container.classList.toggle('selected', checkbox.checked);
    toggleContactSelection(contact, checkbox.checked, document.getElementById('selected-contacts'));
}

/** Update the list of selected contacts */
function toggleContactSelection(contact, isSelected, selectedContactsContainer) {
    const circle = createInitialsCircle(contact.name);
    if (isSelected) {
        console.log('Adding contact:', contact.name); // Log, wenn Kontakt hinzugefügt wird
        const selectedContact = createElementWithClass('div', 'selected-contact');
        selectedContact.dataset.fullname = contact.name;  // Speichert den vollen Namen
        selectedContact.append(circle);
        selectedContactsContainer.append(selectedContact);
    } else {
        console.log('Removing contact:', contact.name); // Log, wenn Kontakt entfernt wird
        const selectedCircles = selectedContactsContainer.querySelectorAll('.selected-contact');
        selectedCircles.forEach(contactElement => {
            if (contactElement.querySelector('.initials-circle').textContent === circle.textContent) {
                selectedContactsContainer.removeChild(contactElement);
            }
        });
    }
}
function getSelectedContacts() {
    const selectedContacts = Array.from(document.querySelectorAll('#selected-contacts .selected-contact'))
        .map(el => el.dataset.fullname);  // Hole den vollen Namen aus dem data-fullname Attribut
    console.log('Selected contacts:', selectedContacts);  // Überprüfe, ob die Liste der vollen Namen korrekt ist
    return selectedContacts;
}


/** Create a dropdown wrapper element */
function createDropdownWrapper() {
    const wrapper = createElementWithClass('div', 'dropdown-wrapper');
    const content = createElementWithClass('div', 'dropdown-content');
    const toggle = createDropdownToggle(content);
    wrapper.append(toggle, content);
    return { wrapper, content };
}

/** Create the dropdown toggle button */
function createDropdownToggle(dropdownContent) {
    const toggle = createElementWithClass('div', 'dropdown-toggle');
    const textSpan = createElementWithClass('span', '', 'Select contacts to assign');
    const arrowSpan = createElementWithClass('span', 'dropdown-arrow');
    toggle.append(textSpan, arrowSpan);
    toggle.onclick = () => {
        const isVisible = dropdownContent.style.display === 'block';
        dropdownContent.style.display = isVisible ? 'none' : 'block';
    };
    return toggle;
}

/** Initialize the contacts dropdown with the contact list*/
function initializeContactsDropdown() {
    const container = document.getElementById('task-assigned');
    if (!container) return console.error("#task-assigned not found.");
    const { wrapper, content } = createDropdownWrapper();
    const selectedContacts = createElementWithClass('div', 'selected-contacts', '', [], 'selected-contacts');
    contacts.forEach(contact => content.append(createContactDiv(contact)));
    const dropdownToggle = wrapper.querySelector('.dropdown-toggle');
    dropdownToggle.onclick = () => {
        const dropdownContent = wrapper.querySelector('.dropdown-content');
        const isVisible = dropdownContent.style.display === 'block';
        dropdownContent.style.display = isVisible ? 'none' : 'block';
        dropdownToggle.classList.toggle('open', !isVisible);
    };
    addOutsideClickListener(wrapper, content);
    container.replaceWith(wrapper);
    wrapper.append(selectedContacts);
}

/** Add an event listener for clicks outside the dropdown to close it */
function addOutsideClickListener(wrapper, content) {
    document.onclick = event => {
        if (!wrapper.contains(event.target)) {
            content.style.display = 'none';
            wrapper.querySelector('.dropdown-toggle').classList.remove('open');
        }
    };
}

/** Generate a random color for a contact*/
function getContactColor(name) {
    if (!contactColors.has(name)) contactColors.set(name, getRandomColor());
    return contactColors.get(name);
}

/** Set validation for the date input to ensure it's not in the past */
function setDateValidation() {
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 100); // 100 Jahre in die Zukunft
    const maxDateString = maxDate.toISOString().split('T')[0];
    // Funktion anwenden auf alle bestehenden Inputs
    const applyValidation = () => {
        const dateInputs = document.querySelectorAll('.task-date');
        dateInputs.forEach(dateInput => {
            dateInput.setAttribute('min', today); // Minimal erlaubtes Datum
            dateInput.setAttribute('max', maxDateString); // Maximal erlaubtes Datum
            dateInput.oninput = function () {
                if (dateInput.value) {
                    dateInput.style.color = 'black';
                } else {
                    dateInput.style.color = '';
                }
            };
        });
    };
    applyValidation();
    // MutationObserver für dynamisch hinzugefügte Elemente
    const observer = new MutationObserver(() => {
        applyValidation();
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
    if(marker) marker.style.display = "none";
}

/** Save the edited subtask */
function saveSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon) {
    subtaskElement.classList.remove('editing');
    pencilIcon.classList.remove('d-none');
    checkIcon.classList.add('d-none');
    subtaskElement.contentEditable = 'false';
    trashIcon.classList.remove('editing');
    const marker = subtaskElement.querySelector('.subtask-marker');
    if(marker) marker.style.display = 'inline';
}

/** Create the HTML for a subtask element */
function createSubtaskHTML(task) {
    return `
    <div>
    <span class="subtask-marker">• </span>${task}
    </div>
        <div class="subtask-controls">
            <img src="../assets/svg/summary/pencil2.svg" alt="Edit" class="subtask-edit">
            <img src="../assets/svg/add_task/trash.svg" alt="Delete" class="subtask-trash">
            <img src="../assets/svg/add_task/check_create_task.svg" alt="Save" class="subtask-check d-none">
        </div>`;
}


/** Add a subtask to the list */
function addSubtask(input, list) {
    const task = input.value.trim();
    if (!task) return;
    const subtaskElement = document.createElement('li');
    subtaskElement.classList.add('subtask-item');
    subtaskElement.innerHTML = createSubtaskHTML(task);
    const pencilIcon = subtaskElement.querySelector('.subtask-edit');
    const trashIcon = subtaskElement.querySelector('.subtask-trash');
    const checkIcon = subtaskElement.querySelector('.subtask-check');
    pencilIcon.onclick = () => editSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon);
    checkIcon.onclick = () => saveSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon);
    trashIcon.onclick = () => subtaskElement.remove();
    list.appendChild(subtaskElement);
    input.value = '';
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

/** Select a dropdown option */
function selectDropdownOption(event, toggle, option) {
    const category = option.textContent;
    toggle.querySelector('span').textContent = category;
    option.parentElement.classList.remove('visible');
    option.parentElement.classList.add('hidden');
    toggle.classList.remove('open');
    document.querySelector('#dropdown-toggle-category span').textContent = category;
}

/** Handle the task submission to the database */
async function postTaskToDatabase(event) {
    event.preventDefault();
    const form = document.getElementById('task-form');
    const category = document.querySelector('#dropdown-toggle-category span')?.textContent;
    if (!category || category === 'Select task category') {
        alert('Please select a category.');
        return;
    }
    const task = createTaskObject(form);
    try {
        await uploadTaskToFirebase(task);
        resetFormAndNotify(form);
    } catch (error) {
        console.error('Error uploading task', error);
        alert('Error saving the task.');
    }
}

/** Prevent form submission when Enter is pressed */
function preventFormSubmissionOnEnter() {
    const form = document.getElementById('task-form');
    form.onkeydown = function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };
}

/** Create the task object from the form data */
function createTaskObject(form) {
    const formData = new FormData(form);
    return {
        title: formData.get('title'),
        description: formData.get('description'),
        dueDate: formData.get('dueDate'),
        priority: selectedPriority,
        category: document.querySelector('#dropdown-toggle-category span')?.textContent || null,
        assignedTo: getSelectedContacts(),
        subtasks: Array.from(document.querySelectorAll('#subtask-list li')).map(li => li.textContent),
    };
}

/** Upload the task object to Firebase */
async function uploadTaskToFirebase(task) {
    const response = await fetch(`${BASE_URL}/tasks.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    if (!response.ok) {
        throw new Error(`Error saving task: ${response.statusText}`);
    }
}

/** Reset the form and show a notification */
function resetFormAndNotify(form) {
    form.reset();
    alert('Task successfully saved to Firebase!');
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
    const taskTitle = document.getElementById('task-title');
    if (taskTitle) taskTitle.value = '';
    const taskDesc = document.getElementById('task-desc');
    if (taskDesc) taskDesc.value = '';
    const taskDate = document.getElementById('task-date');
    if (taskDate) taskDate.value = '';
    document.querySelectorAll('.prio-btn').forEach(btn => btn.classList.remove('active'));
    const mediumBtn = document.querySelector('.prio-btn[data-prio="medium"]');
    if (mediumBtn) {
        mediumBtn.classList.add('active');
        selectedPriority = mediumBtn.dataset.prio;}
    const categoryText = document.querySelector('#dropdown-toggle-category span');
    if (categoryText) categoryText.textContent = 'Select task category';
    const subtaskList = document.getElementById('subtask-list');
    if (subtaskList) subtaskList.innerHTML = '';
    const selectedContactsContainer = document.getElementById('selected-contacts');
    if (selectedContactsContainer) selectedContactsContainer.innerHTML = '';
    const dropdownToggle = document.getElementById('dropdown-toggle');
    if (dropdownToggle) {
        const span = dropdownToggle.querySelector('span');
        if (span) span.textContent = 'Select contacts to assign';}
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

function getToDoAddTaskPage(event) {
    event.preventDefault(); // Verhindert die Standardaktion des Formulars

    // Aufgabe speichern (du kannst hier deinen Code zur Speicherung hinzufügen)
    console.log('Task submitted');

    // Bestätigungsnachricht anzeigen
    const confirmationMessage = document.getElementById('confirmation-message');
    confirmationMessage.classList.add('show');

    // Nach 1,5 Sekunden weiterleiten und Nachricht ausblenden
    setTimeout(() => {
        confirmationMessage.classList.remove('show');
        window.location.href = 'board.html'; // Weiterleitung zur board.html
    }, 1500);
}