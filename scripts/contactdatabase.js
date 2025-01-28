
// Firebase-URL für die Kontakte
const CONTACTS_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/contacts";

/* Hinzufügen eines neuen Kontakts und direktes Hochladen zu Firebase. */
async function saveContact(name, phone, email) {
  if (editIndex !== null) {
    const contact = contacts[editIndex];
    contact.name = name;
    contact.phone = phone;
    contact.email = email;

    if (contact.firebaseKey) {
      await updateContactInFirebase(contact);
    }
    createSuccessMessage("Contact successfully updated", "successedit");
  } else {
    const newContact = { name, phone, email, color: getRandomColor() };

    // Prüfen auf Duplikate
    const isDuplicate = contacts.some(contact => contact.name === name && contact.phone === phone);
    if (isDuplicate) {
      alert("Duplicate contact detected. The contact will not be added.");
      return;
    }

    const firebaseKey = await pushContactToFirebase(newContact);

    if (firebaseKey) {
      newContact.firebaseKey = firebaseKey;
      contacts.push(newContact);
    }

    createSuccessMessage("Contact successfully created", "successcreate");
  }

  await fetchContactsFromFirebase();
}

/* Direktes Löschen eines Kontakts in Firebase und lokal. */
async function deleteContact(index) {
  const contact = contacts[index];
  if (!contact || !contact.firebaseKey) {
    console.error("Kontakt nicht gefunden oder hat keinen Firebase-Schlüssel.");
    return;
  }

  try {
    const response = await fetch(`${CONTACTS_URL}/${contact.firebaseKey}.json`, {
      method: "DELETE",
    });
    if (response.ok) {
      contacts.splice(index, 1);
      console.log(`Kontakt ${contact.name} erfolgreich gelöscht.`);
      showContacts();
    } else {
      console.error(`Fehler beim Löschen des Kontakts ${contact.name}:`, response.status);
    }
  } catch (error) {
    console.error("Netzwerkfehler beim Löschen des Kontakts:", error);
  }

  await fetchContactsFromFirebase();
}

/* Aktualisieren eines Kontakts in Firebase. */
async function updateContactInFirebase(contact) {
  try {
    const response = await fetch(`${CONTACTS_URL}/${contact.firebaseKey}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      console.error(`Fehler beim Aktualisieren des Kontakts ${contact.name}:`, response.status);
    }
  } catch (error) {
    console.error(`Netzwerkfehler beim Aktualisieren von ${contact.name}:`, error);
  }

  await fetchContactsFromFirebase(); // Synchronisierung nach Bearbeiten
}

/* Hochladen eines neuen Kontakts zu Firebase. */
async function pushContactToFirebase(contact) {
  try {
    const response = await fetch(`${CONTACTS_URL}.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Kontakt ${contact.name} erfolgreich hochgeladen.`);
      return data.name; // Firebase generiert einen Schlüssel und gibt ihn zurück
    } else {
      console.error(`Fehler beim Hochladen des Kontakts ${contact.name}:`, response.status);
      return null;
    }
  } catch (error) {
    console.error(`Netzwerkfehler beim Hochladen von ${contact.name}:`, error);
    return null;
  }
}

/* Kontakte aus Firebase abrufen, Duplikate entfernen und die lokale Liste aktualisieren. */
async function fetchContactsFromFirebase() {
  try {
    const response = await fetch(`${CONTACTS_URL}.json`, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      const firebaseContacts = Object.entries(data || {}).map(([key, value]) => ({
        ...value,
        firebaseKey: key,
      }));

      // Duplikate entfernen
      const uniqueContacts = firebaseContacts.filter((contact, index, self) =>
        index === self.findIndex(c => c.name === contact.name && c.phone === contact.phone)
      );

      contacts = uniqueContacts;
      showContacts();
    } else {
      console.error("Fehler beim Abrufen der Kontakte aus Firebase:", response.status);
    }
  } catch (error) {
    console.error("Netzwerkfehler beim Abrufen der Kontakte:", error);
  }
}

/* Initialisierung der Kontakte und Anzeige. */
async function initializeContacts() {
  await fetchContactsFromFirebase();
}

document.addEventListener("DOMContentLoaded", initializeContacts);