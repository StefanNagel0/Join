const CONTACTS_URL = "https://secret-27a6b-default-rtdb.europe-west1.firebasedatabase.app/contacts";

function nameValidate(event) {
  const nameInput = event.target;
  const nameError = document.getElementById("name-error");

  if (nameInput.value.trim().length < 2) {
    showError(nameError, "Name must be at least 2 characters long.", nameInput);
  } else {
    hideError(nameError, nameInput);
  }
}

function validateEmail(event) {
  const emailInput = event.target;
  const emailError = document.getElementById("email-error");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|de|at|net|org|ch|uk)$/i;
  emailRegex.test(emailInput.value)
    ? hideError(emailError, emailInput)
    : showError(emailError, "Invalid email format.", emailInput);
}


function validatePhone(event) {
  const phoneInput = event.target;
  const phoneError = document.getElementById("phone-error");
  const phoneRegex = /^[0-9\s\+\-()]{7,15}$/;
  phoneRegex.test(phoneInput.value)
    ? hideError(phoneError, phoneInput)
    : showError(phoneError, "Phone number min 7 digits.", phoneInput);
}

function showError(element, message, input) {
  element.textContent = message;
  element.style.display = "block";
  input.classList.add("error-border");
}

function hideError(element, input) {
  element.style.display = "none";
  input.classList.remove("error-border");
}

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

function reloadOpenContact() {
  const detailsDiv = document.getElementById("contact-details");
  if (!detailsDiv) return;
  const openContactIndex = detailsDiv.getAttribute("data-contact-index");
  if (openContactIndex !== null) showContactDetails(parseInt(openContactIndex));
}

async function saveContact(name, phone, email) {
  if (!name || !phone || !email) return;
  const savedIndex = editIndex !== null ? await updateContact(name, phone, email) : await createNewContact(name, phone, email);
  await syncContacts();
  if (savedIndex !== null) showContactDetails(savedIndex);
}

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

async function updateContact(name, phone, email) {
  const contact = contacts[editIndex];
  if (!contact) return null;
  Object.assign(contact, { name, phone, email });
  if (contact.firebaseKey) await updateContactInFirebase(contact);
  editIndex = null;
  return editIndex;
}

async function deleteContact(index) {
  if (index < 0 || index >= contacts.length) return;
  const contact = contacts[index];
  if (!contact || !contact.firebaseKey) return;
  await deleteContactFromFirebase(contact.firebaseKey);
  contacts = contacts.filter(c => c.firebaseKey !== contact.firebaseKey);
  await syncContacts();
  showNextContact(index);
}

async function deleteContactFromFirebase(firebaseKey) {
  await fetch(`${CONTACTS_URL}/${firebaseKey}.json`, { method: "DELETE" });
}

function showNextContact(index) {
  let nextIndex = index >= contacts.length ? contacts.length - 1 : index;
  contacts.length > 0 && nextIndex >= 0 ? showContactDetails(nextIndex) : clearContactDetails();
}

function clearContactDetails() {
  const detailsDiv = document.getElementById("contact-details");
  detailsDiv.innerHTML = "<p>Kein Kontakt ausgewählt.</p>";
  detailsDiv.classList.add("hide");
}

async function pushContactToFirebase(contact) {
  const response = await fetch(`${CONTACTS_URL}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  return response.ok ? (await response.json()).name : null;
}

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

document.addEventListener("DOMContentLoaded", syncContacts);
