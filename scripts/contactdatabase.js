const CONTACTS_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/contacts";


function nameValidate(event) {
  const nameInput = event.target;
  const nameError = document.getElementById("name-error");

  if (nameInput.value.trim().length < 2) {
    nameError.textContent = "Name must be at least 2 characters long.";
    nameError.style.display = "block";
    nameInput.classList.add("error-border");
  } else {
    nameError.style.display = "none";
    nameInput.classList.remove("error-border");
  }
}

function validateEmail(event) {
  const emailInput = event.target;
  const emailError = document.getElementById("email-error");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|de|at|net|org|ch|uk)$/i;

  if (!emailRegex.test(emailInput.value)) {
    emailError.textContent = "Invalid email format (allowed: .com, .de, .at, etc.).";
    emailError.style.display = "block";
    emailInput.classList.add("error-border");
  } else {
    emailError.style.display = "none";
    emailInput.classList.remove("error-border");
  }
}

function validatePhone(event) {
  const phoneInput = event.target;
  const phoneError = document.getElementById("phone-error");
  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(phoneInput.value)) {
    phoneError.textContent = "Phone number must be exactly 10 digits.";
    phoneError.style.display = "block";
    phoneInput.classList.add("error-border");
  } else {
    phoneError.style.display = "none";
    phoneInput.classList.remove("error-border");
  }
} 

async function syncContacts() {
  try {
    const response = await fetch(`${CONTACTS_URL}.json`, { method: "GET" });
    if (response.ok) {
      const data = await response.json();
      contacts = data
        ? Object.entries(data).map(([key, value]) => ({ ...value, firebaseKey: key }))
        : [];
      showContacts(); // UI aktualisieren

      // Sicherstellen, dass das Element existiert, bevor getAttribute aufgerufen wird
      const detailsDiv = document.getElementById("contact-details");
      if (detailsDiv) {
        const openContactIndex = detailsDiv.getAttribute("data-contact-index");
        if (openContactIndex !== null) {
          showContactDetails(parseInt(openContactIndex)); // Neu laden
        }
      }
    } else {
      console.error("Fehler beim Abrufen der Kontakte aus Firebase:", response.status);
    }
  } catch (error) {
    console.error("Netzwerkfehler beim Abrufen der Kontakte:", error);
  }
}

/* Speichert einen neuen Kontakt oder aktualisiert einen bestehenden.*/
async function saveContact(name, phone, email) {
  if (!name || !phone || !email) {
    return;
  }

  let savedIndex = null;

  if (editIndex !== null) {
    const contact = contacts[editIndex];
    contact.name = name;
    contact.phone = phone;
    contact.email = email;

    if (contact.firebaseKey) {
      await updateContactInFirebase(contact);
      createSuccessMessage("Contact successfully updated", "successedit");
    }
    savedIndex = editIndex;
    editIndex = null;
  } else {
    const newContact = { name, phone, email, color: getRandomColor() };
    const isDuplicate = contacts.some(c => c.name === name && c.phone === phone);
    if (isDuplicate) {
      alert("Duplicate contact detected. The contact will not be added.");
      return;
    }

    const firebaseKey = await pushContactToFirebase(newContact);
    if (firebaseKey) {
      newContact.firebaseKey = firebaseKey;
      contacts.push(newContact);
      savedIndex = contacts.length - 1;
      createSuccessMessage("Contact successfully created", "successcreate");
    }
  }

  await syncContacts();

  // Falls ein Kontakt gespeichert wurde, lade ihn sofort in contact-details
  if (savedIndex !== null) {
    showContactDetails(savedIndex);
  }
}

/* Löscht einen Kontakt aus Firebase und der lokalen Liste. */
async function deleteContact(index) {
  try {
    if (index < 0 || index >= contacts.length) return;

    const contact = contacts[index];
    if (!contact || !contact.firebaseKey) return;

    const deleteURL = `${CONTACTS_URL}/${contact.firebaseKey}.json`;

    const response = await fetch(deleteURL, { method: "DELETE" });
    if (!response.ok) return;

    // Entferne den Kontakt aus der lokalen Liste
    contacts = contacts.filter(c => c.firebaseKey !== contact.firebaseKey);

    await syncContacts(); // Aktualisiere die Kontaktliste in der UI

    // Bestimme den nächsten anzuzeigenden Kontakt
    let nextIndex = index; // Versuche, den nächsten Kontakt anzuzeigen
    if (nextIndex >= contacts.length) {
      nextIndex = contacts.length - 1; // Falls letzter Kontakt gelöscht wurde, gehe einen zurück
    }

    // Falls noch Kontakte vorhanden sind, lade den nächsten Kontakt in `contact-details`
    if (contacts.length > 0 && nextIndex >= 0) {
      showContactDetails(nextIndex);
    } else {
      // Falls keine Kontakte mehr vorhanden sind, leere `contact-details`
      const detailsDiv = document.getElementById("contact-details");
      detailsDiv.innerHTML = "<p>Kein Kontakt ausgewählt.</p>";
      detailsDiv.classList.add("hide");
    }

    showContacts(); // Aktualisiere die Anzeige der Kontaktliste

  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

/* Speichert einen neuen Kontakt in Firebase. */
async function pushContactToFirebase(contact) {
  try {
    const response = await fetch(`${CONTACTS_URL}.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });

    if (response.ok) {
      const data = await response.json();
      return data.name;
    }
  } catch (error) {
    console.error("Fehler beim Hochladen des Kontakts:", error);
  }
  return null;
}

/* Aktualisiert einen bestehenden Kontakt in Firebase. Das aktualisierte Kontakt-Objekt mit Firebase-Key.*/
async function updateContactInFirebase(contact) {
  if (!contact || !contact.firebaseKey) {
    console.error("Fehler: Kontakt oder Firebase-Key fehlt.");
    return;
  }

  try {
    const updateURL = `${CONTACTS_URL}/${contact.firebaseKey}.json`;
    const response = await fetch(updateURL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });

    if (response.ok) {
      createSuccessMessage("Contact successfully updated", "successedit");
      await syncContacts(); // Firebase und UI synchronisieren
    } else {
      console.error(`Fehler beim Aktualisieren von ${contact.name}:`, response.status, await response.text());
    }
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kontakts:", error);
  }
}


/* Wird beim Laden der Seite aufgerufen, um die Kontakte zu synchronisieren. */
document.addEventListener("DOMContentLoaded", syncContacts);
