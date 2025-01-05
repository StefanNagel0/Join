function onload() {
    loadTask();
}

const BASE_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/";

function loadTask() {
    const tasksRef = firebase.database().ref('tasks');
    tasksRef.on('value', (snapshot) => {
      const tasks = snapshot.val();
      displayTasks(tasks);
    });
  }


async function createTask() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-desc').value;
    const assignedTo = document.getElementById('task-assigned').value;
    const dueDate = document.getElementById('task-date').value;
    const priority = document.getElementById('task-priority-hidden').value;
    const category = document.getElementById('task-category').value;
    
    const newTaskRef = firebase.database().ref('tasks').push();
    
    await newTaskRef.set({
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      category,
      status: 'To do'
    });
  
    addTaskSuccess();
    loadTask();
  }