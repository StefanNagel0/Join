let contacts = []; 
let editIndex = null;

function getInitials(name) {
  const parts = name.split(" ");
  const initials = parts.map(part => part[0]).join("").toUpperCase();
  return initials;
}

function openOverlay(mode, index = null) {
  const overlay = document.getElementById("overlay");
  const title = document.getElementById("overlay-title");
  const nameInput = document.getElementById("contact-name");
  const phoneInput = document.getElementById("contact-phone");

  if (mode === "edit") {
    title.textContent = "Kontakt bearbeiten";
    const contact = contacts[index];
    nameInput.value = contact.name;
    phoneInput.value = contact.phone;
    editIndex = index;
  } else {
    title.textContent = "Neuen Kontakt hinzufügen";
    nameInput.value = "";
    phoneInput.value = "";
    editIndex = null;
  }

  overlay.style.display = "flex";
}

function closeOverlay() {
  document.getElementById("overlay").style.display = "none";
}

function showContacts() {
  const contactlist = document.getElementById("contactlist");

  contacts.sort((a, b) => a.name.localeCompare(b.name));

  const groupedContacts = contacts.reduce((groups, contact) => {
    const letter = contact.name.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(contact);
    return groups;
  }, {});

  contactlist.innerHTML = Object.keys(groupedContacts)
    .sort()
    .map(
      letter => `
        <div class="contact-group">
          <h2>${letter}</h2>
          ${groupedContacts[letter]
            .map(
              (contact, index) => `
                <div class="contact">
                  <div class="circle">${getInitials(contact.name)}</div>
                  <div>
                    <p>${contact.name}: ${contact.phone}</p>
                    <button onclick="openOverlay('edit', ${index})">Bearbeiten</button>
                  </div>
                </div>
              `
            )
            .join("")}
        </div>
      `
    )
    .join("") || "Keine Kontakte vorhanden.";
}

document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("contact-name").value.trim();
  const phone = document.getElementById("contact-phone").value.trim();

  if (!name || !phone) {
    alert("Bitte Name und Telefonnummer eingeben!");
    return;
  }

  if (editIndex !== null) {
    contacts[editIndex] = { name, phone };
  } else {
    contacts.push({ name, phone });
  }

  closeOverlay();
  showContacts();
});

showContacts();