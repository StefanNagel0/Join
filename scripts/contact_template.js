/* Displays the details of a specific contact. */
function showContactDetails(index) {
    const contact = contacts[index];
    const contactList = document.querySelector(".scrolllist");
    const detailsDiv = document.getElementById("contact-details");

    // Display contact details in the details div
    detailsDiv.innerHTML = createContactDetails(contact);
    detailsDiv.classList.add("show");
    detailsDiv.classList.remove("hide");

    // Hide details if switching to mobile view for the first time
    if (window.innerWidth <= 900 && !detailsDiv.dataset.hiddenOnce) {
        detailsDiv.classList.add("hide");
        detailsDiv.classList.remove("show");
        detailsDiv.dataset.hiddenOnce = true;
    }

    // Adjust layout for mobile view
    if (window.innerWidth <= 900) {
        detailsDiv.innerHTML = `
        <div class="backto">
            <div class="detailsheader">
                <h1>Contacts</h1>
                <p>Better with a team</p>
                <hr style="width: 90px; height: 0; border: 3px solid; border-color: #29ABE2;">
            </div>
            <button class="back-button arrow" onclick="showContactList()">←</button>
        </div>
        <div class="details-container">
            <div class="detailscircle">
                <div class="circle circlecont" style="background-color: ${contact.color || getRandomColor()}">
                    ${getInitials(contact.name)}
                </div>
                <p>${contact.name}</p>
            </div>
            <h2>Contact Information</h2>
            <p class="infom"><strong class="topic">Email</strong>${contact.email}</p>
            <p class="infom"><strong class="topic">Phone</strong>${contact.phone}</p>
            <button class="collapse-button btnmobile btnmob" onclick="toggleCollapse()">
                <img src="../assets/icons/contact/more.png">
            </button>
            <div class="collapse-content" id="collapseContent">
                <button class="edit-button" onclick="openOverlay('edit', ${contacts.indexOf(contact)})">
                    <img src="../assets/icons/contact/edit.png">Edit
                </button>
                <button class="delete-button" onclick="deleteContact(${index})">
                    <img src="../assets/icons/contact/delete.png">Delete
                </button>
            </div>
            <div class="successedit hide"></div>
        </div>
        `;
        detailsDiv.classList.add("show");
        detailsDiv.classList.remove("hide");

        contactList.classList.add("hide");
        contactList.classList.remove("show");
    }
}

/* Generates the HTML structure for the details of a contact. */
function createContactDetails(contact) {
    return `
      <div class="detailscircle">
      <div class="circle circlecont" style="background-color: ${contact.color};">
        ${getInitials(contact.name)}
      </div>
      <div class="editdelete">
      <p class="contactnames">${contact.name}</p>
      <div class="contbtn">
      <button class="edit-button" onclick="openOverlay('edit', ${contacts.indexOf(contact)})">
        <img src="../assets/icons/contact/edit.png">Edit
      </button>
      <button class="delete-button" onclick="deleteContact(${contacts.indexOf(contact)})">
        <img src="../assets/icons/contact/delete.png">Delete
      </button>
      </div>
      </div>
      </div>
      <div class="info">
      <p class="infop">Contact Information</p>
      <div>
      <p class="infom"><strong class="topic">E-Mail</strong><a class="mail">${contact.email}</a></p>
      <p class="infom"><strong class="topic">Phone</strong>${contact.phone}</p>
      <div class="successedit"></div>
      </div>
      </div>
    `;
}

/* Handles the window resize event to adjust visibility of the contact list */
let previousWidth = window.innerWidth; 

window.addEventListener("resize", () => {
    const detailsDiv = document.getElementById("contact-details");
    const contactList = document.querySelector(".scrolllist");

    if (!detailsDiv) return;

    const currentWidth = window.innerWidth;

    // Handle switch to mobile view
    if (currentWidth <= 900 && previousWidth > 900) {
        if (detailsDiv.classList.contains("show")) {
            detailsDiv.classList.add("hide");
            detailsDiv.classList.remove("show");
        }
    }

    // Handle switch to desktop view
    if (currentWidth > 900 && previousWidth <= 900) {
        if (detailsDiv.classList.contains("show")) {
            detailsDiv.classList.remove("show");
            detailsDiv.classList.add("hide");
        }

        contactList.classList.add("show");
        contactList.classList.remove("hide");
    }

    previousWidth = currentWidth;
});

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