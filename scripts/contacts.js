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

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function openOverlay(mode, index = null) {
  const overlay = document.getElementById("overlay");
  const title = document.querySelector(".overlay-left h1");
  const nameInput = document.getElementById("contact-name");
  const phoneInput = document.getElementById("contact-phone");
  const emailInput = document.getElementById("contact-email");
  const circleDiv = document.querySelector(".overlay-content .circle");

  if (mode === "edit") {
    title.textContent = "Kontakt bearbeiten";
    const contact = contacts[index];
    nameInput.value = contact.name;
    phoneInput.value = contact.phone;
    emailInput.value = contact.email || "";
    circleDiv.textContent = getInitials(contact.name);
    circleDiv.style.backgroundColor = getRandomColor();
    editIndex = index;
  } else {
    nameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";
    circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
    circleDiv.style.backgroundColor = "";
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

  detailsDiv.innerHTML = `
    <p>Name: ${contact.name}</p>
    <p>Telefon: ${contact.phone}</p>
    <p>E-Mail: ${contact.email}</p>
  `;

  detailsDiv.style.display = "block";
}

function showContacts() {
  const contactlist = document.getElementById("contactlist");
  contactlist.innerHTML = "";

  contacts.sort((a, b) => a.name.localeCompare(b.name));

  const groupedContacts = contacts.reduce((groups, contact) => {
    const letter = contact.name.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(contact);
    return groups;
  }, {});

  Object.keys(groupedContacts)
    .sort()
    .forEach(letter => {
      const groupDiv = document.createElement("div");
      groupDiv.classList.add("contact-group");
      groupDiv.innerHTML = `<h2 class="bigletter">${letter}</h2><hr>`;

      groupedContacts[letter].forEach(contact => {
        const contactDiv = document.createElement("div");
        contactDiv.classList.add("contact");
        const color = getRandomColor(); // Zufällige Farbe
        const initials = getInitials(contact.name);

        contactDiv.innerHTML = `
          <div class="circle" style="background-color: ${color};">
            ${initials || `<img class="concircle" src="../assets/icons/contact/circledefault.png">`}
          </div>
          <div>
            <p class="name" onclick="showContactDetails(${contacts.indexOf(contact)})" style="cursor: pointer;">
              ${contact.name}
            </p>
          </div>
        `;

        groupDiv.appendChild(contactDiv);
      });

      contactlist.appendChild(groupDiv);
    });
}

document.getElementById("contact-name").addEventListener("input", function (e) {
  const name = e.target.value.trim();
  const circleDiv = document.querySelector(".overlay-content .circle");

  if (name) {
    circleDiv.textContent = getInitials(name);
    circleDiv.style.backgroundColor = getRandomColor();
  } else {
    circleDiv.innerHTML = `<img class="concircle" src="../assets/icons/contact/circledefault.png">`;
    circleDiv.style.backgroundColor = "";
  }
});

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