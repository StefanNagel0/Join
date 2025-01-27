/* Array of contact objects. */
let contacts = [
  { name: "Anna Müller", phone: "017799988877", email: "anna.mueller@example.com" },
  { name: "Peter Schmidt", phone: "015612345678", email: "peter.schmidt@example.com" },
  { name: "Julia Hoffmann", phone: "015799988877", email: "julia.hoffmann@example.com" },
  { name: "Lukas Maier", phone: "016612345678", email: "lukas.maier@example.com" },
  { name: "Sophia Fischer", phone: "016799988877", email: "sophia.fischer@example.com" },
  { name: "Nina Braun", phone: "017633345555", email: "nina.braun@example.com" },
  { name: "Felix Wagner", phone: "015722244477", email: "felix.wagner@example.com" },
  { name: "Tom Richter", phone: "016622333111", email: "tom.richter@example.com" },
  { name: "Mia Neumann", phone: "017811122233", email: "mia.neumann@example.com" },
  { name: "Paul Weiß", phone: "016699988877", email: "paul.weiss@example.com" },
  { name: "Clara Becker", phone: "015722233344", email: "clara.becker@example.com" },
  { name: "Jonas Zimmer", phone: "017633344455", email: "jonas.zimmer@example.com" },
  { name: "Emma Hoffmann", phone: "016811223344", email: "emma.hoffmann@example.com" },
  { name: "Leon Maier", phone: "015799911122", email: "leon.maier@example.com" },
  { name: "Maria Lange", phone: "017811122333", email: "maria.lange@example.com" },
  { name: "Tom Schäfer", phone: "016722244455", email: "tom.schaefer@example.com" },
  { name: "Laura Klein", phone: "015622233344", email: "laura.klein@example.com" },
  { name: "Tim Braun", phone: "017899933322", email: "tim.braun@example.com" },
  { name: "Nina Wagner", phone: "016799911123", email: "nina.wagner@example.com" }
];

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

/* Sets up the overlay for editing an existing contact. */
function setupEditContact(index) {
  const title = document.querySelector(".overlay-left h1");
  const description = document.querySelector(".description");
  const nameInput = document.getElementById("contact-name");
  const phoneInput = document.getElementById("contact-phone");
  const emailInput = document.getElementById("contact-email");
  const circleDiv = document.querySelector(".overlay-content .circle");
  const submitButton = document.querySelector(".submit"); 
  const cancelButton = document.querySelector(".cancel"); 

  const contact = contacts[index];
  title.textContent = "Edit Contact";
  description.textContent = "";
  nameInput.value = contact.name;
  phoneInput.value = contact.phone;
  emailInput.value = contact.email || "";
  circleDiv.textContent = getInitials(contact.name);
  circleDiv.style.backgroundColor = contact.color || getRandomColor();
  submitButton.innerHTML = `Save <img class="check" src="../assets/icons/contact/check.png">`; 

  cancelButton.innerHTML = `Delete`;
  cancelButton.setAttribute("onclick", `deleteContact(${index})`);
  editIndex = index;
}

/* Sets up the overlay for adding a new contact. */
function setupNewContact() {
  const title = document.querySelector(".overlay-left h1");
  const description = document.querySelector(".description");
  const nameInput = document.getElementById("contact-name");
  const phoneInput = document.getElementById("contact-phone");
  const emailInput = document.getElementById("contact-email");
  const circleDiv = document.querySelector(".overlay-content .circle");
  const submitButton = document.querySelector(".submit"); 
  const cancelButton = document.querySelector(".cancel"); 

  title.textContent = "Add Contact";
  description.textContent = "Tasks are better with a team!";
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
  circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
  circleDiv.style.backgroundColor = "";
  submitButton.innerHTML = `Create contact <img class="check" src="../assets/icons/contact/check.png">`; 

  cancelButton.innerHTML = `Cancel <img class="cancelicon" src="../assets/icons/contact/cancel.png">`;
  cancelButton.setAttribute("onclick", "closeOverlay()");
  editIndex = null;
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

/* Creates a contact div element. */
function createContactDiv(contact) {
  const contactDiv = document.createElement("div");
  contactDiv.classList.add("contact");

  const initials = getInitials(contact.name);
  contactDiv.innerHTML = `
    <div class="contactmain" onclick="selectContactMain(this), showContactDetails(${contacts.indexOf(contact)})">
      <div class="circle" style="background-color: ${contact.color};">
        ${initials || `<img class="concircle" src="../assets/icons/contact/circledefault.png">`}
      </div>
      <div class="listdesign">
        <p class="name" style="cursor: pointer;">
          ${contact.name}
        </p>
        <p class="emails">${contact.email}</p>
      </div>
    </div>
  `;

  return contactDiv;
}

/* Displays the contact list and hides the details view. */
function showContactList() {
  const contactList = document.querySelector(".scrolllist");
  const detailsDiv = document.getElementById("contact-details");

  contactList.classList.add("show");
  contactList.classList.remove("hide");

  detailsDiv.classList.add("hide");
  detailsDiv.classList.remove("show");
}

/* Deletes a contact by index and updates the contact list. */
function deleteContact(index) {
  const overlay = document.getElementById("confirm-overlay");
  const yesButton = document.getElementById("confirm-yes");
  const noButton = document.getElementById("confirm-no");
  overlay.classList.remove("hide");

  yesButton.onclick = () => {
    contacts.splice(index, 1);
    showContacts();
    document.getElementById("contact-details").style.display = "none";
    closeOverlay();
    overlay.classList.add("hide");
  };

  noButton.onclick = () => {
    overlay.classList.add("hide");
  };
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
  // Überprüfen, ob das Element bereits ausgewählt ist
  const isSelected = selectedElement.classList.contains('selected');

  // Entferne die Auswahl von allen anderen Elementen
  const allContacts = document.querySelectorAll('.contactmain');
  allContacts.forEach((element) => {
    element.classList.remove('selected');
  });

  // Falls das Element nicht ausgewählt war, wähle es aus
  if (!isSelected) {
    selectedElement.classList.add('selected');
  }
}

/* Displays the contact list on page load.*/
showContacts();
