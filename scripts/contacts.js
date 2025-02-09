/* Array of contact objects. */
let contacts = [];

/* @type {number|null} Index of the currently edited contact. */
let editIndex = null;

/* Extracts the initials from a name string. */
function getInitials(name) {
  const parts = name.split(" ");
  const initials = parts.map(part => part[0]).join("").toUpperCase();
  return initials;
}



/* Opens an overlay for editing or adding a contact. */
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

/* New Contact */
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

/* Sets up the overlay for editing an existing contact. */
/* Sets up the overlay for adding a new contact. */
function setupNewContact() {
  const elements = setNewContact();
  initializeNewContactUI(elements);
  resetContactInputs(elements);
  editIndex = null;
}

/* Aktualisiert die UI-Texte und Buttons für das Hinzufügen eines neuen Kontakts */
function initializeNewContactUI({ title, description, circleDiv, submitButton, cancelButton }) {
  title.textContent = "Add Contact";
  description.textContent = "Tasks are better with a team!";
  circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
  circleDiv.style.backgroundColor = "";
  submitButton.innerHTML = `Create contact <img class="check" src="../assets/icons/contact/check.png">`;
  cancelButton.innerHTML = `Cancel <img class="cancelicon" src="../assets/icons/contact/cancel.png">`;
  cancelButton.setAttribute("onclick", "closeOverlay()");
}

/* Setzt die Eingabefelder für Name, Telefon & E-Mail zurück */
function resetContactInputs({ nameInput, phoneInput, emailInput }) {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
}


/* Sets up the overlay for adding a new contact. */
function setupNewContact() {
  const elements = setNewContact();
  initializeNewContactUI(elements);
  resetContactInputs(elements);
  editIndex = null;
}

/* Aktualisiert die UI-Texte und Buttons für das Hinzufügen eines neuen Kontakts */
function initializeNewContactUI({ title, description, circleDiv, submitButton, cancelButton }) {
  title.textContent = "Add Contact";
  description.textContent = "Tasks are better with a team!";
  circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
  circleDiv.style.backgroundColor = "";
  submitButton.innerHTML = `Create contact <img class="check" src="../assets/icons/contact/check.png">`;
  cancelButton.innerHTML = `Cancel <img class="cancelicon" src="../assets/icons/contact/cancel.png">`;
  cancelButton.setAttribute("onclick", "closeOverlay()");
}

/* Setzt die Eingabefelder für Name, Telefon & E-Mail zurück */
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

/* Displays the contact list. */
function showContacts() {
  const contactList = document.getElementById("contactlist");
  if (!contactList) {
    return;
  }
  contactList.innerHTML = "";
  const groupedContacts = groupContactsByLetter(contacts);
  displayGroupedContacts(groupedContacts, contactList);
}

/* Groups contacts by the first letter of their name.*/
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

/* Aktualisiert die Detailansicht, falls ein Kontakt geöffnet ist */
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
  detailsDiv.setAttribute(index);
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
function saveContact(name, phone, email) {
  if (editIndex !== null) {
    contacts[editIndex] = { ...contacts[editIndex], name, phone, email };
    createSuccessMessage("Contact successfully updated", "successedit");
  } else {
    contacts.push({ name, phone, email, color: getRandomColor() });
    createSuccessMessage("Contact successfully created", "successcreate");
  }
}

/* Creates a success message and displays it temporarily. */
function createSuccessMessage(message, targetClass) {
  const successDiv = document.querySelector(`.${targetClass}`);
  if (successDiv) {
    successDiv.textContent = message;
    successDiv.classList.remove("hide");
    successDiv.classList.add("show");
    setTimeout(() => {
      successDiv.classList.remove("show");
      successDiv.classList.add("hide");
    }, 3000);
  } 
}

/* Validates the phone input field, allowing only numbers. */
function validatePhoneInput(event) {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, '');
}

/* Initializes event listeners for form inputs and submission. */
function initializeEventListeners() {
  const phoneInput = document.getElementById("contact-phone");
  const nameInput = document.getElementById("contact-name");
  const form = document.getElementById("contact-form");
  if (phoneInput) {
    phoneInput.addEventListener("input", validatePhoneInput);
  }
  if (nameInput) {
    nameInput.addEventListener("input", handleNameInput);
  }
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
}

document.addEventListener("DOMContentLoaded", initializeEventListeners);

/* Toggles the collapse state of additional contact options. */
function toggleCollapse() {
  const content = document.getElementById("collapseContent");
  const button = document.querySelector(".collapse-button");

  if (content.classList.contains("open")) {
    content.classList.remove("open");
  } else {
    content.classList.add("open");
  }
}

/* Sets up the overlay for editing an existing contact. */
function selectContactMain(selectedElement) {
  const isSelected = selectedElement.classList.contains('selected');
  const allContacts = document.querySelectorAll('.contactmain');
  allContacts.forEach((element) => {
    element.classList.remove('selected');
  });
  if (!isSelected) {
    selectedElement.classList.add('selected');
  }
}
const colors = [
  "#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD",
  "#2ECC71", "#E74C3C", "#3498DB", "#1ABC9C", "#D35400",
  "#C0392B", "#9B59B6", "#1E8449", "#F39C12", "#34495E",
  "#16A085"
];

let colorIndex = 0;
let firstCall = true;

/* Returns a random color from the colors array. */
function getRandomColor() {
  if (firstCall) {
    firstCall = false;
    return colors[colorIndex]; 
  }
  colorIndex = (colorIndex + 1) % colors.length; 
  return colors[colorIndex];
}