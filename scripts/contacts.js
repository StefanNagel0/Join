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

async function deleteContact(id) {
  const contactIndex = contacts.findIndex(contact => contact.id === id);
  if (contactIndex === -1) {
    console.error(`Kontakt mit ID ${id} nicht gefunden.`);
    return;
  }

  const contact = contacts[contactIndex];

  try {
    if (contact.firebaseKey) {
      const response = await fetch(`${CONTACTS_URL}/contacts/${contact.firebaseKey}.json`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log(`Kontakt ${contact.name} erfolgreich gelöscht.`);
      } else {
        console.error(`Fehler beim Löschen des Kontakts ${contact.name}:`, response.status);
      }
    }

    contacts.splice(contactIndex, 1);
    console.log(`Kontakt mit ID ${id} wurde lokal gelöscht.`);
    if (typeof showContacts === "function") {
      showContacts();
    }
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
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
// Firebase-URL für die Kontakte
const CONTACTS_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/contacts.json";

// ID-Tracker für neue Kontakte
let nextId = 1;

/**
 * Lädt alle Kontakte aus der Firebase-Datenbank herunter und aktualisiert die lokale Kontaktliste.
 */
async function fetchContactsFromFirebase() {
  try {
    const response = await fetch(CONTACTS_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data) {
        const firebaseContacts = Object.entries(data).map(([key, value]) => ({
          ...value,
          firebaseKey: key, // Speichere den Firebase-Schlüssel
        }));
        firebaseContacts.forEach(contact => {
          if (!contacts.find(c => c.id === contact.id)) {
            contacts.push(contact);
            if (contact.id >= nextId) {
              nextId = contact.id + 1; // Aktualisiere nextId basierend auf den vorhandenen IDs
            }
          }
        });
        console.log("Kontakte aus Firebase aktualisiert:", contacts);
        if (typeof showContacts === "function") showContacts();
      }
    } else {
      console.error("Fehler beim Abrufen der Kontakte aus Firebase:", response.status);
    }
  } catch (error) {
    console.error("Netzwerkfehler beim Abrufen der Kontakte:", error);
  }
}

/**
 * Pusht einen einzelnen Kontakt zur Firebase-Datenbank.
 * @param {Object} contact - Der Kontakt, der hochgeladen werden soll.
 */
async function pushContactToFirebase(contact) {
  try {
    const response = await fetch(CONTACTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Kontakt ${contact.name} erfolgreich hochgeladen:`, data);
      contact.uploaded = true; // Kontakt als hochgeladen markieren
    } else {
      console.error(`Fehler beim Hochladen des Kontakts ${contact.name}:`, response.status);
    }
  } catch (error) {
    console.error(`Netzwerkfehler beim Hochladen von ${contact.name}:`, error);
  }
}

/**
 * Aktualisiert einen bestehenden Kontakt in der Firebase-Datenbank.
 * @param {Object} contact - Der Kontakt, der bearbeitet werden soll.
 */
async function updateContactInFirebase(contact) {
  if (!contact.firebaseKey) {
    console.error("Kontakt hat keinen Firebase-Schlüssel:", contact);
    return;
  }
  try {
    const response = await fetch(`${CONTACTS_URL}/${contact.firebaseKey}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    if (response.ok) {
      console.log(`Kontakt ${contact.name} erfolgreich bearbeitet.`);
    } else {
      console.error(`Fehler beim Bearbeiten des Kontakts ${contact.name}:`, response.status);
    }
  } catch (error) {
    console.error(`Netzwerkfehler beim Bearbeiten von ${contact.name}:`, error);
  }
}

/**
 * Bearbeitet einen bestehenden Kontakt lokal und in Firebase.
 * @param {number} id - Die ID des zu bearbeitenden Kontakts.
 * @param {string} name - Der neue Name.
 * @param {string} phone - Die neue Telefonnummer.
 * @param {string} email - Die neue E-Mail-Adresse.
 */
async function editContact(id, name, phone, email) {
  const contact = contacts.find(contact => contact.id === id);
  if (contact) {
    contact.name = name;
    contact.phone = phone;
    contact.email = email;
    await updateContactInFirebase(contact); // Kontakt in Firebase aktualisieren
    console.log(`Kontakt mit ID ${id} wurde bearbeitet.`);
    if (typeof showContacts === "function") showContacts();
  } else {
    console.error("Kontakt mit ID", id, "nicht gefunden.");
  }
}

/**
 * Überprüft neue Kontakte, die noch nicht hochgeladen wurden, und lädt sie hoch.
 */
async function checkAndUploadNewContacts() {
  for (const contact of contacts) {
    if (!contact.uploaded) {
      await pushContactToFirebase(contact); // Nur Kontakte hochladen, die noch nicht hochgeladen wurden
    }
  }
}

/**
 * Startet den Intervallprozess für regelmäßige Überprüfung und Synchronisierung.
 */
function startSyncProcess() {
  setInterval(async () => {
    console.log("Synchronisation gestartet...");
    await fetchContactsFromFirebase(); // Kontakte aus Firebase abrufen
    await checkAndUploadNewContacts(); // Neue Kontakte hochladen
    console.log("Synchronisation abgeschlossen.");
  }, 500000000000); // Alle 5 Sekunden
}

// Initialisierung
async function initializeContacts() {
  await fetchContactsFromFirebase(); // Vorhandene Kontakte abrufen
  startSyncProcess(); // Synchronisierung starten
}

initializeContacts();

// Beispiel für neuen Kontakt
// addNewContact("Max Mustermann", "0123456789", "max.mustermann@example.com");
// Beispiel für Kontakt bearbeiten
// editContact(1, "Max Mustermann", "0987654321", "max@example.com");
// Beispiel für Kontakt löschen
// deleteContact(1);