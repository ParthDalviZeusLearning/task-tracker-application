
//Select HTML elements 
const taskInput =document.getElementById("new-task");
const addButton =document.getElementById("add-btn");
const todoList =document.getElementById("incomplete-tasks");
const completedList =document.getElementById("completed-tasks");
const taskDescription=document.getElementById("task-description");
const searchInput=document.getElementById("search-box");
const priorityInput=document.getElementById("priority");

const dueDate=document.getElementById("due-date");
const today= new Date().toISOString().split("T")[0];
dueDate.min=today;


//Load tasks from browser local storage
let tasks =JSON.parse(localStorage.getItem("tasks")) || [];
showTasks();

//Add Button Event(click)
addButton.addEventListener("click", addTask);
document.addEventListener("keydown",function(event){
  if(event.key==="Enter"){
      
        addTask();
       
  }
});
searchInput.addEventListener("keyup",showTasks);


//Function to add task 
function addTask() {
console.log("Button CLicked");
let taskText = taskInput.value.trim();
let taskDescribe=taskDescription.value.trim();



//Show alert when user clicks without entering task 
    if (taskText == "") {
        alert("Task field cannot be Empty. Please Enter a task.");
        return;
    }

    let now= new Date();
    let timestamp=now.toLocaleDateString()+" , "+now.toLocaleTimeString();

    let task = {
        text: taskText,
        date: dueDate.value,
        description:taskDescribe,
        priority:priorityInput.value,
        timestamp: timestamp,
        completed: false

    };
//add the task to array
    tasks.push(task);
//save tasks 
    saveTasks();
//refresh the task list 
    taskInput.value = "";
    dueDate.value="";
    taskDescription.value="";
    showTasks();

    
}

//Function to display the task list
function showTasks() {
     
        todoList.innerHTML="";
        completedList.innerHTML="";
        
      // Initialising counnter variables
        let todoCount=0;
        let completedCount=0;
        
     //Variables to handle empty task list
        let todoEmpty=true;
        let completedEmpty=true;
    
        let searchText=searchInput.value.toLowerCase();

        tasks.sort(function(a,b){
            const order={
                High:1,
                Medium:2,
                Low:3 
            };
         return order[a.priority]-order[b.priority];
        });

    for (let i = 0; i < tasks.length; i++) {
        

         if(!tasks[i].text.toLowerCase().includes(searchText)){
            continue;
        }
       
        let li = document.createElement("li");

        let priorityclass="";
        if(tasks[i].priority=="High"){priorityclass="high-priority"}
        else if(tasks[i].priority=="Medium"){priorityclass="medium-priority"}
        else(priorityclass="low-priority");

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

        // Created Timestamp
        let createdText = document.createElement("p");
        createdText.classList.add("task-timestamp");
        createdText.textContent = "Created: " + tasks[i].timestamp;

        // Append everything
        taskInfo.appendChild(taskTitle);
        taskInfo.appendChild(description);
        taskInfo.appendChild(priority);
        taskInfo.appendChild(dueDateText);
        taskInfo.appendChild(createdText);

        //Creating Complete Button
        let completeButton = document.createElement("button");
         if (tasks[i].completed == true) {
           completeButton.innerText = "Completed";
           completeButton.classList.add("completed-button");
        } else {
            completeButton.innerText = "Complete";
            completeButton.classList.add("complete-button");
        }
        completeButton.onclick =   function () {
            tasks[i].completed = true;
            saveTasks();
            showTasks();
        };
       
        //Creating Delete Button
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.onclick = function () {
            if(confirm("Are you sure you want to delete the task?")){
            tasks.splice(i, 1);
            saveTasks();
            showTasks();
            }
        };
       
        //Creating Edit Button
        let editButton=document.createElement("button");
        editButton.innerText="Edit";
        editButton.classList.add("edit-button");
        editButton.onclick=function(){
            let updatedTask=prompt("Edit Task:",tasks[i].text);
            if(updatedTask !=null && updatedTask.trim()!=""){
                tasks[i].text=updatedTask.trim();
                saveTasks();
                showTasks();
            }


        }
      
        let buttonDiv=document.createElement("div");
        buttonDiv.classList.add("button-container");
        buttonDiv.appendChild(completeButton);
        buttonDiv.appendChild(editButton);
        buttonDiv.appendChild(deleteButton);
        
        li.appendChild(taskInfo);
        li.appendChild(buttonDiv);
       
       //Adding tasks to completed and todo list and increasing the count 
        if (tasks[i].completed == true) {
            completedList.appendChild(li);
            completedCount++;
            completedEmpty=false;

        } else {
            todoList.appendChild(li);
            todoCount++;
            todoEmpty=false;
        }
        
       
     

    }
            
       //Handling Empty Task Lists 
    if(todoEmpty == true) {
    let emptyTodo = document.createElement("p");
    emptyTodo.classList.add("empty");
    emptyTodo.textContent = "No Tasks to View";
    todoList.appendChild(emptyTodo);
    }

    if(completedEmpty == true) {
    let emptyCompleted = document.createElement("p");
    emptyCompleted.classList.add("empty");
    emptyCompleted.textContent = "No Tasks to View";
    completedList.appendChild(emptyCompleted);
    }
        

document.getElementById("todo-heading").innerText="Todo Tasks ("+todoCount+")";
document.getElementById("completed-heading").innerText="Completed Tasks ("+completedCount+")";
}

//Function to save tasks
function saveTasks() {
    localStorage.setItem( "tasks", JSON.stringify(tasks) );

    
}

