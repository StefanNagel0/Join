let tasks = [];
const contactColors = new Map();
let selectedPriority = null;

function initializeApp() {
    initializeContactsDropdown();
    initializePriorityButtons();
    initializeSubtasks();
    setDateValidation();
    initializeClearButton();
    document.querySelector('.add_task_submit_btn button').onclick = postTaskToDatabase;
}

// Helper function: Create initials circle
function createInitialsCircle(contactName) {
    const circle = document.createElement('div');
    circle.classList.add('initials-circle');
    circle.textContent = getInitials(contactName);
    circle.style.backgroundColor = getContactColor(contactName);
    return circle;
}

// Helper function: Create contact div
function createContactDiv(contact) {
    const circle = createInitialsCircle(contact.name);
    const label = createElementWithClass('span', 'contact-label', contact.name);
    const checkbox = createElementWithClass('input', 'checkbox');
    checkbox.type = 'checkbox';
    const container = createElementWithClass('div', 'contact-item');
    const circleLabelDiv = createElementWithClass('div', 'contact-circle-label', '', [circle, label]);
    container.append(circleLabelDiv, checkbox);
    container.onclick = () => toggleContactDiv(container, checkbox, label, circle, contact);
    return container;
}

// Helper function: Toggle styling and selection
function toggleContactDiv(container, checkbox, label, circle, contact) {
    checkbox.checked = !checkbox.checked;
    container.classList.toggle('selected', checkbox.checked);
    toggleContactSelection(contact, checkbox.checked, document.getElementById('selected-contacts'));
}

// Helper function: Toggle contact selection
function toggleContactSelection(contact, isSelected, selectedContactsContainer) {
    const circle = createInitialsCircle(contact.name);
    if (isSelected) {
        const selectedContact = createElementWithClass('div', 'selected-contact');
        selectedContact.append(circle);
        selectedContactsContainer.append(selectedContact);
    } else {
        const selectedCircles = selectedContactsContainer.querySelectorAll('.selected-contact');
        selectedCircles.forEach(contactElement => {
            if (contactElement.querySelector('.initials-circle').textContent === circle.textContent) {
                selectedContactsContainer.removeChild(contactElement);
            }
        });
    }
}

// Helper function: Create dropdown contents and wrapper
function createDropdownWrapper() {
    const wrapper = createElementWithClass('div', 'dropdown-wrapper');
    const content = createElementWithClass('div', 'dropdown-content');
    const toggle = createDropdownToggle(content);
    wrapper.append(toggle, content);
    return { wrapper, content };
}

// Helper function: Create dropdown toggle
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

function addOutsideClickListener(wrapper, content) {
    document.onclick = event => {
        if (!wrapper.contains(event.target)) {
            content.style.display = 'none';
            wrapper.querySelector('.dropdown-toggle').classList.remove('open'); // Pfeil zurückdrehen
        }
    };
}

// Helper function: Generate contact color
function getContactColor(name) {
    if (!contactColors.has(name)) contactColors.set(name, getRandomColor());
    return contactColors.get(name);
}

// Helper function: Validate date in input field and set the min attribute
function setDateValidation() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('task-date');
    dateInput.setAttribute('min', today);
    dateInput.oninput = function () {
        if (dateInput.value) {
            dateInput.style.color = 'black';
        } else {
            dateInput.style.color = '';
        }
    };
}

// Helper function: Initialize subtasks
function initializeSubtasks() {
    const input = document.getElementById('new-subtask');
    const addBtn = document.getElementById('add-subtask');
    const clearBtn = document.getElementById('clear-subtask');
    const list = document.getElementById('subtask-list');
    input.oninput = () => clearBtn.classList.toggle('d-none', !input.value.trim());
    clearBtn.onclick = () => (input.value = '') && clearBtn.classList.add('d-none');
    addBtn.onclick = () => addSubtask(input, list);
    input.onkeydown = e => e.key === 'Enter' && addSubtask(input, list);
}

// Helper function: Create an image element with specified attributes
function createIcon(src, alt, className) {
    const icon = document.createElement('img');
    icon.src = src;
    icon.alt = alt;
    icon.classList.add(className);
    return icon;
}

// Helper function: Toggle visibility of icons (Pencil, Trash, Check)
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

// Helper function: Edit the subtask
function editSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon) {
    pencilIcon.classList.add('d-none');
    checkIcon.classList.remove('d-none');
    subtaskElement.contentEditable = 'true';
    subtaskElement.focus();
    trashIcon.classList.add('editing')
}

// Helper function: Save the edited subtask
function saveSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon) {
    pencilIcon.classList.remove('d-none');
    checkIcon.classList.add('d-none');
    subtaskElement.contentEditable = 'false';
    trashIcon.classList.remove('editing');
}

function createSubtaskHTML(task) {
    return `${task}<div class="subtask-controls">
        <img src="../assets/svg/summary/pencil2.svg" alt="Edit" class="subtask-edit">
        <img src="../assets/svg/add_task/trash.svg" alt="Delete" class="subtask-trash">
        <img src="../assets/svg/add_task/check_create_task.svg" alt="Save" class="subtask-check d-none">
    </div>`;
}

// Helper function: Add a subtask to the list
function addSubtask(input, list) {
    const task = input.value.trim();
    if (!task) return;
    const subtaskElement = document.createElement('li');
    subtaskElement.classList.add('subtask-item');
    subtaskElement.textContent = task;
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('subtask-controls');
    const pencilIcon = createIcon("../assets/svg/summary/pencil2.svg", "Edit", 'subtask-edit');
    const trashIcon = createIcon("../assets/svg/add_task/trash.svg", "Delete", 'subtask-trash');
    const checkIcon = createIcon("../assets/svg/add_task/check_create_task.svg", "Save", 'subtask-check');
    checkIcon.classList.add('d-none');
    controlsContainer.append(pencilIcon, trashIcon, checkIcon);
    subtaskElement.appendChild(controlsContainer);
    list.appendChild(subtaskElement);
    trashIcon.onclick = () => subtaskElement.remove();
    pencilIcon.onclick = () => editSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon);
    checkIcon.onclick = () => saveSubtask(subtaskElement, pencilIcon, trashIcon, checkIcon);
    subtaskElement.onmouseover = () => controlsContainer.classList.remove('d-none');
    subtaskElement.onmouseleave = () => {
        if (subtaskElement.contentEditable !== 'true') {
            controlsContainer.classList.add('d-none');
        }
    };
}

// Helper function: Initialize priority buttons
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
        selectedPriority = mediumBtn.dataset.prio; // Ensure the variable is updated
    }
}

// Helper function: Toggle dropdown
function toggleDropdown(event, toggle, options) {
    event.stopPropagation();
    const visible = options.classList.contains('visible');
    options.classList.toggle('visible', !visible);
    options.classList.toggle('hidden', visible);
    toggle.classList.toggle('open', !visible);
}

// Helper function: Initialize Category Dropdown
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

// Helper function: Select dropdown option
function selectDropdownOption(event, toggle, option) {
    const category = option.textContent;
    toggle.querySelector('span').textContent = category;
    option.parentElement.classList.remove('visible');
    option.parentElement.classList.add('hidden');
    toggle.classList.remove('open');
    document.querySelector('#dropdown-toggle-category span').textContent = category;
}

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

function preventFormSubmissionOnEnter() {
    const form = document.getElementById('task-form');
    form.onkeydown = function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };
}

// Helper function: Create the task object
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

// Helper function: Upload task to Firebase
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

// Helper function: Reset form and show notification
function resetFormAndNotify(form) {
    form.reset();
    alert('Task successfully saved to Firebase!');
}

// Helper function: Get selected contacts
function getSelectedContacts() {
    return Array.from(document.querySelectorAll('#selected-contacts .selected-contact'))
        .map(el => {
            const initialsCircle = el.querySelector('.initials-circle');
            const contactName = contacts.find(contact => getInitials(contact.name) === initialsCircle.textContent)?.name;
            return contactName || '';
        })
        .filter(Boolean);
}

// Utility function: Generate initials from name
function getInitials(name) {
    const [firstName, lastName] = name.split(' ');
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

// Utility function: Create an element with a class
function createElementWithClass(tag, className, text = '', children = [], id = '') {
    const el = document.createElement(tag);
    if (className) el.classList.add(className);
    if (text) el.textContent = text;
    if (id) el.id = id;
    children.forEach(child => el.appendChild(child));
    return el;
}

// Utility function: Generate a random color
function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function clearForm() {
    const taskTitle = document.getElementById('task-title');
    if (taskTitle) taskTitle.value = '';
    const taskDesc = document.getElementById('task-desc');
    if (taskDesc) taskDesc.value = '';
    const taskDate = document.getElementById('task-date');
    if (taskDate) taskDate.value = '';
    document.querySelectorAll('.prio-btn').forEach(btn => btn.classList.remove('active'));
    const categoryText = document.querySelector('#dropdown-toggle-category span');
    if (categoryText) categoryText.textContent = 'Select task category';
    const subtaskList = document.getElementById('subtask-list');
    if (subtaskList) subtaskList.innerHTML = '';
    const selectedContactsContainer = document.getElementById('selected-contacts');
    if (selectedContactsContainer) selectedContactsContainer.innerHTML = '';
    const dropdownToggle = document.getElementById('dropdown-toggle');
    if (dropdownToggle) {
        const span = dropdownToggle.querySelector('span');
        if (span) span.textContent = 'Select contacts to assign';
    }
    const dropdownContent = document.getElementById('dropdown-content');
    if (dropdownContent) dropdownContent.style.display = 'none';
}

// Initialize the "Clear" button behavior
function initializeClearButton() {
    const clearButton = document.querySelector('.add_task_clear_btn');
    clearButton.onclick = (event) => {
        event.preventDefault();
        clearForm();
    };
}
