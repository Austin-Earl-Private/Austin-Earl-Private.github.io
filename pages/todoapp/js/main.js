import ls from "./localStorageHelper.js";
/**
 * @type {Array}
 */
 let todos = new ls().loadTodoList();//[{id:"test",content:"lalala",completed:false},{id:"test2",content:"lalala2",completed:false}];
console.log(todos);


console.log("starting")
function renderInputTodo(){
    console.log("creating input todo")
    let sect = document.querySelector("#input");
    let input = document.createElement("input");
    input.id ="edit_intput";
    let button = document.createElement("button");
    button.innerText ="Add";
    button.onclick = addTodoElement;
    sect.appendChild(input);
    sect.appendChild(button);
    console.log("created input todo")

}

/**
 * 
 * @param {Array} todo_array 
 */
function renderTodoList(todo_array){
    /**@type {HTMLDivElement} */
    let listParent =  document.querySelector("#list-container")
    // clear out the todo list to rerender it
    listParent.innerHTML = "";
    todo_array.forEach((todo)=>{
        let list_item = document.createElement("div");
        let list_item_content = document.createElement("p");
        let list_item_checkmark = document.createElement("input");
        let list_item_delete_button = document.createElement("button");

        list_item.classList.add("todo-item");
        list_item_content.classList.add("todo-item-content");
        list_item_delete_button.classList.add("todo-item-delete-button")
        list_item_checkmark.classList.add("todo-item-checkmark")

        list_item_checkmark.type = "checkbox";
        if(todo.completed){
            list_item_checkmark.checked = true;
            list_item_content.classList.add("todo-item-completed")
        }
        list_item_checkmark.onclick = function() { 
            console.debug(this);
            setCompleteTodoElement(todo.id, this.checked)
        }

        // list_item.setAttribute("todo-id", todo.id);

        list_item_content.innerText = todo.content;

        list_item_delete_button.innerText = "X";
        list_item_delete_button.onclick = function() {deleteTodoElement(todo.id)}


        list_item.appendChild(list_item_checkmark);
        list_item.appendChild(list_item_content);
        list_item.appendChild(list_item_delete_button);
        

        listParent.appendChild(list_item)
    })

    //render filters
    let tasks_still_active = document.querySelector("#tasks-still-active")
    tasks_still_active.textContent = `${getOpenTasks()} tasks left `;
    // <button id="filter-all">All</button>
    // <button id="filter-active">Active</button>
    // <button id="filter-compelted">Completed</button>
    let filter_all = document.querySelector("#filter-all")
    filter_all.onclick = getAllItems;
    let filter_active = document.querySelector("#filter-active")
    filter_active.onclick = getActiveItems;
    let filter_compelted = document.querySelector("#filter-compelted")
    filter_compelted.onclick = getCompletedItems;
}

function deleteTodoElement(id){
    let new_todos = todos.filter((value, index, arr)=>{
        return value.id != id;
    })
    console.debug(new_todos,todos)
    todos = new_todos;
    new ls().saveTodoList(todos);
    renderTodoList(todos);
}

function addTodoElement(){
    let content_innsert = document.querySelector("#edit_intput").value
    let ele = {id: Date.now(),content: content_innsert, completed:false}
    todos.push(ele);
    new ls().saveTodoList(todos);
    renderTodoList(todos);
}

function setCompleteTodoElement(id,completed_bool){
    let new_todos = todos.map((value)=>{
        if(value.id == id){
            value.completed = completed_bool
        }
        return value;
    })
    console.debug(new_todos,todos);
    todos = new_todos;
    new ls().saveTodoList(todos);
    renderTodoList(todos);
}

/**
 * 
 * @param {Array} array 
 */
function getOpenTasks(){
    let opens = todos.filter((value)=>{
        return !value.completed
    })
    return opens.length;
}

function getAllItems(){
    renderTodoList(todos);
}

function getCompletedItems(){
    let opens = todos.filter((value)=>{
        return value.completed
    })
    renderTodoList(opens);
}

function getActiveItems(){
    let opens = todos.filter((value)=>{
        return !value.completed
    })
    renderTodoList(opens);
}

renderInputTodo();
renderTodoList(todos);
