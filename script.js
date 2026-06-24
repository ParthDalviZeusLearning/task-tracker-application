//Select HTML elements
const taskInput = document.getElementById("new-task");
const addButton = document.getElementById("add-btn");
const todoList = document.getElementById("incomplete-tasks");
const completedList = document.getElementById("completed-tasks");
const taskDescription = document.getElementById("task-description");
const searchInput = document.getElementById("search-box");
const priorityInput = document.getElementById("priority");

const dueDate = document.getElementById("due-date");
const today = new Date().toISOString().split("T")[0];
dueDate.min = today;

// Load tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let draggedIndex = null;
let touchDraggedElement = null;

showTasks();

// Add Button Event
addButton.addEventListener("click", addTask);

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

searchInput.addEventListener("keyup", showTasks);

// Function to add task
function addTask() {
  let taskText = taskInput.value.trim();
  let taskDescribe = taskDescription.value.trim();

  if (taskText === "") {
    alert("Task field cannot be Empty. Please Enter a task.");
    return;
  }

  let now = new Date();

  let timestamp = now.toLocaleDateString() + " , " + now.toLocaleTimeString();

  let task = {
    text: taskText,
    date: dueDate.value,
    description: taskDescribe,
    priority: priorityInput.value,
    timestamp: timestamp,
    completed: false,
  };

  tasks.push(task);

  saveTasks();

  taskInput.value = "";
  dueDate.value = "";
  taskDescription.value = "";

  showTasks();
}

// Function to display tasks
function showTasks() {
  todoList.innerHTML = "";
  completedList.innerHTML = "";

  let todoCount = 0;
  let completedCount = 0;

  let todoEmpty = true;
  let completedEmpty = true;

  let searchText = searchInput.value.toLowerCase();

  for (let i = 0; i < tasks.length; i++) {
    if (!tasks[i].text.toLowerCase().includes(searchText)) {
      continue;
    }

    let li = document.createElement("li");

    // Drag tasks in both the lists
    li.draggable = true;
    li.dataset.index = i;

    // --------------------
    // DRAG EVENTS
    // --------------------

    li.addEventListener("dragstart", function (e) {
      draggedIndex = Number(this.dataset.index);

      e.dataTransfer.setData("text/plain", draggedIndex);

      e.dataTransfer.effectAllowed = "move";

      this.classList.add("dragging");
    });

    li.addEventListener("dragend", function () {
      this.classList.remove("dragging");
    });

    li.addEventListener("dragover", function (e) {
      e.preventDefault();

      e.dataTransfer.dropEffect = "move";
    });

    li.addEventListener("drop", function (e) {
      e.preventDefault();

      const sourceIndex = Number(e.dataTransfer.getData("text/plain"));

      const targetIndex = Number(this.dataset.index);

      if (sourceIndex === targetIndex || sourceIndex < 0) {
        return;
      }

      const movedTask = tasks[sourceIndex];

      tasks.splice(sourceIndex, 1);

      tasks.splice(targetIndex, 0, movedTask);

      saveTasks();
      showTasks();
    });

    li.addEventListener(
      "touchstart",
      function () {
        touchDraggedElement = this;

        draggedIndex = Number(this.dataset.index);
      },
      { passive: true },
    );

    li.addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault();

        const touch = e.touches[0];

        const target = document.elementFromPoint(touch.clientX, touch.clientY);

        if (!target) return;

        const targetLi = target.closest("li");

        if (!targetLi) return;

        targetLi.classList.add("drop-target");
      },
      { passive: false },
    );

    li.addEventListener("touchend", function (e) {
      const touch = e.changedTouches[0];

      const target = document.elementFromPoint(touch.clientX, touch.clientY);

      if (!target) return;

      const targetLi = target.closest("li");

      if (!targetLi) return;

      const targetIndex = Number(targetLi.dataset.index);

      if (draggedIndex === targetIndex) {
        return;
      }

      const movedTask = tasks.splice(draggedIndex, 1)[0];

      tasks.splice(targetIndex, 0, movedTask);

      saveTasks();
      showTasks();
    });

    let priorityclass = "";

    if (tasks[i].priority === "High") {
      priorityclass = "high-priority";
    } else if (tasks[i].priority === "Medium") {
      priorityclass = "medium-priority";
    } else {
      priorityclass = "low-priority";
    }

    let taskInfo = document.createElement("div");

    taskInfo.classList.add("task-info");

    // Task Title
    let taskTitle = document.createElement("span");

    taskTitle.classList.add("task-title");

    taskTitle.textContent = "Task: " + tasks[i].text;

    // Description
    let description = document.createElement("p");

    description.classList.add("task-description");

    description.textContent = "Description: " + tasks[i].description;

    // Priority
    let priority = document.createElement("p");

    priority.classList.add("task-priority");

    let priorityLabel = document.createElement("span");

    priorityLabel.textContent = "Priority: ";

    let priorityBadge = document.createElement("span");

    priorityBadge.classList.add(priorityclass);

    priorityBadge.textContent = tasks[i].priority;

    priority.appendChild(priorityLabel);

    priority.appendChild(priorityBadge);

    // Due Date
    let dueDateText = document.createElement("p");

    dueDateText.classList.add("task-date");

    dueDateText.textContent = "Due: " + tasks[i].date;

    // Created Date
    let createdText = document.createElement("p");

    createdText.classList.add("task-timestamp");

    createdText.textContent = "Created: " + tasks[i].timestamp;

    taskInfo.appendChild(taskTitle);
    taskInfo.appendChild(description);
    taskInfo.appendChild(priority);
    taskInfo.appendChild(dueDateText);
    taskInfo.appendChild(createdText);

    // COMPLETE BUTTON
    let completeButton = document.createElement("button");

    completeButton.draggable = false;

    if (tasks[i].completed) {
      completeButton.innerText = "Completed";

      completeButton.classList.add("completed-button");
    } else {
      completeButton.innerText = "Complete";

      completeButton.classList.add("complete-button");
    }

    completeButton.onclick = function () {
      tasks[i].completed = true;

      saveTasks();
      showTasks();
    };

    // EDIT BUTTON
    let editButton = document.createElement("button");

    editButton.innerText = "Edit";
    editButton.draggable = false;

    editButton.classList.add("edit-button");

    editButton.onclick = function () {
      let updatedTask = prompt("Edit Task:", tasks[i].text);

      if (updatedTask != null && updatedTask.trim() !== "") {
        tasks[i].text = updatedTask.trim();

        saveTasks();
        showTasks();
      }
    };

    // DELETE BUTTON
    let deleteButton = document.createElement("button");

    deleteButton.innerText = "Delete";

    deleteButton.draggable = false;

    deleteButton.classList.add("delete-button");

    deleteButton.onclick = function () {
      if (confirm("Are you sure you want to delete the task?")) {
        tasks.splice(i, 1);

        saveTasks();
        showTasks();
      }
    };

    let buttonDiv = document.createElement("div");

    buttonDiv.classList.add("button-container");

    buttonDiv.appendChild(completeButton);

    buttonDiv.appendChild(editButton);

    buttonDiv.appendChild(deleteButton);

    li.appendChild(taskInfo);
    li.appendChild(buttonDiv);

    // Todo / Completed
    if (tasks[i].completed) {
      completedList.appendChild(li);

      completedCount++;
      completedEmpty = false;
    } else {
      todoList.appendChild(li);

      todoCount++;
      todoEmpty = false;
    }
  }

  // Empty Todo
  if (todoEmpty) {
    let emptyTodo = document.createElement("p");

    emptyTodo.classList.add("empty");

    emptyTodo.textContent = "No Tasks to View";

    todoList.appendChild(emptyTodo);
  }

  // Empty Completed
  if (completedEmpty) {
    let emptyCompleted = document.createElement("p");

    emptyCompleted.classList.add("empty");

    emptyCompleted.textContent = "No Tasks to View";

    completedList.appendChild(emptyCompleted);
  }

  document.getElementById("todo-heading").innerText =
    "Todo Tasks (" + todoCount + ")";

  document.getElementById("completed-heading").innerText =
    "Completed Tasks (" + completedCount + ")";
}

// Save Tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
