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

/* Generates a random color in hexadecimal format. */
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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
  const elements = setNewContact(); // Holt alle relevanten UI-Elemente
  initializeNewContactUI(elements); // Setzt die UI-Texte und Buttons
  resetContactInputs(elements); // Leert die Eingabefelder
  editIndex = null; // Setzt den Bearbeitungsindex zurück
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
  const elements = setNewContact(); // Holt alle relevanten UI-Elemente
  initializeNewContactUI(elements); // Setzt die UI-Texte und Buttons
  resetContactInputs(elements); // Leert die Eingabefelder
  editIndex = null; // Setzt den Bearbeitungsindex zurück
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
    const contactData = getContactByIndex(parseInt(openContactIndex)); // Die aktualisierten Kontaktdaten abrufen
    if (contactData) {
      updateContactDetails(contactData); 
    }
    detailsDiv.classList.add("show");
    detailsDiv.classList.remove("hide");
  }
}

function contactListAdd() {
  const contactList = document.querySelector(".scrolllist");
  const detailsDiv = document.getElementById("contact-details");

  contactList.classList.add("show");
  contactList.classList.remove("hide");

  detailsDiv.classList.add("hide");
  detailsDiv.classList.remove("show");
}


function showContactDetails(index) {
  const detailsDiv = document.getElementById("contact-details");
  // Neueste Kontakte holen (nach syncContacts() aktualisiert)
  const contact = contacts[index];
  if (!contact) return;
  // Kontakt-Details sofort aktualisieren
  detailsDiv.setAttribute(index);
  detailsDiv.innerHTML = `
    <h2>${contact.name}</h2>
    <p>Email: ${contact.email}</p>
    <p>Telefon: ${contact.phone}</p>
  `;
  detailsDiv.classList.add("show");
  detailsDiv.classList.remove("hide");
}

async function deleteContact(id) {
  const contactIndex = contacts.findIndex(contact => contact.id === id);
  if (contactIndex === -1) {
    return;
  }
  const contact = contacts[contactIndex];
  try {
    if (contact.firebaseKey) {
      await deleteContactFromFirebase(contact.firebaseKey); // Lösche aus Firebase
    }
    contacts.splice(contactIndex, 1); // Entferne aus der lokalen Liste
    showContacts(); // Aktualisiere die Anzeige
  } catch (error) {
  }
}

/* Löscht einen Kontakt aus Firebase */
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
    circleDiv.style.backgroundColor = getRandomColor();
  } else {
    circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
    circleDiv.style.backgroundColor = "";
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
  } else {
    console.error(`Keine \`div\` mit der Klasse '${targetClass}' gefunden.`);
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