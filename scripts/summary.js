document.addEventListener('DOMContentLoaded', () => {
    handleGreetingOverlay();
    setGreetingMessage();
    fetchTasks();
});

// Funktion, um die Begrüßung basierend auf der Uhrzeit zu setzen
function setGreetingMessage() {
    const greetingMessageDiv = document.getElementById('greeting-message');
    const userNameGreetingDiv = document.getElementById('user-name-greeting');
    const greetingMessageOverlay = document.getElementById('greeting-message-overlay');
    const userNameGreetingOverlay = document.getElementById('user-name-greeting-overlay');
    if (!greetingMessageDiv || !userNameGreetingDiv || !greetingMessageOverlay || !userNameGreetingOverlay) {
        console.error('Greeting elements not found in the DOM');
        return;
    }
    const greeting = getGreetingBasedOnTime();
    const userName = getUserName();
    setGreetingForElements(greeting, userName, greetingMessageDiv, userNameGreetingDiv);
    setGreetingForOverlay(greeting, userName, greetingMessageOverlay, userNameGreetingOverlay);
}

// Funktion, um die Begrüßung basierend auf der Uhrzeit zu setzen
function getGreetingBasedOnTime() {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) return 'Good Morning';
    if (currentHour >= 12 && currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
}

// Funktion, um die Begrüßung für das Haupt-Div zu setzen
function setGreetingForElements(greeting, userName, greetingMessageDiv, userNameGreetingDiv) {
    if (userName && userName.toLowerCase() !== 'guest') {
        greetingMessageDiv.textContent = `${greeting},`;
        userNameGreetingDiv.textContent = `${userName}`;
    } else {
        greetingMessageDiv.textContent = greeting;
        userNameGreetingDiv.textContent = ''; // Leer lassen, wenn der Benutzer ein Gast ist
    }
}

// Funktion, um die Begrüßung für das Overlay zu setzen
function setGreetingForOverlay(greeting, userName, greetingMessageOverlay, userNameGreetingOverlay) {
    if (userName && userName.toLowerCase() !== 'guest') {
        greetingMessageOverlay.textContent = `${greeting},`;
        userNameGreetingOverlay.textContent = `${userName}`;
    } else {
        greetingMessageOverlay.textContent = greeting;
        userNameGreetingOverlay.textContent = ''; // Leer lassen, wenn der Benutzer ein Gast ist
    }
}

// Overlay anzeigen, wenn nötig
function handleGreetingOverlay() {
    const showGreeting = new URLSearchParams(window.location.search).get('showGreeting');
    const overlay = document.getElementById('overlay_greeting');
    const greetingMessageOverlay = document.getElementById('greeting-message-overlay');
    const userNameGreetingOverlay = document.getElementById('user-name-greeting-overlay');
    
    if (shouldShowGreeting(showGreeting)) {
        const greeting = getGreetingFromDOM();
        const userName = getUserNameFromDOM();
        setGreetingForOverlay(greeting, userName, greetingMessageOverlay, userNameGreetingOverlay);
        showOverlay(overlay);
        hideOverlayAfterTimeout(overlay);
    }
}

// Überprüfen, ob das Overlay angezeigt werden soll
function shouldShowGreeting(showGreeting) {
    return showGreeting === 'true' && !localStorage.getItem('greetingShown');
}

// Begrüßung und Benutzername aus der DOM holen
function getGreetingFromDOM() {
    return document.getElementById('greeting-message').textContent;
}

function getUserNameFromDOM() {
    return document.getElementById('user-name-greeting').textContent;
}

// Begrüßung in das Overlay setzen
function setGreetingForOverlay(greeting, userName, greetingMessageOverlay, userNameGreetingOverlay) {
    greetingMessageOverlay.textContent = greeting;
    userNameGreetingOverlay.textContent = userName;
}

// Overlay anzeigen
function showOverlay(overlay) {
    overlay.style.display = 'flex';
}

// Overlay nach 3 Sekunden ausblenden
function hideOverlayAfterTimeout(overlay) {
    setTimeout(() => {
        overlay.style.display = 'none';
        localStorage.setItem('greetingShown', 'true');
    }, 3000); // 3 Sekunden lang anzeigen
}

// Benutzername abrufen
function getUserName() {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (!loggedInEmail) {
        return 'Guest';
    }
    const user = users.find(user => user.email === loggedInEmail);
    return user ? user.name : 'Guest';
}

async function fetchTasks() {
    try {
        const response = await fetch(`${BASE_URL}tasks.json`);
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        const counts = countMainCategories(data);
        const urgentData = countUrgentTasks(data);
        updateSummaryHTML(counts, urgentData);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

function countUrgentTasks(data) {
    const urgentTasks = filterUrgentTasks(data);
    sortUrgentTasks(urgentTasks);

    if (urgentTasks.length > 0) {
        const nextDueDate = urgentTasks[0].dueDate;
        const tasksWithNextDueDate = getTasksWithNextDueDate(urgentTasks, nextDueDate);
        return getTaskCountAndDueDate(tasksWithNextDueDate, nextDueDate);
    }
    
    return {
        count: 0,
        dueDate: 'N/A',
    };
}

// Filtern der dringenden Aufgaben
function filterUrgentTasks(data) {
    const urgentTasks = [];
    for (const key in data) {
        const task = data[key];
        if (task.priority && task.priority.toLowerCase() === 'urgent' && task.dueDate) {
            urgentTasks.push({
                dueDate: new Date(task.dueDate),
                task,
            });
        }
    }
    return urgentTasks;
}

// Sortieren der dringenden Aufgaben nach Fälligkeit
function sortUrgentTasks(urgentTasks) {
    urgentTasks.sort((a, b) => a.dueDate - b.dueDate);
}

// Aufgaben mit dem nächsten Fälligkeitsdatum finden
function getTasksWithNextDueDate(urgentTasks, nextDueDate) {
    return urgentTasks.filter(
        (item) => item.dueDate.getTime() === nextDueDate.getTime()
    );
}

// Anzahl der Aufgaben und das nächste Fälligkeitsdatum zurückgeben
function getTaskCountAndDueDate(tasksWithNextDueDate, nextDueDate) {
    return {
        count: tasksWithNextDueDate.length,
        dueDate: nextDueDate.toISOString().split('T')[0],
    };
}

function countMainCategories(data) {
    const counts = {
        ToDo: 0,
        InProgress: 0,
        AwaitFeedback: 0,
        Done: 0,
    };
    for (const key in data) {
        const task = data[key];
        if (counts.hasOwnProperty(task.mainCategory)) {
            counts[task.mainCategory]++;
        }
    }
    return counts;
}

function updateSummaryHTML(counts, urgentData) {
    document.getElementById('to_do_show').textContent = counts.ToDo || 0;
    document.getElementById('tasks-in-progress').textContent = counts.InProgress || 0;
    document.getElementById('tasks-in-awaiting').textContent = counts.AwaitFeedback || 0;
    document.getElementById('done_show').textContent = counts.Done || 0;
    document.getElementById('tasks-in-board').textContent =
        counts.ToDo + counts.InProgress + counts.AwaitFeedback + counts.Done;
    document.getElementById('urgent_num_show').textContent = urgentData.count;
    document.getElementById('date-of-due').textContent = urgentData.dueDate;
}
