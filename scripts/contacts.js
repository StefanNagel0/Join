let contacts = [];
let editIndex = null;

/**
 * Generates initials from a name by taking the first letter of the first and last name.
 * @param {string} name - The name from which to extract the initials.
 * @returns {string} The initials of the given name.
 */
function getInitials(name) {
  const parts = name.split(" ");
  const initials = parts.map(part => part[0]).join("").toUpperCase();
  return initials;
}

/**
 * Sets up the contact edit form with the contact at the given index.
 * @param {number} index - The index of the contact in the contacts array to edit.
 * @returns {void}
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
 * Populates the contact edit form with the given contact's details.
 * @param {object} elements - The object containing the DOM elements of the contact edit form.
 * @param {object} contact - The contact object to populate the form with.
 * @returns {void}
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
 * Updates the contact circle's appearance with the contact's initials and color.
 * If the contact doesn't have a color yet, it generates a random color.
 * @param {HTMLElement} circleDiv - The div element representing the contact circle.
 * @param {object} contact - The contact object to update the circle's appearance with.
 * @returns {void}
 */
function updateCircleAppearance(circleDiv, contact) {
  circleDiv.textContent = getInitials(contact.name);
  if (!contact.color) {
    contact.color = getRandomColor();
  }
  circleDiv.style.backgroundColor = contact.color; 
}

/**
 * Updates the open contact details after editing a contact.
 * If the contact details view is open and the open contact index is valid,
 * it reloads the contact details by calling `showContactDetails` with the index of the open contact.
 * If the contact details view is not open, it does nothing.
 * @returns {void}
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
 * Opens the contact overlay in either "edit" or "new" mode.
 * @param {string} mode - The mode to open the overlay in, either "edit" or "new".
 * @param {number} [index] - The index of the contact to edit, if mode is "edit".
 * @returns {void}
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
 * Returns an object with references to the DOM elements of the contact overlay.
 * @returns {{
 *   title: HTMLHeadingElement,
 *   description: HTMLParagraphElement,
 *   nameInput: HTMLInputElement,
 *   phoneInput: HTMLInputElement,
 *   emailInput: HTMLInputElement,
 *   circleDiv: HTMLDivElement,
 *   submitButton: HTMLButtonElement,
 *   cancelButton: HTMLButtonElement
 * }}
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
 * Sets up the overlay for adding a new contact.
 * Retrieves the DOM elements of the overlay content with `setNewContact` and initializes the UI with `initializeNewContactUI`.
 * Resets the contact inputs with `resetContactInputs` and sets `editIndex` to `null`.
 * @returns {void}
 */
function setupNewContact() {
  const elements = setNewContact();
  initializeNewContactUI(elements);
  resetContactInputs(elements);
  editIndex = null;
}

/**
 * Initializes the contact overlay UI for adding a new contact.
 * Sets the title to "Add Contact", description to "Tasks are better with a team!",
 * circle to a default circle with a white background, submit button to "Create contact"
 * and cancel button to "Cancel" with an onclick handler that closes the overlay.
 * @param {{title: HTMLHeadingElement, description: HTMLParagraphElement, circleDiv: HTMLDivElement, submitButton: HTMLButtonElement, cancelButton: HTMLButtonElement}} elements - The object containing the DOM elements of the contact overlay.
 * @returns {void}
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
 * Resets the contact inputs to their initial values.
 * Resets the name, phone, and email input values to empty strings.
 * @param {{nameInput: HTMLInputElement, phoneInput: HTMLInputElement, emailInput: HTMLInputElement}} elements - The object containing the DOM elements of the contact inputs.
 * @returns {void}
 */
function resetContactInputs({ nameInput, phoneInput, emailInput }) {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
}

/**
 * Sets up the overlay for adding a new contact.
 * Retrieves the DOM elements of the overlay content with `setNewContact` and initializes the UI with `initializeNewContactUI`.
 * Resets the contact inputs with `resetContactInputs` and sets `editIndex` to `null`.
 * @returns {void}
 */
function setupNewContact() {
  const elements = setNewContact();
  initializeNewContactUI(elements);
  resetContactInputs(elements);
  editIndex = null;
}

/**
 * Initializes the contact overlay UI for adding a new contact.
 * Sets the title to "Add Contact", description to "Tasks are better with a team!",
 * circle to a default circle with a white background, submit button to "Create contact"
 * and cancel button to "Cancel" with an onclick handler that closes the overlay.
 * @param {{title: HTMLHeadingElement, description: HTMLParagraphElement, circleDiv: HTMLDivElement, submitButton: HTMLButtonElement, cancelButton: HTMLButtonElement}} elements - The object containing the DOM elements of the contact overlay.
 * @returns {void}
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
 * Resets the contact input fields to empty strings.
 * This function clears the values of the name, phone, and email input elements, 
 * effectively resetting the contact form fields to their initial blank state.
 * @param {{nameInput: HTMLInputElement, phoneInput: HTMLInputElement, emailInput: HTMLInputElement}} elements - 
 * The object containing the DOM elements of the contact inputs.
 * @returns {void}
 */
function resetContactInputs({ nameInput, phoneInput, emailInput }) {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
}

/**
 * Closes the contact overlay by removing the 'show' class and adding the 'hide' class.
 * Sets the overlay's display to 'none' after a 300ms delay.
 * @returns {void}
 */
function closeOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("show");
  overlay.classList.add("hide");
  setTimeout(() => {
    overlay.style.display = "none";
  }, 300);
}

/**
 * Displays the list of contacts in the contact list element.
 * Clears the innerHTML of the contact list element, groups the contacts by letter,
 * and displays the grouped contacts in the list element.
 * @returns {void}
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
 * Groups an array of contacts by their first letter.
 * @param {array} contacts The array of contacts to group.
 * @returns {object} An object containing the grouped contacts. The keys are the
 * letters and the values are arrays of contacts whose first letter is the key.
 */
function groupContactsByLetter(contacts) {
  return contacts.reduce((groups, contact) => {
    const letter = contact.name.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(contact);
    return groups;
  }, {});
}

/**
 * Displays the grouped contacts in the contact list element.
 * The grouped contacts are displayed in alphabetical order of the first letter
 * of each contact's name. The contacts are grouped by letter and each group is
 * displayed in a div element with the corresponding letter as the display name.
 * @param {object} groupedContacts An object containing the grouped contacts.
 * The keys are the letters and the values are arrays of contacts whose first
 * letter is the key.
 * @param {HTMLElement} contactList The element to display the grouped contacts in.
 * @returns {void}
 */
function displayGroupedContacts(groupedContacts, contactList) {
  Object.keys(groupedContacts)
    .sort()
    .forEach(letter => {
      const groupDiv = createGroupDiv(letter);
      groupedContacts[letter].forEach(contact => appendContact(contact, groupDiv));
      contactList.appendChild(groupDiv);
    });
}

/**
 * Creates a div element for a contact group with the given letter.
 * The group div contains the letter as a heading and a horizontal rule.
 * @param {string} letter The letter of the contact group to create a div for.
 * @returns {HTMLElement} The created group div element.
 */
function createGroupDiv(letter) {
  const groupDiv = document.createElement("div");
  groupDiv.classList.add("contact-group");
  groupDiv.innerHTML = `<h2 class="bigletter">${letter}</h2><hr>`;
  return groupDiv;
}

/**
 * Appends a contact to the specified contact group division.
 * Ensures that the contact has a color, generating a random one if absent.
 * Creates an HTML element for the contact and appends it to the group.
 * 
 * @param {object} contact - The contact object to append.
 * @param {HTMLElement} groupDiv - The div element representing the contact group.
 * @returns {void}
 */
function appendContact(contact, groupDiv) {
  if (!contact.color) contact.color = getRandomColor();
  const contactDiv = createContactDiv(contact);
  groupDiv.appendChild(contactDiv);
}

/**
 * Displays the contact list and updates the contact details view.
 * Ensures that the contact list UI is properly displayed by calling
 * contactListAdd, synchronizes the local contact list with the database,
 * and displays the contacts using showContacts. Finally, it updates the
 * contact details view to reflect the currently selected contact, if any.
 * The function is asynchronous due to the syncContacts operation.
 * @returns {Promise<void>}
 */
async function showContactList() {
  contactListAdd();
  await syncContacts(); 
  showContacts(); 
  updateContactDetailsView(); 
}

/**
 * Updates the contact details view to reflect the currently selected contact, if any.
 * Gets the open contact index from the contact details div, and if it exists, retrieves the contact data
 * and updates the contact details view with the contact data. Sets the contact details div to show and removes the hide class.
 * @returns {void}
 */
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

/**
 * Toggles the contact list visibility and hides the contact details view.
 * Adds the "show" class and removes the "hide" class from the contact list.
 * Adds the "hide" class and removes the "show" class from the contact details view.
 * @returns {void}
 */
function contactListAdd() {
  const contactList = document.querySelector(".scrolllist");
  const detailsDiv = document.getElementById("contact-details");
  contactList.classList.add("show");
  contactList.classList.remove("hide");
  detailsDiv.classList.add("hide");
  detailsDiv.classList.remove("show");
}

/**
 * Zeigt die Detailansicht f r den Kontakt mit dem berlegten Index.
 * Aktualisiert die Detailansicht mit den Daten des ausgew hlte
 * Kontakts und blendet die Detailansicht ein.
 * @param {number} index - Der Index des ausgew hlte Kontakts
 * @returns {void}
 */
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

/**
 * Deletes the contact with the given ID from the local contact list and the Firebase database.
 * @param {string} id - The ID of the contact to delete.
 * @returns {Promise<void>} - A promise that resolves when the contact has been deleted.
 */
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

/**
 * Deletes the contact with the given Firebase key from the Firebase database.
 * @param {string} firebaseKey - The Firebase key of the contact to delete.
 * @returns {Promise<void>} - A promise that resolves when the contact has been deleted.
 */
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

/**
 * Handles input events on the contact name input field in the overlay.
 * Updates the circle preview element with the initials and color based on the input value.
 * @param {Event} event - The input event object.
 * @returns {void}
 */
function handleNameInput(event) {
  const name = event.target.value.trim();
  const circleDiv = document.querySelector(".overlay-content .circle");
  updateCirclePreview(name, circleDiv);
}

/**
 * Updates the preview circle element with the initials and color based on the given name.
 * @param {string} name - The name to generate the initials and color for.
 * @param {HTMLElement} circleDiv - The element to update with the initials and color preview.
 * @returns {void}
 */
function updateCirclePreview(name, circleDiv) {
  if (name) {
    circleDiv.textContent = getInitials(name);
    circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
  } else {
    circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
  }
}

/**
 * Handles the submission of the contact form.
 * Prevents the default form submission behavior, extracts the name, phone, and email input values, and checks if the name and phone are not empty.
 * If the name and phone are not empty, calls the saveContact function to save the contact to Firebase and then closes the overlay and shows the contact list.
 * If the name or phone are empty, alerts the user to fill in the required fields.
 * @param {Event} event - The form submission event object.
 * @returns {void}
 */
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

/**
 * Saves a new or updated contact to the local contacts list and Firebase.
 * Determines whether the contact is new or existing based on the edit index,
 * updates the existing contact or creates a new one accordingly.
 * Closes the contact overlay, refreshes the contact list display,
 * and shows the details of the saved contact if successful.
 * 
 * @param {string} name - The name of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} email - The email address of the contact.
 * @returns {Promise<void>} - A promise that resolves when the contact is saved.
 */
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

/**
 * Updates the contact at the index given by the editIndex variable with the given name, phone and email.
 * If the contact has a Firebase key, updates the corresponding entry in the Firebase database.
 * Shows a success message if the contact is successfully updated.
 * @param {string} name - The new name of the contact.
 * @param {string} phone - The new phone number of the contact.
 * @param {string} email - The new email address of the contact.
 * @returns {Promise<void>} - A promise that resolves when the contact has been updated.
 */
async function updateExistingContact(name, phone, email) {
  contacts[editIndex].name = name;
  contacts[editIndex].phone = phone;
  contacts[editIndex].email = email;
  if (contacts[editIndex].firebaseKey) {
    await updateContactInFirebase(contacts[editIndex].firebaseKey, { name, phone, email });
  }
  createSuccessMessage("Contact successfully updated", "successedit");
}

/**
 * Creates a new contact with the given name, phone and email.
 * Generates a unique ID, assigns a random color and adds the contact to the local contact list.
 * Shows a success message if the contact is successfully created.
 * @param {string} name - The name of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} email - The email address of the contact.
 * @returns {Promise<void>} - A promise that resolves when the contact has been created.
 */
function createNewContact(name, phone, email) {
  const newContact = { 
    id: generateUniqueId(), 
    name, 
    phone, 
    email, 
    color: getRandomColor() 
  };
  contacts.push(newContact);
  createSuccessMessage("Contact successfully created", "successcreate");
}

/**
 * Shows a success message in the given targetClass element for 3 seconds.
 * The message is displayed in the element's text content and the element's
 * classes are toggled between "hide" and "show" to show/hide the message.
 * @param {string} message - The message to be displayed.
 * @param {string} targetClass - The class of the element to display the message in.
 * @returns {void}
 */
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

/**
 * Handles the input event of the phone input field.
 * Removes all non-digit characters from the input field's value.
 * @param {Event} event - The input event object.
 * @returns {void}
 */
function validatePhoneInput(event) {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, '');
}

/**
 * Initializes event listeners for the phone input field, name input field, and contact form.
 * Attaches an input event listener to the phone input field to remove all non-digit characters from the input value.
 * Attaches an input event listener to the name input field to check if the name is valid.
 * Attaches a submit event listener to the contact form to handle the form submission.
 * @returns {void}
 */
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

/**
 * Toggles the visibility of the collapse content.
 * The content is identified by its id 'collapseContent' and the toggle button is
 * identified by its class 'collapse-button'. If the content is visible, it is
 * hidden by removing the 'open' class, otherwise it is shown by adding the 'open'
 * class.
 * @returns {void}
 */
function toggleCollapse() {
  const content = document.getElementById("collapseContent");
  const button = document.querySelector(".collapse-button");

  if (content.classList.contains("open")) {
    content.classList.remove("open");
  } else {
    content.classList.add("open");
  }
}

/**
 * Selects the contact main element and removes the selection from all other contact
 * main elements. If the element is already selected, it is deselected.
 * @param {HTMLElement} selectedElement The element to select
 * @returns {void}
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
const colors = [
  "#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD",
  "#2ECC71", "#E74C3C", "#3498DB", "#1ABC9C", "#D35400",
  "#C0392B", "#9B59B6", "#1E8449", "#F39C12", "#34495E",
  "#16A085"
];

let colorIndex = 0;
let firstCall = true;

/**
 * Returns a random color from the predefined colors array.
 * The first call to this function returns the first color in the array.
 * After the first call, the function returns the next color in the array
 * in a circular manner (i.e., it wraps around to the first color after
 * the last color in the array is reached).
 * @returns {string} A random color as a string in the format "#rrggbb"
 */
function getRandomColor() {
  if (firstCall) {
    firstCall = false;
    return colors[colorIndex]; 
  }
  colorIndex = (colorIndex + 1) % colors.length; 
  return colors[colorIndex];
}