/** @type {Array<Object>} Array of contact objects. */
let contacts = [];

/** @type {number|null} Index of the currently edited contact. */
let editIndex = null;

/** Extracts the initials from a name string. */
function getInitials(name) {
  return name.split(" ").map(part => part[0]).join("").toUpperCase();
}

/** Opens an overlay for editing or adding a contact. */
function openOverlay(mode, index = null) {
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("hide");
  overlay.classList.add("show");
  overlay.style.display = "flex";
  mode === "edit" ? setupEditContact(index) : setupNewContact();
}

/** Returns UI elements for contact form. */
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

/** Sets up the overlay for adding a new contact. */
function setupNewContact() {
  const elements = setNewContact();
  initializeNewContactUI(elements);
  resetContactInputs(elements);
  editIndex = null;
}

/** Initializes UI for adding a new contact. */
function initializeNewContactUI({ title, description, circleDiv, submitButton, cancelButton }) {
  title.textContent = "Add Contact";
  description.textContent = "Tasks are better with a team!";
  circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
  submitButton.innerHTML = `Create contact <img class="check" src="../assets/icons/contact/check.png">`;
  cancelButton.innerHTML = `Cancel <img class="cancelicon" src="../assets/icons/contact/cancel.png">`;
  cancelButton.setAttribute("onclick", "closeOverlay()");
}

/** Resets input fields for contact form. */
function resetContactInputs({ nameInput, phoneInput, emailInput }) {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
}

/** Closes the overlay. */
function closeOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("show");
  overlay.classList.add("hide");
  setTimeout(() => overlay.style.display = "none", 300);
}

/** Displays the contact list. */
function showContacts() {
  const contactList = document.getElementById("contactlist");
  if (!contactList) return;
  contactList.innerHTML = "";
  displayGroupedContacts(groupContactsByLetter(contacts), contactList);
}

/** Groups contacts by the first letter of their name. */
function groupContactsByLetter(contacts) {
  return contacts.reduce((groups, contact) => {
    const letter = contact.name.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(contact);
    return groups;
  }, {});
}

/** Displays grouped contacts in the DOM. */
function displayGroupedContacts(groupedContacts, contactList) {
  Object.keys(groupedContacts).sort().forEach(letter => {
    const groupDiv = createGroupDiv(letter);
    groupedContacts[letter].forEach(contact => appendContact(contact, groupDiv));
    contactList.appendChild(groupDiv);
  });
}

/** Creates a group container for contacts. */
function createGroupDiv(letter) {
  const groupDiv = document.createElement("div");
  groupDiv.classList.add("contact-group");
  groupDiv.innerHTML = `<h2 class="bigletter">${letter}</h2><hr>`;
  return groupDiv;
}

/** Appends a contact to a group div. */
function appendContact(contact, groupDiv) {
  if (!contact.color) contact.color = getRandomColor();
  groupDiv.appendChild(createContactDiv(contact));
}

/** Shows the contact list and updates details. */
async function showContactList() {
  contactListAdd();
  await syncContacts();
  showContacts();
  updateContactDetailsView();
}

/** Updates the contact details view if a contact is open. */
function updateContactDetailsView() {
  const detailsDiv = document.getElementById("contact-details");
  if (!detailsDiv) return;
  const openContactIndex = detailsDiv.getAttribute("data-contact-index");
  if (openContactIndex !== null) {
    const contactData = getContactByIndex(parseInt(openContactIndex));
    if (contactData) updateContactDetails(contactData);
    detailsDiv.classList.add("show");
    detailsDiv.classList.remove("hide");
  }
}

/** Shows contact details for a selected contact. */
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

/** Deletes a contact from the list and Firebase. */
async function deleteContact(id) {
  const contactIndex = contacts.findIndex(contact => contact.id === id);
  if (contactIndex === -1) return;
  const contact = contacts[contactIndex];
  try {
    if (contact.firebaseKey) await deleteContactFromFirebase(contact.firebaseKey);
    contacts.splice(contactIndex, 1);
    showContacts();
  } catch (error) { }
}

/** Deletes a contact from Firebase. */
async function deleteContactFromFirebase(firebaseKey) {
  try {
    const response = await fetch(`${CONTACTS_URL}/contacts/${firebaseKey}.json`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Fehler beim Löschen von Firebase: ${response.status}`);
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts in Firebase:", error);
  }
}

/** Handles input event for name field. */
function handleNameInput(event) {
  updateCirclePreview(event.target.value.trim(), document.querySelector(".overlay-content .circle"));
}

/** Updates the circle preview with initials and color. */
function updateCirclePreview(name, circleDiv) {
  circleDiv.innerHTML = name ? `<img class="concircle" src="../assets/icons/contact/circledefault.png">` : "";
}

/** Handles form submission for adding or editing contacts. */
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

/** Saves a new or edited contact. */
function saveContact(name, phone, email) {
  if (editIndex !== null) {
    contacts[editIndex] = { ...contacts[editIndex], name, phone, email };
    createSuccessMessage("Contact successfully updated", "successedit");
  } else {
    contacts.push({ name, phone, email, color: getRandomColor() });
    createSuccessMessage("Contact successfully created", "successcreate");
  }
}

/** Ensures phone input only contains numbers. */
function validatePhoneInput(event) {
  event.target.value = event.target.value.replace(/[^0-9]/g, '');
}

/** Initializes event listeners for form inputs. */
function initializeEventListeners() {
  document.getElementById("contact-phone")?.addEventListener("input", validatePhoneInput);
  document.getElementById("contact-name")?.addEventListener("input", handleNameInput);
  document.getElementById("contact-form")?.addEventListener("submit", handleFormSubmit);
}

document.addEventListener("DOMContentLoaded", initializeEventListeners);