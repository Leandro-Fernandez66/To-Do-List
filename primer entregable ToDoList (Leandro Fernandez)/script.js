function addToList(event) {
  event.preventDefault();

  const form = event.target;

  const formData = new FormData(form);

  const task = {};
  formData.forEach((value, key) => (task[key] = value));
  task.id = generateUniqueId();
  task.isCompleted = false;

  const tasks = getTodoList();
  const newList = [...tasks, task];
  persistTodoList(newList);

  form.reset();

  displayTasks(newList);

  showTasks(newList);
}

function displayTasks(todoList) {
  const tasksList = document.querySelector("#todo-tasks");

  if (!tasksList) {
    console.error("No se encontró el elemento `#todo-tasks`");
    return;
  }

  const listTasksHtml = todoList.map((task) => {
    return `
      <li class="task">
        <div class="div-container">
          <input type="checkbox" ${task.isCompleted ? "checked" : ""
          } onclick="taskStatus('${task.id}')"/>
            <p class="${task.isCompleted ? "task--completed" : ""} conditionOfTask-${task.id}">${task.title}</p>
        </div>    
            <button class="delete-button" onclick="deleteTask('${task.id}')">❌</button>
      </li>
      `;
  });

  tasksList.innerHTML = listTasksHtml.join("");
}

function getTodoList() {
  const storage = localStorage.getItem("todoList");

  if (!storage) {
    persistTodoList([]);
    return [];
  }

  return JSON.parse(storage);
}

function persistTodoList(tasks) {
  localStorage.setItem("todoList", JSON.stringify(tasks));
}

function deleteTask(idTask) {
  const isConfirm = confirm("Estas seguro de borrar esta tarea?");
  if (!isConfirm) return;

  const tasks = getTodoList();

  const tasksFiltered = tasks.filter((task) => task.id !== idTask);

  persistTodoList(tasksFiltered);

  displayTasks(tasksFiltered);
  showTasks(tasksFiltered);
}

function taskStatus(idTask) {
  const tasks = getTodoList();

  let arrayIndex = tasks.findIndex((item) => item.id === idTask);

  tasks[arrayIndex].isCompleted = !tasks[arrayIndex].isCompleted;

  persistTodoList(tasks);
  showTasks(tasks);

  const taskCompleted = document.querySelector(`.conditionOfTask-${idTask}`);
  taskCompleted.classList.toggle("task--completed");
}

function showTasks(list) {
  console.log("-".repeat(20));
  for (item of list) {
    let completed = item.isCompleted
      ? "Tarea Completada"
      : "Tarea no Completada";
    console.log(`${item.id}: ${item.title} [${completed}]`);
  }
  console.log("-".repeat(20));
}

function generateUniqueId() {
  return "task-" + Date.now();
}

document.addEventListener("DOMContentLoaded", () => {
  const tasks = getTodoList();
  displayTasks(tasks);
  showTasks(tasks);
});
