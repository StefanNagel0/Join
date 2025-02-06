document.addEventListener('DOMContentLoaded', () => {
    handleGreetingOverlay();
    setGreetingMessage();
    fetchTasks();
});


const REGISTRATION_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/";


/** Sets the greeting message based on the current time and user.*/
async function setGreetingMessage() {
    const greetingMessageDiv = document.getElementById('greeting-message');
    const userNameGreetingDiv = document.getElementById('user-name-greeting');
    const greetingMessageOverlay = document.getElementById('greeting-message-overlay');
    const userNameGreetingOverlay = document.getElementById('user-name-greeting-overlay');
    if (!greetingMessageDiv || !userNameGreetingDiv || !greetingMessageOverlay || !userNameGreetingOverlay) {
        console.error('Greeting elements not found in the DOM');
        return;
    }
    const greeting = getGreetingBasedOnTime();
    const userName = await getUserName();
    setGreetingForElements(greeting, userName, greetingMessageDiv, userNameGreetingDiv);
    setGreetingForOverlay(greeting, userName, greetingMessageOverlay, userNameGreetingOverlay);
}

/** Returns a greeting based on the current time. */
function getGreetingBasedOnTime() {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) return 'Good Morning';
    if (currentHour >= 12 && currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
}

/** Sets the greeting message for the main elements. */
async function setGreetingForElements(greeting, userName, greetingMessageDiv, userNameGreetingDiv) {
    if (userName && userName.toLowerCase() !== 'guest') {
        greetingMessageDiv.textContent = `${greeting},`;
        userNameGreetingDiv.textContent = `${userName}`;
    } else {
        greetingMessageDiv.textContent = greeting;
        userNameGreetingDiv.textContent = '';
    }
}

/** Sets the greeting message for the overlay. */
function setGreetingForOverlay(greeting, userName, greetingMessageOverlay, userNameGreetingOverlay) {
    if (userName && userName.toLowerCase() !== 'guest') {
        greetingMessageOverlay.textContent = `${greeting},`;
        userNameGreetingOverlay.textContent = `${userName}`;
    } else {
        greetingMessageOverlay.textContent = greeting;
        userNameGreetingOverlay.textContent = '';
    }
}

/** Handles the display of the greeting overlay on small screens. */
function handleGreetingOverlay() {
    const showGreeting = new URLSearchParams(window.location.search).get('showGreeting');
    const overlay = document.getElementById('overlay_greeting');
    const greetingMessageOverlay = document.getElementById('greeting-message-overlay');
    const userNameGreetingOverlay = document.getElementById('user-name-greeting-overlay');
    
    // Überprüfen, ob die Breite <= 900px ist
    if (window.innerWidth <= 900 && shouldShowGreeting(showGreeting)) {
        const greeting = getGreetingFromDOM();
        const userName = getUserNameFromDOM();
        setGreetingForOverlay(greeting, userName, greetingMessageOverlay, userNameGreetingOverlay);
        showOverlay(overlay);
        hideOverlayAfterTimeout(overlay);
    }
}

/** Checks if the greeting overlay should be shown.*/
function shouldShowGreeting(showGreeting) {
    return showGreeting === 'true' && !localStorage.getItem('greetingShown');
}

/** Retrieves the greeting message from the DOM. */
function getGreetingFromDOM() {
    return document.getElementById('greeting-message').textContent;
}

/** Retrieves the user name from the DOM. */
function getUserNameFromDOM() {
    return document.getElementById('user-name-greeting').textContent;
}

// Begrüßung in das Overlay setzen
function setGreetingForOverlay(greeting, userName, greetingMessageOverlay, userNameGreetingOverlay) {
    greetingMessageOverlay.textContent = greeting;
    userNameGreetingOverlay.textContent = userName;
}

/** Shows the greeting overlay with a smooth transition. */
function showOverlay(overlay) {
    overlay.style.display = 'flex';
    setTimeout(() => { 
        overlay.classList.add('visible');
    }, 1); 
}

/** Hides the greeting overlay after a timeout. */
function hideOverlayAfterTimeout(overlay) {
    setTimeout(() => {
        overlay.classList.remove('visible');
        setTimeout(() => {
            overlay.style.display = 'none';
            localStorage.setItem('greetingShown', 'true');
        }, 300);
    }, 1500);
}

/** Checks if the greeting overlay has already been shown in the session. */
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay_greeting');
    if (!localStorage.getItem('greetingShown')) {
        showOverlay(overlay);
        hideOverlayAfterTimeout(overlay);
    }
});

/* Retrieves the username of the currently logged-in user from Firebase.*/
async function getUserName() {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (!loggedInEmail) {
        return '';
    }
    try {
        const response = await fetch(`${BASE_URL}registrations.json`);
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Benutzerdaten');
        }
        const users = await response.json();
        if (users) {
            const user = Object.values(users).find(user => user.email === loggedInEmail);
            return user ? user.name : '';
        }
    } catch (error) {
       return ''
    }
}


/**Fetches and processes tasks from the server. */
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

/**Counts and returns urgent tasks and their next due date.*/
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

/** Filters urgent tasks from the fetched data. */
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

/** Sorts urgent tasks based on due date. */
function sortUrgentTasks(urgentTasks) {
    urgentTasks.sort((a, b) => a.dueDate - b.dueDate);
}

/**  Returns tasks with the next due date. */
function getTasksWithNextDueDate(urgentTasks, nextDueDate) {
    return urgentTasks.filter(
        (item) => item.dueDate.getTime() === nextDueDate.getTime()
    );
}

/** Returns the count of tasks and their next due date. */
function getTaskCountAndDueDate(tasksWithNextDueDate, nextDueDate) {
    return {
        count: tasksWithNextDueDate.length,
        dueDate: nextDueDate.toISOString().split('T')[0],
    };
}

/** Counts the tasks in the main categories. */
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

/** Updates the HTML elements with task counts and urgent task data. */
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
