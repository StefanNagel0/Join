document.addEventListener('DOMContentLoaded', () => {
    const contacts = ['John Doe', 'Jane Smith', 'Guest']; // Example contact list
    populateAssignedTo(contacts);
    initializePriorityButtons();
    initializeSubtasks();
});

// Populate the Assigned To dropdown
function populateAssignedTo(contacts) {
    const assignedToSelect = document.getElementById('task-assigned');
    contacts.forEach(contact => {
        const option = document.createElement('option');
        option.value = contact;
        option.textContent = contact;
        assignedToSelect.appendChild(option);
    });
}

// Initialize priority buttons
function initializePriorityButtons() {
    const priorityButtons = document.querySelectorAll('.prio-btn');
    const priorityHiddenInput = document.getElementById('task-priority-hidden');
    priorityButtons.forEach(button => {
        button.addEventListener('click', () => {
            priorityButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            priorityHiddenInput.value = button.dataset.prio;
        });
    });
}

// Subtasks functionality
function initializeSubtasks() {
    const subtaskContainer = document.getElementById('subtask-container');
    const subtaskInput = document.getElementById('new-subtask');
    const addSubtaskButton = document.getElementById('add-subtask');
    const subtaskList = document.getElementById('subtask-list');
    
    addSubtaskButton.addEventListener('click', () => {
        const subtask = subtaskInput.value.trim();
        if (subtask) {
            const li = document.createElement('li');
            li.textContent = subtask;
            subtaskList.appendChild(li);
            subtaskInput.value = '';
        }
    });
}

// Save task
function saveTask(event) {
    event.preventDefault();
    
    const formData = new FormData(document.getElementById('task-form'));
    const task = {
        title: formData.get('title'),
        description: formData.get('description'),
        assignedTo: formData.get('assignedTo'),
        dueDate: formData.get('dueDate'),
        priority: formData.get('priority'),
        category: formData.get('category'),
        subtasks: Array.from(document.querySelectorAll('#subtask-list li')).map(li => li.textContent)
    };

    // Save task to local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Clear form and confirm
    document.getElementById('task-form').reset();
    document.getElementById('subtask-list').innerHTML = '';
    alert('Task saved!');
}
