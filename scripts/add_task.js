let tasks = [];
const contactColors = new Map();

function initializeApp() {
    initializeContactsDropdown();
    initializePriorityButtons();
    initializeSubtasks();
}

// Hilfsfunktion: Initials-Kreis erstellen
function createInitialsCircle(contactName) {
    const circle = document.createElement('div');
    circle.classList.add('initials-circle');
    circle.textContent = getInitials(contactName);
    circle.style.backgroundColor = getContactColor(contactName);
    return circle;
}

// Hilfsfunktion: Kontakt-Div erstellen
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

// Hilfsfunktion: Styling und Auswahl toggeln
function toggleContactDiv(container, checkbox, label, circle, contact) {
    checkbox.checked = !checkbox.checked;
    container.classList.toggle('selected', checkbox.checked);
    toggleContactSelection(contact, checkbox.checked, document.getElementById('selected-contacts'));
}

// Hilfsfunktion: Kontakt-Auswahl toggeln
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

// Hilfsfunktion: Dropdown-Inhalte und Wrapper erstellen
function createDropdownWrapper() {
    const wrapper = createElementWithClass('div', 'dropdown-wrapper');
    const content = createElementWithClass('div', 'dropdown-content');
    const toggle = createDropdownToggle(content);
    wrapper.append(toggle, content);
    return { wrapper, content };
}

// Hilfsfunktion: Dropdown-Toggle erstellen
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

// Hilfsfunktion: Dropdown-Initialisierung
function initializeContactsDropdown() {
    const container = document.getElementById('task-assigned');
    if (!container) return console.error("#task-assigned nicht gefunden.");
    const { wrapper, content } = createDropdownWrapper();
    const selectedContacts = createElementWithClass('div', 'selected-contacts', '', [], 'selected-contacts');
    contacts.forEach(contact => content.append(createContactDiv(contact)));
    addOutsideClickListener(wrapper, content);
    container.replaceWith(wrapper);
    wrapper.append(selectedContacts);
}

// Hilfsfunktion: Kontaktfarbe generieren
function getContactColor(name) {
    if (!contactColors.has(name)) contactColors.set(name, getRandomColor());
    return contactColors.get(name);
}

// Hilfsfunktion: Event-Delegation für Outside-Klick
function addOutsideClickListener(wrapper, content) {
    document.onclick = event => {
        if (!wrapper.contains(event.target)) content.style.display = 'none';
    };
}

// Hilfsfunktion: Subtasks initialisieren
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

// Hilfsfunktion: Subtask hinzufügen
function addSubtask(input, list) {
    const task = input.value.trim();
    if (!task) return;
    list.append(createElementWithClass('li', '', task));
    input.value = '';
    input.nextElementSibling.classList.add('d-none');
}

// Hilfsfunktion: Prioritätsbuttons initialisieren
function initializePriorityButtons() {
    document.querySelectorAll('.prio-btn').forEach(btn =>
        btn.onclick = () => {
            document.querySelectorAll('.prio-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedPriority = btn.dataset.prio;
        }
    );
}

// Hilfsfunktion: Dropdown toggeln
function toggleDropdown(event, toggle, options) {
    event.stopPropagation();
    const visible = options.classList.contains('visible');
    options.classList.toggle('visible', !visible);
    options.classList.toggle('hidden', visible);
    toggle.classList.toggle('open', !visible);
}

// Dropdown-Option auswählen
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
    const formData = new FormData(form);
    const category = document.querySelector('#dropdown-toggle-category span')?.textContent || null;
    const assignedTo = getSelectedContacts();
    const task = {
        title: formData.get('title'),
        description: formData.get('description'),
        dueDate: formData.get('dueDate'),
        priority: selectedPriority,
        category: category,
        assignedTo: assignedTo,
        subtasks: Array.from(document.querySelectorAll('#subtask-list li')).map(li => li.textContent),
    };

    try {
        const response = await fetch(`${BASE_URL}/tasks.json`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) {
            throw new Error(`Fehler beim Speichern der Aufgabe: ${response.statusText}`);
        }
        form.reset();
        alert('Task erfolgreich in Firebase gespeichert!');
    } catch (error) {
        console.error("Fehler beim Hochladen der Aufgabe",error);
        alert("Fehler beim Speichern der Aufgabe.");
    }
}


// // Hilfsfunktion: Aufgabe speichern
// function saveTask(event) {
//     event.preventDefault();
//     const form = document.getElementById('task-form');
//     const formData = new FormData(form);
//     const category = document.querySelector('#dropdown-toggle-category span')?.textContent || null;
//     const assignedTo = getSelectedContacts();
//     const task = {
//         title: formData.get('title'),
//         description: formData.get('description'),
//         dueDate: formData.get('dueDate'),
//         priority: selectedPriority,
//         category: category,
//         assignedTo: assignedTo,
//         subtasks: Array.from(document.querySelectorAll('#subtask-list li')).map(li => li.textContent),
//     };
//     tasks.push(task);
//     localStorage.setItem('tasks', JSON.stringify(tasks));
//     form.reset();
//     alert('Task saved!');
// }

// Hilfsfunktion: Ausgewählte Kontakte holen
function getSelectedContacts() {
    return Array.from(document.querySelectorAll('#selected-contacts .selected-contact'))
        .map(el => {
            const initialsCircle = el.querySelector('.initials-circle');
            const contactName = contacts.find(contact => getInitials(contact.name) === initialsCircle.textContent)?.name;
            return contactName || '';
        })
        .filter(Boolean);
}

// Utility: Initialen aus Namen generieren
function getInitials(name) {
    const [firstName, lastName] = name.split(' ');
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

// Utility: Element mit Klasse erstellen
function createElementWithClass(tag, className, text = '', children = [], id = '') {
    const el = document.createElement(tag);
    if (className) el.classList.add(className);
    if (text) el.textContent = text;
    if (id) el.id = id;
    children.forEach(child => el.appendChild(child));
    return el;
}

// Utility: Zufällige Farbe generieren
function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
