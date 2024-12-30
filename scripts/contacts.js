const contacts = [
    { name: "Taylan"},
    { name: "Stefan"},
    { name: "Florian"},
    { name: "Zepelin"},
    { name: "Zepelin"},
    { name: "alpha"},
    { name: "beta"},
    { name: "ceaser"},
    { name: "lupin"},
    { name: "test123"},
    { name: "HAllo"},
  ];

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
            <div id="${letter.toLowerCase()}">
              <h2 class="bigletter" >${letter}</h2>
              ${groupedContacts[letter]
                .map(
                  (contact, index) => `
                    <p>
                      ${contact.name}
                    </p>
                  `
                )
                .join("")}
            </div>
          `
        )
        .join("") || "Keine Kontakte vorhanden.";
    }


    showContacts();