// Funktion, um die Begrüßung basierend auf der Uhrzeit zu setzen
function setGreetingMessage() {
    const greetingMessageDiv = document.getElementById('greeting-message');
    const userNameGreetingDiv = document.getElementById('user-name-greeting');

    if (!greetingMessageDiv || !userNameGreetingDiv) {
        console.error('Greeting elements not found in the DOM');
        return;
    }
    const currentHour = new Date().getHours();
    let greeting = '';
    if (currentHour >= 5 && currentHour < 12) {
        greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = 'Good Afternoon';
    } else {
        greeting = 'Good Evening';
    }
    const userName = getUserName();
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


async function fetchTasks() {
    try {
        // Daten von Firebase abrufen
        const response = await fetch(`${BASE_URL}tasks.json`);
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        // MainCategories zählen
        const counts = countMainCategories(data);

        // Tasks mit "Urgent"-Prio und nächstem Due Date filtern
        const urgentData = countUrgentTasks(data);

        // HTML aktualisieren
        updateSummaryHTML(counts, urgentData);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Tasks mit Priorität "Urgent" und nächstem Due Date filtern
function countUrgentTasks(data) {
    const urgentTasks = [];

    for (const key in data) {
        const task = data[key];
        if (
            task.priority &&
            task.priority.toLowerCase() === 'urgent' && // Groß-/Kleinschreibung ignorieren
            task.dueDate
        ) {
            urgentTasks.push({
                dueDate: new Date(task.dueDate),
                task,
            });
        }
    }

    // Nach Fälligkeitsdatum sortieren
    urgentTasks.sort((a, b) => a.dueDate - b.dueDate);

    if (urgentTasks.length > 0) {
        const nextDueDate = urgentTasks[0].dueDate;
        const tasksWithNextDueDate = urgentTasks.filter(
            (item) => item.dueDate.getTime() === nextDueDate.getTime()
        );

        return {
            count: tasksWithNextDueDate.length,
            dueDate: nextDueDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        };
    }

    return {
        count: 0,
        dueDate: 'N/A',
    };
}


// MainCategories zählen
function countMainCategories(data) {
    const counts = {
        ToDo: 0,
        InProgress: 0,
        AwaitFeedback: 0,
        Done: 0
    };
    for (const key in data) {
        const task = data[key];
        if (counts.hasOwnProperty(task.mainCategory)) {
            counts[task.mainCategory]++;
        }
    }
    return counts;
}

// HTML aktualisieren
function updateSummaryHTML(counts, urgentData) {
    document.getElementById('to_do_show').textContent = counts.ToDo || 0;
    document.getElementById('tasks-in-progress').textContent = counts.InProgress || 0;
    document.getElementById('tasks-in-awaiting').textContent = counts.AwaitFeedback || 0;
    document.getElementById('done_show').textContent = counts.Done || 0;
    // Optional: Anzahl der Aufgaben insgesamt
    document.getElementById('tasks-in-board').textContent =
        counts.ToDo + counts.InProgress + counts.AwaitFeedback + counts.Done;

    // Urgent-Daten anzeigen
    document.getElementById('urgent_num_show').textContent = urgentData.count;
    document.getElementById('date-of-due').textContent = urgentData.dueDate;
}

// Seite initialisieren
document.addEventListener('DOMContentLoaded', fetchTasks);
