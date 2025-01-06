let tasks = []
const contactColors = new Map();

document.addEventListener('DOMContentLoaded', () => {
    initializeContactsDropdown();
});

// Hilfsfunktion zur Erstellung eines Initials-Kreises
function createInitialsCircle(contactName) {
    const initialsCircle = document.createElement('div');
    initialsCircle.classList.add('initials-circle');
    initialsCircle.textContent = getInitials(contactName);
    initialsCircle.style.backgroundColor = getContactColor(contactName);
    return initialsCircle;
}

// Hilfsfunktion zur Erstellung eines Kontakt-Divs

function createContactDiv(contact) {
    const initialsCircle = createInitialsCircle(contact.name);
    const contactLabel = document.createElement('span');
    contactLabel.textContent = contact.name;
    contactLabel.classList.add('contact-label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox');
    const contactCircleLabelDiv = document.createElement('div');
    contactCircleLabelDiv.classList.add('contact-circle-label');
    contactCircleLabelDiv.append(initialsCircle, contactLabel);
    const contactDiv = document.createElement('div');
    contactDiv.classList.add('contact-item');
    contactDiv.append(contactCircleLabelDiv, checkbox);
    // Klick-Event für Styling und Zustand
    contactDiv.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) {
            // Styling anwenden, wenn ausgewählt
            contactDiv.style.backgroundColor = '#2A3647';
            contactLabel.style.color = 'white';
            checkbox.style.accentColor = 'white';
            checkbox.style.backgroundColor = "#2A3647";
            initialsCircle.style.border = "1px solid white";
        } else {
            // Styling entfernen, wenn nicht ausgewählt
            contactDiv.style.backgroundColor = '';
            contactLabel.style.color = '';
            checkbox.style.accentColor = '';
            checkbox.style.backgroundColor='';
            initialsCircle.style.border='';
        }
        // Optionale Funktion: Kontakt hinzufügen/entfernen
        toggleContactSelection(contact, checkbox.checked, document.getElementById('selected-contacts'));
    });
    return contactDiv;
}


// function createContactDiv(contact) {
//     const initialsCircle = createInitialsCircle(contact.name);
//     const contactLabel = document.createElement('span');
//     contactLabel.textContent = contact.name;
//     contactLabel.classList.add('contact-label');
//     const checkbox = document.createElement('input');
//     checkbox.type = 'checkbox';
//     checkbox.classList.add('checkbox');
//     const contactCircleLabelDiv = document.createElement('div');
//     contactCircleLabelDiv.classList.add('contact-circle-label');
//     contactCircleLabelDiv.append(initialsCircle, contactLabel);
//     const contactDiv = document.createElement('div');
//     contactDiv.classList.add('contact-item');
//     contactDiv.append(contactCircleLabelDiv, checkbox);
//     contactDiv.addEventListener('click', () => {
//         checkbox.checked = !checkbox.checked;
//         if (checkbox.checked) {
//             contactDiv.classList.add('active'); // Hintergrund und Schriftfarbe ändern
//         } else {
//             contactDiv.classList.remove('active'); // Standard-Styling zurücksetzen
//         }
//         toggleContactSelection(contact, checkbox.checked, document.getElementById('selected-contacts'));
//     });
//     return contactDiv;
// }


// Hilfsfunktion zur Erstellung des Dropdown-Menüs

function createDropdownToggle(dropdownContent) {
    const dropdownToggle = document.createElement('div');
    dropdownToggle.id = 'dropdown-toggle';

    const textSpan = document.createElement('span');
    textSpan.textContent = 'Select contacts to assign';

    const arrowSpan = document.createElement('span');
    arrowSpan.classList.add('dropdown-arrow');

    dropdownToggle.append(textSpan, arrowSpan);

    dropdownToggle.addEventListener('click', () => {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });
    return dropdownToggle;
}

// Hilfsfunktion zur Schließung des Dropdown-Menüs beim Klick außerhalb
function addOutsideClickListener(dropdownWrapper, dropdownContent) {
    document.addEventListener('click', event => {
        if (!dropdownWrapper.contains(event.target)) {
            dropdownContent.style.display = 'none';
        }
    });
}

// Hauptfunktion zur Initialisierung des Dropdown-Menüs
function initializeContactsDropdown() {
    const dropdownContainer = document.getElementById('task-assigned');
    const selectedContactsContainer = document.createElement('div');
    selectedContactsContainer.id = 'selected-contacts';
    dropdownContainer.parentElement.appendChild(selectedContactsContainer);
    const dropdownWrapper = document.createElement('div');
    dropdownWrapper.id = 'dropdown-wrapper';
    const dropdownContent = document.createElement('div');
    dropdownContent.id = 'dropdown-content';
    contacts.forEach(contact => dropdownContent.appendChild(createContactDiv(contact)));
    dropdownWrapper.append(createDropdownToggle(dropdownContent), dropdownContent);
    addOutsideClickListener(dropdownWrapper, dropdownContent);
    dropdownContainer.parentElement.replaceChild(dropdownWrapper, dropdownContainer);
}

function getInitials(name) {
    const [firstName, lastName] = name.split(' ');
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getSelectedDiv(container, initials) {
    return Array.from(container.children).find(child => child.textContent === initials);
}

function addOrRemoveSelectedDiv(contact, isSelected, container) {
    const initials = getInitials(contact.name);
    const selectedDiv = getSelectedDiv(container, initials);
    if (isSelected) {
        if (!selectedDiv) {
            const newDiv = document.createElement('div');
            newDiv.classList.add('selected-contact');
            newDiv.textContent = initials;
            newDiv.style.backgroundColor = getContactColor(contact.name);
            container.appendChild(newDiv);
        }
    } else {
        if (selectedDiv) {
            container.removeChild(selectedDiv);
        }
    }
}

function toggleContactSelection(contact, isSelected, container) {
    addOrRemoveSelectedDiv(contact, isSelected, container);
}

// Initialize priority buttons
function initializePriorityButtons() {
    const priorityButtons = document.querySelectorAll('.prio-btn');
    const priorityHiddenInput = document.getElementById('task-priority-hidden');
    priorityButtons.forEach(button => {
        button.addEventListener('click', () => {
            priorityButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            priorityHiddenInput.value = button.dataset.prio;
        });
    });
}

// Subtasks functionality
function initializeSubtasks() {
    const subtaskContainer = document.getElementById('subtask-container');
    const subtaskInput = document.getElementById('new-subtask');
    const addSubtaskButton = document.getElementById('add-subtask');
    const subtaskList = document.getElementById('subtask-list');

    addSubtaskButton.addEventListener('click', () => {
        const subtask = subtaskInput.value.trim();
        if (subtask) {
            const li = document.createElement('li');
            li.textContent = subtask;
            subtaskList.appendChild(li);
            subtaskInput.value = '';
        }
    });
}

// Save task
function saveTask(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('task-form'));
    const task = {
        title: formData.get('title'),
        description: formData.get('description'),
        assignedTo: formData.get('assignedTo'),
        dueDate: formData.get('dueDate'),
        priority: formData.get('priority'),
        category: formData.get('category'),
        subtasks: Array.from(document.querySelectorAll('#subtask-list li')).map(li => li.textContent)
    };

    // Save task to local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Clear form and confirm
    document.getElementById('task-form').reset();
    document.getElementById('subtask-list').innerHTML = '';
    alert('Task saved!');
}

function getContactColor(contactName) {
    if (!contactColors.has(contactName)) {
        contactColors.set(contactName, getRandomColor());
    }
    return contactColors.get(contactName);
}