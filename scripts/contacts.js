/**
 * Array of contact objects.
 * @type {Array<{id: number, name: string, phone: string, email: string, color?: string, firebaseKey?: string}>}
 */
let contacts = [];

/**
 * Index of the currently edited contact.
 * @type {number|null}
 */
let editIndex = null;

/**
 * Extracts the initials from a name string.
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials in uppercase.
 */
function getInitials(name) {
  const parts = name.split(" ");
  const initials = parts.map(part => part[0]).join("").toUpperCase();
  return initials;
}

/**
 * Sets up the edit contact overlay.
 * @param {number} index - Index of the contact to edit.
 */
function setupEditContact(index) {
  const elements = setNewContact();
  if (!contacts[index]) return; 
  const contact = contacts[index];
  populateEditContactFields(elements, contact);
  updateCircleAppearance(elements.circleDiv, contact);
  editIndex = index;
  updateContactDetailsAfterEdit()
}

/**
 * Populates the edit contact fields with the given contact data.
 * @param {Object} elements - UI elements for editing.
 * @param {Object} contact - Contact data.
 */
function populateEditContactFields(elements, contact) {
  elements.title.textContent = "Edit Contact";
  elements.nameInput.value = contact.name;
  elements.phoneInput.value = contact.phone;
  elements.emailInput.value = contact.email;

  elements.submitButton.innerHTML = `Save changes <img class="check" src="../assets/icons/contact/check.png">`;
  elements.cancelButton.innerHTML = `Cancel <img class="cancelicon" src="../assets/icons/contact/cancel.png">`;
  elements.cancelButton.setAttribute("onclick", "closeOverlay()"); 
}

/**
 * Updates the contact's display circle with initials and color.
 * @param {HTMLElement} circleDiv - The circle element.
 * @param {Object} contact - Contact data.
 */
function updateCircleAppearance(circleDiv, contact) {
  circleDiv.textContent = getInitials(contact.name);
  if (!contact.color) {
    contact.color = getRandomColor();
  }
  circleDiv.style.backgroundColor = contact.color; 
}

/**
 * Opens an overlay for editing or adding a contact.
 * @param {string} mode - Mode of the overlay ("edit" or "new").
 * @param {number|null} [index=null] - Index of the contact to edit (if applicable).
 */
function updateContactDetailsAfterEdit() {
  const detailsDiv = document.getElementById("contact-details");
  if (!detailsDiv) return;
  const openContactIndex = detailsDiv.getAttribute("data-contact-index");
  if (openContactIndex !== null) {
    const contactData = contacts[parseInt(openContactIndex)];
    if (contactData) {
      showContactDetails(parseInt(openContactIndex));
    }
  }
}

/**
 * Returns an object containing references to new contact form elements.
 * @returns {Object} UI elements for new contact form.
 */
function openOverlay(mode, index = null) {
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("hide");
  overlay.classList.add("show");
  overlay.style.display = "flex";

  if (mode === "edit") {
    setupEditContact(index);
  } else {
    setupNewContact();
  }
}

/**
 * Sets up the overlay for adding a new contact.
 */
function setNewContact() {
  return {
    title: document.querySelector(".overlay-left h1"),
    description: document.querySelector(".description"),
    nameInput: document.getElementById("contact-name"),
    phoneInput: document.getElementById("contact-phone"),
    emailInput: document.getElementById("contact-email"),
    circleDiv: document.querySelector(".overlay-content .circle"),
    submitButton: document.querySelector(".submit"),
    cancelButton: document.querySelector(".cancel")
  };
}

/**
 * Initializes UI elements for adding a new contact.
 * @param {Object} elements - UI elements for contact form.
 */
function setupNewContact() {
  const elements = setNewContact();
  initializeNewContactUI(elements);
  resetContactInputs(elements);
  editIndex = null;
}

/**
 * Resets the contact input fields.
 * @param {Object} elements - UI elements containing input fields.
 */
function initializeNewContactUI({ title, description, circleDiv, submitButton, cancelButton }) {
  title.textContent = "Add Contact";
  description.textContent = "Tasks are better with a team!";
  circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
  circleDiv.style.backgroundColor = "";
  submitButton.innerHTML = `Create contact <img class="check" src="../assets/icons/contact/check.png">`;
  cancelButton.innerHTML = `Cancel <img class="cancelicon" src="../assets/icons/contact/cancel.png">`;
  cancelButton.setAttribute("onclick", "closeOverlay()");
}

/**
 * Resets the contact input fields.
 * @param {Object} elements - UI elements containing input fields.
 */
function resetContactInputs({ nameInput, phoneInput, emailInput }) {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
}


/**
 * Displays the list of contacts.
 */
function setupNewContact() {
  const elements = setNewContact();
  initializeNewContactUI(elements);
  resetContactInputs(elements);
  editIndex = null;
}

/**
 * Groups contacts alphabetically.
 * @param {Array} contacts - Array of contacts.
 * @returns {Object} Contacts grouped by first letter.
 */
function initializeNewContactUI({ title, description, circleDiv, submitButton, cancelButton }) {
  title.textContent = "Add Contact";
  description.textContent = "Tasks are better with a team!";
  circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
  circleDiv.style.backgroundColor = "";
  submitButton.innerHTML = `Create contact <img class="check" src="../assets/icons/contact/check.png">`;
  cancelButton.innerHTML = `Cancel <img class="cancelicon" src="../assets/icons/contact/cancel.png">`;
  cancelButton.setAttribute("onclick", "closeOverlay()");
}

/**
 * Resets the contact input fields.
 * @param {Object} elements - UI elements containing input fields.
 */
function resetContactInputs({ nameInput, phoneInput, emailInput }) {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
}


/* Closes the overlay. */
function closeOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("show");
  overlay.classList.add("hide");
  setTimeout(() => {
    overlay.style.display = "none";
  }, 300);
}

/**
 * Groups contacts alphabetically.
 * @param {Array} contacts - Array of contacts.
 * @returns {Object} Contacts grouped by first letter.
 */
function showContacts() {
  const contactList = document.getElementById("contactlist");
  if (!contactList) {
    return;
  }
  contactList.innerHTML = "";
  const groupedContacts = groupContactsByLetter(contacts);
  displayGroupedContacts(groupedContacts, contactList);
}

/**
 * Displays grouped contacts in the DOM.
 * @param {Object} groupedContacts - Object with grouped contacts.
 * @param {HTMLElement} contactList - The contact list container.
 */
function groupContactsByLetter(contacts) {
  return contacts.reduce((groups, contact) => {
    const letter = contact.name.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(contact);
    return groups;
  }, {});
}

/* Displays grouped contacts in the DOM. */
function displayGroupedContacts(groupedContacts, contactList) {
  Object.keys(groupedContacts)
    .sort()
    .forEach(letter => {
      const groupDiv = createGroupDiv(letter);
      groupedContacts[letter].forEach(contact => appendContact(contact, groupDiv));
      contactList.appendChild(groupDiv);
    });
}

/* Creates a group container for contacts. */
function createGroupDiv(letter) {
  const groupDiv = document.createElement("div");
  groupDiv.classList.add("contact-group");
  groupDiv.innerHTML = `<h2 class="bigletter">${letter}</h2><hr>`;
  return groupDiv;
}

/* Appends a contact to a group div. */
function appendContact(contact, groupDiv) {
  if (!contact.color) contact.color = getRandomColor();
  const contactDiv = createContactDiv(contact);
  groupDiv.appendChild(contactDiv);
}

async function showContactList() {
  contactListAdd();
  await syncContacts(); 
  showContacts(); 
  updateContactDetailsView(); 
}

/* Updates the contact details view with the given contact data. */
function updateContactDetailsView() {
  const detailsDiv = document.getElementById("contact-details");
  if (!detailsDiv) return; 
  const openContactIndex = detailsDiv.getAttribute("data-contact-index");
  if (openContactIndex !== null) {
    const contactData = getContactByIndex(parseInt(openContactIndex));
    if (contactData) {
      updateContactDetails(contactData); 
    }
    detailsDiv.classList.add("show");
    detailsDiv.classList.remove("hide");
  }
}

/* gives the contact data for a given index */
function contactListAdd() {
  const contactList = document.querySelector(".scrolllist");
  const detailsDiv = document.getElementById("contact-details");
  contactList.classList.add("show");
  contactList.classList.remove("hide");
  detailsDiv.classList.add("hide");
  detailsDiv.classList.remove("show");
}

/* Updates the contact details view with the given contact data. */
function showContactDetails(index) {
  const detailsDiv = document.getElementById("contact-details");
  const contact = contacts[index];
  if (!contact) return;
  detailsDiv.setAttribute("data-contact-index", index);
  detailsDiv.innerHTML = `
    <h2>${contact.name}</h2>
    <p>Email: ${contact.email}</p>
    <p>Telefon: ${contact.phone}</p>
  `;

  detailsDiv.classList.add("show");
  detailsDiv.classList.remove("hide");
}


/* Sets up the overlay for editing an existing contact. */
async function deleteContact(id) {
  const contactIndex = contacts.findIndex(contact => contact.id === id);
  if (contactIndex === -1) {
    return;
  }
  const contact = contacts[contactIndex];
  try {
    if (contact.firebaseKey) {
      await deleteContactFromFirebase(contact.firebaseKey);
    }
    contacts.splice(contactIndex, 1);
    showContacts();
  } catch (error) {
  }
}

/* deletes a Contact from Firebase */
async function deleteContactFromFirebase(firebaseKey) {
  try {
    const response = await fetch(`${CONTACTS_URL}/contacts/${firebaseKey}.json`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error(`Fehler beim Löschen von Firebase: ${response.status}`);
    }
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts in Firebase:", error);
  }
}

/* Handles input events for the contact name field. */
function handleNameInput(event) {
  const name = event.target.value.trim();
  const circleDiv = document.querySelector(".overlay-content .circle");
  updateCirclePreview(name, circleDiv);
}

/* Updates the circle preview with initials and color. */
function updateCirclePreview(name, circleDiv) {
  if (name) {
    circleDiv.textContent = getInitials(name);
    circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
  } else {
    circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
  }
}

/*Handles form submission for adding or editing contacts. */
function handleFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("contact-name").value.trim();
  const phone = document.getElementById("contact-phone").value.trim();
  const email = document.getElementById("contact-email").value.trim();

  if (!name || !phone) {
    alert("Bitte Name und Telefonnummer eingeben!");
    return;
  }
  saveContact(name, phone, email);
  closeOverlay();
  showContacts();
}

/* Saves a new or edited contact. */
async function saveContact(name, phone, email) {
  let savedIndex = editIndex;
  if (editIndex !== null) {
    await updateExistingContact(name, phone, email);
  } else {
    savedIndex = await createNewContact(name, phone, email); 
  }
  closeOverlay(); 
  showContacts();
  if (savedIndex !== null) {
    showContactDetails(savedIndex);
  }
}

