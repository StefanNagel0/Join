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


function initializeSubtasks() {
    const subtaskInput = document.getElementById('new-subtask');
    const addSubtaskButton = document.getElementById('add-subtask');
    const clearSubtaskButton = document.getElementById('clear-subtask');
    const subtaskList = document.getElementById('subtask-list');

    // Funktion, um das Eingabefeld zu leeren und den Placeholder anzuzeigen
    function clearInput() {
        subtaskInput.value = '';
        clearSubtaskButton.classList.add('d-none');
    }

    // Eingabeüberwachung für das Erscheinen/Verschwinden des "x"-Symbols
    subtaskInput.addEventListener('input', () => {
        if (subtaskInput.value.trim() !== '') {
            clearSubtaskButton.classList.remove('d-none');
        } else {
            clearSubtaskButton.classList.add('d-none');
        }
    });

    // "x"-Symbol klickt: Eingabefeld leeren
    clearSubtaskButton.addEventListener('click', clearInput);

    // Subtask hinzufügen bei "+" Klick oder Enter-Taste
    function addSubtask() {
        const subtask = subtaskInput.value.trim();
        if (subtask) {
            const li = document.createElement('li');
            li.textContent = subtask;
            subtaskList.appendChild(li);
            clearInput(); // Eingabefeld leeren
        }
    }

    // Klick auf das "+" Symbol
    addSubtaskButton.addEventListener('click', addSubtask);

    // Hinzufügen bei Enter-Taste
    subtaskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addSubtask();
        }
    });
}

// Initialisierung der Subtasks beim Laden der Seite
document.addEventListener('DOMContentLoaded', initializeSubtasks);




function saveTask(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('task-form'));

    // Hole die ausgewählte Kategorie aus dem Dropdown
    const categoryElement = document.querySelector('#dropdown-toggle-prio span');
    const category = categoryElement ? categoryElement.textContent : null;

    // Hole die zugewiesenen Personen (volle Namen)
    const assignedTo = Array.from(document.querySelectorAll('#selected-contacts .selected-contact'))
        .map(selectedContact => {
            // Finde den entsprechenden Namen aus den Kontaktdaten
            const initials = selectedContact.textContent;
            const contact = contacts.find(contact => getInitials(contact.name) === initials);
            return contact ? contact.name : null; // Rückgabe des vollständigen Namens, wenn gefunden
        })
        .filter(name => name !== null); // Filtere mögliche Null-Werte aus

    const task = {
        title: formData.get('title'),
        description: formData.get('description'),
        assignedTo: assignedTo.length > 0 ? assignedTo : null,
        dueDate: formData.get('dueDate'),
        priority: formData.get('priority'),
        category: category && category !== 'Select task category' ? category : null,
        subtasks: Array.from(document.querySelectorAll('#subtask-list li')).map(li => li.textContent)
    };
    console.log(task);
    
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


document.addEventListener("DOMContentLoaded", () => {
    const dropdownToggle = document.getElementById("dropdown-toggle-prio");
    const dropdownOptions = document.getElementById("dropdown-options");

    if (!dropdownToggle || !dropdownOptions) {
        console.error("Dropdown-Elemente nicht gefunden. Überprüfen Sie Ihre HTML-Struktur.");
        return;
    }

    // Dropdown öffnen/schließen
    dropdownToggle.addEventListener("click", (event) => {
        event.stopPropagation(); // Verhindert das Schließen durch Klick außerhalb
        const isVisible = dropdownOptions.classList.contains("visible");
        dropdownOptions.classList.toggle("visible", !isVisible);
        dropdownOptions.classList.toggle("hidden", isVisible);
        dropdownToggle.classList.toggle("open", !isVisible);
    });

    // Option auswählen
    dropdownOptions.addEventListener("click", (event) => {
        if (event.target.classList.contains("dropdown-option")) {
            const selectedText = event.target.textContent;
            dropdownToggle.querySelector("span").textContent = selectedText; // Text aktualisieren
            dropdownOptions.classList.remove("visible");
            dropdownOptions.classList.add("hidden");
            dropdownToggle.classList.remove("open");
        }
    });

    // Schließen des Dropdowns bei Klick außerhalb
    document.addEventListener("click", (event) => {
        if (!dropdownToggle.contains(event.target) && dropdownOptions.classList.contains("visible")) {
            dropdownOptions.classList.remove("visible");
            dropdownOptions.classList.add("hidden");
            dropdownToggle.classList.remove("open");
        }
    });
});


