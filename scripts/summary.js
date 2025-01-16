// Funktion, um die Begrüßung basierend auf der Uhrzeit zu setzen
function setGreetingMessage() {
    const greetingMessageDiv = document.getElementById('greeting-message');
    const userNameGreetingDiv = document.getElementById('user-name-greeting');
    // Aktuelle Uhrzeit abrufen
    const currentHour = new Date().getHours();
    // Begrüßung basierend auf der Uhrzeit setzen
    let greeting = '';
    if (currentHour >= 5 && currentHour < 12) {
        greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = 'Good Afternoon';
    } else {
        greeting = 'Good Evening';
    }
    // Beispiel: Benutzername abrufen (kann z. B. aus einer Session oder einem Eingabeformular stammen)
    const userName = getUserName(); // Diese Funktion simuliert die Benutzerdaten
    // Überprüfen, ob der Benutzer "Guest" ist
    if (userName && userName.toLowerCase() !== 'guest') {
        // Benutzer ist kein Gast: Begrüßung mit Komma und Name anzeigen
        greetingMessageDiv.textContent = `${greeting},`;
        userNameGreetingDiv.textContent = `Welcome, ${userName}!`;
    } else {
        // Benutzer ist ein Gast: Nur Begrüßung ohne Komma
        greetingMessageDiv.textContent = greeting;
        userNameGreetingDiv.textContent = ''; // Leer lassen, wenn der Benutzer ein Gast ist
    }
}
// Funktion, um einen Benutzernamen zu simulieren (kann später ersetzt werden)
function getUserName() {
    // Hier kannst du den Benutzernamen dynamisch aus einer Quelle abrufen
    return 'Guest'; // Beispiel: "John Doe" oder "Guest"
}
// Begrüßungsnachricht anzeigen lassen, wenn die Seite geladen wird
document.addEventListener('DOMContentLoaded', setGreetingMessage);




function updateSummary() {
    // Zähle die Anzahl der Aufgaben (div.task) in den jeweiligen Containern
    const toDoCount = document.querySelectorAll('#tasksContainerToDo .task').length;
    const inProgressCount = document.querySelectorAll('#tasksContainerInProgress .task').length;
    const awaitingFeedbackCount = document.querySelectorAll('#tasksContainerAwaitFeedback .task').length;
    const doneCount = document.querySelectorAll('#tasksContainerDone .task').length;

    // Aktualisiere die entsprechenden HTML-Elemente mit den gezählten Werten
    document.getElementById('to_do_show').textContent = toDoCount;
    document.getElementById('tasks-in-progress').textContent = inProgressCount;
    document.getElementById('tasks-in-awaiting').textContent = awaitingFeedbackCount;
    document.getElementById('done_show').textContent = doneCount;

    // Gesamtanzahl der Tasks (in allen Containern zusammen)
    const totalTasks = toDoCount + inProgressCount + awaitingFeedbackCount + doneCount;
    document.getElementById('tasks-in-board').textContent = totalTasks;

    // Dringende Aufgaben und früheste Fälligkeit
    const allTasks = Array.from(document.querySelectorAll('.task'));
    const urgentTasks = allTasks.filter(task => task.dataset.priority === 'Urgent');
    if (urgentTasks.length > 0) {
        const earliestUrgentTask = urgentTasks.reduce((earliest, current) =>
            new Date(current.dataset.dueDate) < new Date(earliest.dataset.dueDate) ? current : earliest
        );
        const earliestDueDateTasks = urgentTasks.filter(task =>
            task.dataset.dueDate === earliestUrgentTask.dataset.dueDate
        );

        // Aktualisiere die HTML-Elemente für dringende Aufgaben
        document.getElementById('urgent_num_show').textContent = earliestDueDateTasks.length;
        document.getElementById('date-of-due').textContent = earliestUrgentTask.dataset.dueDate;
    } else {
        document.getElementById('urgent_num_show').textContent = 0;
        document.getElementById('date-of-due').textContent = 'No urgent tasks';
    }
}

// Beispiel: Rufe `updateSummary` auf, nachdem neue Aufgaben hinzugefügt wurden
function addTaskToContainer(containerId, taskHtml) {
    const container = document.getElementById(containerId);
    container.insertAdjacentHTML('beforeend', taskHtml);
    updateSummary(); // Aktualisiere die Zählung nach dem Hinzufügen
}