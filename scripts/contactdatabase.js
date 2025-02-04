const CONTACTS_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/contacts";

/*Synchronisiert die Kontakte mit Firebase und aktualisiert die UI.*/
async function syncContacts() {
  try {
    const response = await fetch(`${CONTACTS_URL}.json`, { method: "GET" });
    if (response.ok) {
      const data = await response.json();
      contacts = data
        ? Object.entries(data).map(([key, value]) => ({ ...value, firebaseKey: key }))
        : [];

      console.log("Kontakte erfolgreich synchronisiert:", contacts);
      showContacts(); // UI aktualisieren
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
    alert("Bitte fülle alle Felder aus.");
    return;
  }

  if (editIndex !== null) {
    const contact = contacts[editIndex];
    contact.name = name;
    contact.phone = phone;
    contact.email = email;

    if (contact.firebaseKey) {
      await updateContactInFirebase(contact);
      createSuccessMessage("Contact successfully updated", "successedit");
    }
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
      createSuccessMessage("Contact successfully created", "successcreate");
    }
  }
  await syncContacts();
}

/* Löscht einen Kontakt aus Firebase und der lokalen Liste. */
async function deleteContact(index) {
  if (index === undefined || index < 0 || index >= contacts.length) {
    console.error("Ungültiger Index beim Löschen.");
    return;
  }

  const contact = contacts[index];

  if (!contact || !contact.firebaseKey) {
    console.error("Kontakt oder Firebase-Key fehlt.");
    return;
  }

  try {
    const deleteURL = `${CONTACTS_URL}/${contact.firebaseKey}.json`;
    console.log(`Lösche Kontakt: ${contact.name} (${deleteURL})`);

    const response = await fetch(deleteURL, { method: "DELETE" });
    
    if (response.ok) {
      console.log(`Kontakt ${contact.name} erfolgreich gelöscht.`);
      contacts = contacts.filter(c => c.firebaseKey !== contact.firebaseKey);
      await syncContacts();
      location.reload();
    } else {
      console.error(`Fehler beim Löschen von ${contact.name}:`, response.status, await response.text());
    }
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
      console.log(`Kontakt erfolgreich hochgeladen: ${contact.name}`);
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
      console.log(`Kontakt ${contact.name} erfolgreich aktualisiert.`);
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
