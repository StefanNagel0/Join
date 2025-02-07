// Globales Array, das alle aktuell ausgewählten Kontakte speichert
let selectedContactsGlobal = [];



/** Create an element with initials circle based on contact's name */
function createInitialsCircle(contactName) {
    const circle = document.createElement('div');
    circle.classList.add('initials-circle');
    circle.textContent = getInitials(contactName);
    circle.style.backgroundColor = getContactColor(contactName); // Farbe aus Firebase
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


function toggleContactSelection(contact, isSelected, selectedContactsContainer) {
    if (isSelected) {
        if (!selectedContactsGlobal.includes(contact.name)) {
            selectedContactsGlobal.push(contact.name);
        }
    } else {
        selectedContactsGlobal = selectedContactsGlobal.filter(name => name !== contact.name);
    }
    console.log("Aktuell ausgewählte Kontakte (global):", selectedContactsGlobal);
    renderSelectedContacts(selectedContactsGlobal, selectedContactsContainer);
}


/** Update the list of selected contacts */
// function toggleContactSelection(contact, isSelected, selectedContactsContainer) {
//     const circle = createInitialsCircle(contact.name);
//     if (isSelected) {
//         const selectedContact = createElementWithClass('div', 'selected-contact');
//         selectedContact.dataset.fullname = contact.name;
//         selectedContact.append(circle);
//         selectedContactsContainer.append(selectedContact);
//     } else {
//         const selectedCircles = selectedContactsContainer.querySelectorAll('.selected-contact');
//         selectedCircles.forEach(contactElement => {
//             if (contactElement.querySelector('.initials-circle').textContent === circle.textContent) {
//                 selectedContactsContainer.removeChild(contactElement);
//             }
//         });
//     }
// }

/**Renders selected contacts with a maximum of 4 visible circles.*/
function renderSelectedContacts(selectedContacts, container) {
    container.innerHTML = ''; // Container leeren
    const maxDisplayed = 4;
    const displayedContacts = selectedContacts.slice(0, maxDisplayed);
    const hiddenCount = selectedContacts.length - maxDisplayed;
    
    // Anzeige der ersten maxDisplayed Kontakte
    displayedContacts.forEach(contactName => {
        const circle = createInitialsCircle(contactName);
        const selectedContact = createElementWithClass('div', 'selected-contact');
        selectedContact.dataset.fullname = contactName;
        selectedContact.append(circle);
        container.append(selectedContact);
    });
    
    // Wenn es mehr als maxDisplayed Kontakte gibt, "+X" anzeigen
    if (hiddenCount > 0) {
        let extraIndicator = container.querySelector('.extra-contacts');
        if (!extraIndicator) {
            extraIndicator = createElementWithClass('div', 'extra-contacts');
            container.append(extraIndicator);
        }
        extraIndicator.textContent = `+${hiddenCount}`;
    } else {
        let extraIndicator = container.querySelector('.extra-contacts');
        if (extraIndicator) {
            extraIndicator.remove();
        }
    }
}


/** Retrieves the list of selected contacts' full names. */
function getSelectedContacts() {
    const selectedContacts = Array.from(document.querySelectorAll('#selected-contacts .selected-contact'))
        .map(el => el.dataset.fullname);
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
async function initializeContactsDropdown() {
    const container = document.getElementById('task-assigned');
    if (!container) return console.error("#task-assigned not found.");
    if (!contacts || contacts.length === 0) {
        await syncContacts();
    }
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

/** Adds a click listener that hides the `content` element */
function addOutsideClickListener(wrapper, content) {
    document.addEventListener('click', (event) => {
        if (!wrapper.contains(event.target)) {
            content.style.display = 'none';
            wrapper.querySelector('.dropdown-toggle').classList.remove('open');
        }
    });
}

/** Generate a random color for a contact*/
function getContactColor(name) {
    const contact = contacts.find(contact => contact.name === name);
    if (contact && contact.color) {
        return contact.color; 
    } else {
        return "#CCCCCC";
    }
}