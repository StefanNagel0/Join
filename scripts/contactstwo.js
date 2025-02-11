/* updates an existing contact with new data */
async function updateExistingContact(name, phone, email) {
    contacts[editIndex].name = name;
    contacts[editIndex].phone = phone;
    contacts[editIndex].email = email;
  
    // Update Firebase entry if applicable
    if (contacts[editIndex].firebaseKey) {
      await updateContactInFirebase(contacts[editIndex].firebaseKey, { name, phone, email });
    }
  
    createSuccessMessage("Contact successfully updated", "successedit");
  }
  /* creates a new contact and adds it to the contacts array */
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
  
  