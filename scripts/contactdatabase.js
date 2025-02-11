/**
 * URL for Firebase Realtime Database.
 * @constant {string}
 */
const CONTACTS_URL = "https://secret-27a6b-default-rtdb.europe-west1.firebasedatabase.app/contacts";

/**
 * Validates the name input field.
 * @param {Event} event - The event triggered on input.
 */
function nameValidate(event) {
  const nameInput = event.target;
  const nameError = document.getElementById("name-error");

  if (nameInput.value.trim().length < 2) {
    showError(nameError, "Name must be at least 2 characters long.", nameInput);
  } else {
    hideError(nameError, nameInput);
  }
}

/**
 * Validates the email input field.
 * @param {Event} event - The event triggered on input.
 */
function validateEmail(event) {
  const emailInput = event.target;
  const emailError = document.getElementById("email-error");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|de|at|net|org|ch|uk)$/i;
  emailRegex.test(emailInput.value)
    ? hideError(emailError, emailInput)
    : showError(emailError, "Invalid email format.", emailInput);
}

/**
 * Validates the phone input field.
 * @param {Event} event - The event triggered on input.
 */
function validatePhone(event) {
  const phoneInput = event.target;
  const phoneError = document.getElementById("phone-error");
  const phoneRegex = /^[0-9\s\+\-()]{7,15}$/;
  phoneRegex.test(phoneInput.value)
    ? hideError(phoneError, phoneInput)
    : showError(phoneError, "Phone number min 7 digits.", phoneInput);
}

/**
 * Displays an error message.
 * @param {HTMLElement} element - The error message element.
 * @param {string} message - The error message text.
 * @param {HTMLElement} input - The input field that triggered the error.
 */
function showError(element, message, input) {
  element.textContent = message;
  element.style.display = "block";
  input.classList.add("error-border");
}

/**
 * Hides an error message.
 * @param {HTMLElement} element - The error message element.
 * @param {HTMLElement} input - The input field to reset.
 */
function hideError(element, input) {
  element.style.display = "none";
  input.classList.remove("error-border");
}

/**
 * Synchronizes contacts from Firebase.
 * @async
 */
async function syncContacts() {
  try {
    const response = await fetch(`${CONTACTS_URL}.json`, { method: "GET" });
    if (!response.ok) return console.error("Fehler beim Abrufen der Kontakte");
    const data = await response.json();
    contacts = data ? Object.entries(data).map(([key, value]) => ({ ...value, firebaseKey: key })) : [];
    showContacts();
    reloadOpenContact();
  } catch (error) {
    console.error("Netzwerkfehler beim Abrufen der Kontakte:", error);
  }
}

/**
 * Reloads the currently opened contact if applicable.
 */
function reloadOpenContact() {
  const detailsDiv = document.getElementById("contact-details");
  if (!detailsDiv) return;
  const openContactIndex = detailsDiv.getAttribute("data-contact-index");
  if (openContactIndex !== null) showContactDetails(parseInt(openContactIndex));
}

/**
 * Saves a contact to Firebase.
 * @async
 * @param {string} name - Contact name.
 * @param {string} phone - Contact phone number.
 * @param {string} email - Contact email.
 */
async function saveContact(name, phone, email) {
  if (!name || !phone || !email) return;
  const savedIndex = editIndex !== null ? await updateContact(name, phone, email) : await createNewContact(name, phone, email);
  await syncContacts();
  if (savedIndex !== null) showContactDetails(savedIndex);
}

/**
 * Creates a new contact in Firebase.
 * @async
 * @param {string} name - Contact name.
 * @param {string} phone - Contact phone number.
 * @param {string} email - Contact email.
 * @returns {Promise<number|null>} - The index of the saved contact.
 */
async function createNewContact(name, phone, email) {
  if (contacts.some(c => c.name === name && c.phone === phone)) {
    alert("Duplicate contact detected.");
    return null;
  }
  const newContact = { name, phone, email, color: getRandomColor() };
  newContact.firebaseKey = await pushContactToFirebase(newContact);
  contacts.push(newContact);
  createSuccessMessage("Contact successfully created", "successcreate");
  return contacts.length - 1;
}

/**
 * Deletes a contact from Firebase.
 * @async
 * @param {number} index - Contact index.
 */
async function updateContact(name, phone, email) {
  const contact = contacts[editIndex];
  if (!contact) return null;
  Object.assign(contact, { name, phone, email });
  if (contact.firebaseKey) await updateContactInFirebase(contact);
  editIndex = null;
  return editIndex;
}

/**
 * Deletes a contact from Firebase.
 * @async
 * @param {string} firebaseKey - Firebase key of the contact.
 */
async function deleteContact(index) {
  if (index < 0 || index >= contacts.length) return;
  const contact = contacts[index];
  if (!contact || !contact.firebaseKey) return;
  await deleteContactFromFirebase(contact.firebaseKey);
  contacts = contacts.filter(c => c.firebaseKey !== contact.firebaseKey);
  await syncContacts();
  showNextContact(index);
}

/**
 * Deletes a contact from Firebase.
 * @async
 * @param {string} firebaseKey - Firebase key of the contact.
 */
async function deleteContactFromFirebase(firebaseKey) {
  await fetch(`${CONTACTS_URL}/${firebaseKey}.json`, { method: "DELETE" });
}

/**
 * Shows the next available contact after deletion.
 * @param {number} index - The index of the deleted contact.
 */
function showNextContact(index) {
  let nextIndex = index >= contacts.length ? contacts.length - 1 : index;
  contacts.length > 0 && nextIndex >= 0 ? showContactDetails(nextIndex) : clearContactDetails();
}

/**
 * Clears the contact details section.
 */
function clearContactDetails() {
  const detailsDiv = document.getElementById("contact-details");
  detailsDiv.innerHTML = "<p>Kein Kontakt ausgewählt.</p>";
  detailsDiv.classList.add("hide");
}

/**
 * Pushes a new contact to Firebase.
 * @async
 * @param {Object} contact - Contact object containing name, phone, and email.
 * @returns {Promise<string|null>} - Firebase key of the new contact.
 */
async function pushContactToFirebase(contact) {
  const response = await fetch(`${CONTACTS_URL}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  return response.ok ? (await response.json()).name : null;
}

/**
 * Updates an existing contact in Firebase.
 * @async
 * @param {Object} contact - Contact object to be updated.
 */
async function updateContactInFirebase(contact) {
  if (!contact || !contact.firebaseKey) return;
  const updateURL = `${CONTACTS_URL}/${contact.firebaseKey}.json`;
  const response = await fetch(updateURL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  if (response.ok) {
    createSuccessMessage("Contact successfully updated", "successedit");
    await syncContacts();
  } else {
    console.error(`Fehler beim Aktualisieren:`, response.status);
  }
}

/**
 * Handles contact selection in the UI.
 * @param {HTMLElement} selectedElement - Selected contact element.
 */
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

/**
 * Predefined color palette for contacts.
 * @constant {Array<string>}
 */
const colors = [
  "#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD",
  "#2ECC71", "#E74C3C", "#3498DB", "#1ABC9C", "#D35400",
  "#C0392B", "#9B59B6", "#1E8449", "#F39C12", "#34495E",
  "#16A085"
];

let colorIndex = 0;
let firstCall = true;
/**
 * Returns a random color from the predefined color palette.
 * @returns {string} - Selected color code.
 */
function getRandomColor() {
  if (firstCall) {
    firstCall = false;
    return colors[colorIndex]; 
  }
  colorIndex = (colorIndex + 1) % colors.length; 
  return colors[colorIndex];
}

/**
 * Initializes the contact synchronization when the DOM is loaded.
 */
document.addEventListener("DOMContentLoaded", syncContacts);
