export default class localStorageHelper{
     saveTodoList(todoList){
        window.localStorage.setItem("todo",JSON.stringify(todoList));
    }
    
     loadTodoList(){
        return JSON.parse(window.localStorage.getItem("todo"))
    }
}
