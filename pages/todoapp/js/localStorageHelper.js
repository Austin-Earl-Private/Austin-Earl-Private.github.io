export default class localStorageHelper{
     saveTodoList(todoList){
        window.localStorage.setItem("todo",JSON.stringify(todoList));
    }
    
     loadTodoList(){
        let ele = JSON.parse(window.localStorage.getItem("todo"))
        if(!ele){
            ele = [];
        }
        return ele;
    }
}
