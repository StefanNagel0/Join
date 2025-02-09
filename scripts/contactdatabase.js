/** URL of the Firebase database for contacts */
const CONTACTS_URL = "https://secret-27a6b-default-rtdb.europe-west1.firebasedatabase.app/contacts";

/** Validates the name input field */
function nameValidate(event) {
  const nameInput = event.target;
  const nameError = document.getElementById("name-error");
  nameInput.value.trim().length < 2
    ? showError(nameError, "Name must be at least 2 characters long.", nameInput)
    : hideError(nameError, nameInput);
}

/** Validates the email input field */
function validateEmail(event) {
  const emailInput = event.target;
  const emailError = document.getElementById("email-error");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|de|at|net|org|ch|uk)$/i;
  emailRegex.test(emailInput.value)
    ? hideError(emailError, emailInput)
    : showError(emailError, "Invalid email format.", emailInput);
}

/** Validates the phone number input field */
function validatePhone(event) {
  const phoneInput = event.target;
  const phoneError = document.getElementById("phone-error");
  const phoneRegex = /^[0-9\s\+\-()]{7,15}$/;
  phoneRegex.test(phoneInput.value)
    ? hideError(phoneError, phoneInput)
    : showError(phoneError, "Phone number must have at least 7 digits.", phoneInput);
}

/** Displays an error message */
function showError(element, message, input) {
  element.textContent = message;
  element.style.display = "block";
  input.classList.add("error-border");
}

/** Hides an error message */
function hideError(element, input) {
  element.style.display = "none";
  input.classList.remove("error-border");
}

/** Synchronizes contacts with Firebase */
async function syncContacts() {
  try {
    const response = await fetch(`${CONTACTS_URL}.json`, { method: "GET" });
    if (!response.ok) return console.error("Error retrieving contacts");
    const data = await response.json();
    contacts = data ? Object.entries(data).map(([key, value]) => ({ ...value, firebaseKey: key })) : [];
    showContacts();
    reloadOpenContact();
  } catch (error) {
    console.error("Network error retrieving contacts:", error);
  }
}

/** Updates the contact details view after synchronization */
function reloadOpenContact() {
  const detailsDiv = document.getElementById("contact-details");
  if (!detailsDiv) return;
  const openContactIndex = detailsDiv.getAttribute("data-contact-index");
  if (openContactIndex !== null) showContactDetails(parseInt(openContactIndex));
}

/** Saves a new or edited contact */
async function saveContact(name, phone, email) {
  if (!name || !phone || !email) return;
  const savedIndex = editIndex !== null ? await updateContact(name, phone, email) : await createNewContact(name, phone, email);
  await syncContacts();
  if (savedIndex !== null) showContactDetails(savedIndex);
}

/** Creates a new contact */
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

/** Updates an existing contact */
async function updateContact(name, phone, email) {
  const contact = contacts[editIndex];
  if (!contact) return null;
  Object.assign(contact, { name, phone, email });
  if (contact.firebaseKey) await updateContactInFirebase(contact);
  editIndex = null;
  return editIndex;
}

/** Deletes a contact */
async function deleteContact(index) {
  if (index < 0 || index >= contacts.length) return;
  const contact = contacts[index];
  if (!contact || !contact.firebaseKey) return;
  await deleteContactFromFirebase(contact.firebaseKey);
  contacts = contacts.filter(c => c.firebaseKey !== contact.firebaseKey);
  await syncContacts();
  showNextContact(index);
}

/** Deletes a contact from Firebase */
async function deleteContactFromFirebase(firebaseKey) {
  await fetch(`${CONTACTS_URL}/${firebaseKey}.json`, { method: "DELETE" });
}

/** Displays the next contact after deletion */
function showNextContact(index) {
  let nextIndex = index >= contacts.length ? contacts.length - 1 : index;
  contacts.length > 0 && nextIndex >= 0 ? showContactDetails(nextIndex) : clearContactDetails();
}

/** Clears the contact details view */
function clearContactDetails() {
  const detailsDiv = document.getElementById("contact-details");
  detailsDiv.innerHTML = "<p>No contact selected.</p>";
  detailsDiv.classList.add("hide");
}

/** Saves a new contact in Firebase */
async function pushContactToFirebase(contact) {
  const response = await fetch(`${CONTACTS_URL}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  return response.ok ? (await response.json()).name : null;
}

/** Updates a contact in Firebase */
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
    console.error(`Error updating contact:`, response.status);
  }
}

/** Initializes contact synchronization when the page loads */
document.addEventListener("DOMContentLoaded", syncContacts);
