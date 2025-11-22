const addTodoBtn = document.getElementById("addTodoBtn");  //add button
const inputTag = document.getElementById("todoInput"); //input bar
const todoListUl = document.getElementById("todoList"); //ul list
const remaining = document.getElementById("remaining-count"); 
const clearCompletedBtn = document.getElementById("clearCompletedBtn"); // clear button 
const active = document.getElementById("active");     //active button
const completed = document.getElementById("completed");    //complete button
const allBtn = document.getElementById("all");         //all button

let todoText; // text inside input bar
let todos = [];// this should be populated when user clicks add button

let currentFilter = "all"; // Track current filter
let todosString = localStorage.getItem("todos");
// If we have todos in the localStorage, we will read it
if (todosString) {
  todos = JSON.parse(todosString);
  // we want to count the no of item where isComplete is flase
  remaining.innerHTML = todos.filter((item) => {
    return item.isCompleted != true;
  }).length;
}

const populateTodos = () => {
  let filteredTodos = todos;

  // Apply current filter
  if (currentFilter === "active") {
    filteredTodos = todos.filter((todo) => !todo.isCompleted);
  } else if (currentFilter === "completed") {
    filteredTodos = todos.filter((todo) => todo.isCompleted);
  }
// this
  let string = "";
  for (const todo of filteredTodos) {
    string += `<li id="${todo.id}"class="todo-item ${
      todo.isCompleted ? "completed" : ""
    }">
            <input type="checkbox" class="todo-checkbox" ${
              todo.isCompleted ? "checked" : ""
            } >
            <span class="todo-text">${todo.title}</span>
            <button class="delete-btn">×</button>
        </li>`;
  }
  todoListUl.innerHTML = string;

  //add the checkbox logic to populate todos

  const todoCheckboxes = document.querySelectorAll(".todo-checkbox");
  todoCheckboxes.forEach((element) => {
    element.addEventListener("click", (e) => {
      if (e.target.checked) {
        element.parentNode.classList.add("completed");

        //grab this todo from todos array and update the todos array to set this todo isComplete as true

        todos = todos.map((todo) => {
          if (todo.id == element.parentNode.id) {
            return { ...todo, isCompleted: true };
          } else {
            return todo;
          }
        });
        // we want to count the no of item where isComplete is false
        remaining.innerHTML = todos.filter((item) => {
          return item.isCompleted != true;
        }).length;
        localStorage.setItem("todos", JSON.stringify(todos)); //updation in localStorage of todos array
      } else {
        element.parentNode.classList.remove("completed");
        //grab this todo from tods array and update the todos array to set this todos isComplete attribute to false

        todos = todos.map((todo) => {
          if (todo.id == element.parentNode.id) {
            return { ...todo, isCompleted: false };
          } else {
            return todo;
          }
        });
        // we want to count the no of item where isComplete is flase
        remaining.innerHTML = todos.filter((item) => {
          return item.isCompleted != true;
        }).length;
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    });
  });

  // handle the clear completed button click

  clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter((todo) => todo.isCompleted == false);
    populateTodos();
    localStorage.setItem("todos", JSON.stringify(todos));
  });

  //handle the delete buttons

  let deleteBtn = document.querySelectorAll(".delete-btn");

  deleteBtn.forEach((element) => {
    element.addEventListener("click", (e) => {
      const confirmation = confirm("Do you want to delete this todo?");
      if (confirmation) {
        console.log(e.target.parentNode.id);
        todos = todos.filter((todo) => {
          return todo.id !== e.target.parentNode.id;
        });

        // we want to count the no of item where isComplete is flase
        remaining.innerHTML = todos.filter((item) => {
          return item.isCompleted != true;
        }).length;

        localStorage.setItem("todos", JSON.stringify(todos));

        populateTodos();
      }
    });
  });
};

addTodoBtn.addEventListener("click", () => {
  todoText = inputTag.value;
  //check if the length of todo is greater than 3

  if (todoText.trim().length < 4) {
    alert("you can not add a todo that small");
    return;
  }

  inputTag.value = "";
  let todo = {
    id: "todo-" + Date.now(),
    title: todoText,
    isCompleted: false,
  };
  todos.push(todo);
  // we want to count the no of item where isComplete is flase
  remaining.innerHTML = todos.filter((item) => {
    return item.isCompleted != true;
  }).length;
  localStorage.setItem("todos", JSON.stringify(todos));
  populateTodos();
});

populateTodos();

// Filter button event listeners
active.addEventListener("click", () => {
  currentFilter = "active";
  populateTodos();
});

completed.addEventListener("click", () => {
  currentFilter = "completed";
  populateTodos();
});

allBtn.addEventListener("click", () => {
  currentFilter = "all";
  populateTodos();
});

populateTodos();