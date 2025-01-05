function onload() {
    loadTask("awaitfeedback");
}


const BASE_URL = "https://join-408-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadTask(path="") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
}
    









// function changeTask() {
//     const task = document.getElementById("task").value;
//     const taskId = localStorage.getItem("taskId");
//     const taskRef = firebase.database().ref(BASE_URL + "/tasks/" + taskId);

//     taskRef.update({
//         task: task
//     }).then(() => {
//         alert("Task updated successfully!");
//     }).catch((error) => {
//         console.error("Error updating task:", error);
//     });
// }