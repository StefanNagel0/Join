let contacts = [
    {
      name: "Taylan Umucu",
      phone: "017612345678",
      email: "taylan.umucu@example.com"
    },
    {
        name: "Bert Klaus",
        phone: "017612345678",
        email: "test@example.com"
      }
  ];
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
    const emailInput = document.getElementById("contact-email");
  
    if (mode === "edit") {
      title.textContent = "Kontakt bearbeiten";
      const contact = contacts[index];
      nameInput.value = contact.name;
      phoneInput.value = contact.phone;
      emailInput.value = contact.email || "";
      editIndex = index;
    } else {
      title.textContent = "Neuen Kontakt hinzufügen";
      nameInput.value = "";
      phoneInput.value = "";
      emailInput.value = "";
      editIndex = null;
    }
  
    overlay.classList.remove("hide");
    overlay.classList.add("show");
    overlay.style.display = "flex";
  }
  
  function closeOverlay() {
    const overlay = document.getElementById("overlay");
    overlay.classList.remove("show");
    overlay.classList.add("hide");
    setTimeout(() => {
      overlay.style.display = "none";
    }, 300);
  }

  function showContactDetails(index) {
    const contact = contacts[index];
    const detailsDiv = document.getElementById("contact-details");
    document.getElementById("details-name").textContent = `Name: ${contact.name}`;
    document.getElementById("details-phone").textContent = `Telefon: ${contact.phone}`;
    document.getElementById("details-email").textContent = `E-Mail: ${contact.email}`;
    detailsDiv.style.display = "block";
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
                      <p onclick="showContactDetails(${index})" style="cursor: pointer; text-decoration: underline; color: blue;">
                        ${contact.name}
                      </p>
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
    const email = document.getElementById("contact-email").value.trim();
  
    if (!name || !phone) {
      alert("Bitte Name und Telefonnummer eingeben!");
      return;
    }
  
    if (editIndex !== null) {
      contacts[editIndex] = { name, phone, email };
    } else {
      contacts.push({ name, phone, email });
    }
  
    closeOverlay();
    showContacts();
  });
  
  showContacts();