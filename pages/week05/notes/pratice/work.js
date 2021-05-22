// Working with more events and there works
// I need to debug this so much cause its needed!

class logger {
    _debug = false;
    _breakPoint = false;
    _prod = false;
    constructor(allow_log,enableBreakPoints,prod){
        this._debug = allow_log;
        this._breakPoint = enableBreakPoints;
        this._prod = prod
    }

    d(text){
        if(this._debug && !this._prod){
            console.debug(text)
        }
    }
    e(text){
        console.error(text)
    }
    i(text){
        if(!this._prod){
            console.info(text)
        }
    }
    w(text){
            console.warn(text)
    }

    createbreakPoint(){
        if(this._debug && this._breakPoint){
        debugger;
        }
    }

    enableBreakPoints(boolean){
        this._breakPoint = boolean;
    }
    enableDebug(boolean){
        this._debug = boolean;
    }
    enableProd(boolean){
        this._prod = boolean;
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


loging = new logger(false,false,true)
numb_rows = 30
numb_columns = 30
stop_coloring =false
let color = "black";

function setColor() {
    color = document.getElementById("colorChange").value;
    loging.i("color change to "+color)

}
function createGrid(){
    //get first grid div
    loging.i("Creating grid")
    let grid = document.getElementsByClassName("grid")[0];
    for(let b = 0; b< numb_rows; b++){
        for(let i = 0; i< numb_columns; i++){
            let grid_element =  document.createElement("div")
            grid_element.classList.add("grid-element");
            grid_element.setAttribute("loc",i+","+b); //column , row
            grid_element.addEventListener("click",changeColor)
           
            
            
            grid.appendChild(grid_element)
        }
    }
    loging.i("created grid")
}


function changeColor(event){
    target = event.target
    loging.d(event)
    loging.d(target)
    loging.d(event.type)
    loging.d("target loc: "+target.getAttribute("loc"))
    if(event.type= "click" ){
        let column_loc = target.getAttribute("loc").split(",")[0]
        let row_loc = target.getAttribute("loc").split(",")[1];
         loging.d("col: "+column_loc+" "+"row: "+ row_loc)
        leakColor(parseInt(column_loc),parseInt(row_loc));

    }
}

async function leakColor(col,row){
    if(document.querySelectorAll(`[loc='${col+","+row}']`)[0] && !stop_coloring && document.querySelectorAll(`[loc='${col+","+row}']`)[0].style.background != color){
        loging.d("coloring new loc "+col+","+row)
        document.querySelectorAll(`[loc='${col+","+row}']`)[0].style.background = color;
        await sleep(100);
        loging.createbreakPoint();
        leakColor(col,row+1) // take atvantage of the async!!!
        leakColor(col+1,row) // take atvantage of the async!!!
        leakColor(col+1,row+1) // take atvantage of the async!!!

        leakColor(col,row-1) // take atvantage of the async!!!
        leakColor(col-1,row-1) // take atvantage of the async!!!
        leakColor(col-1,row) // take atvantage of the async!!!
    }else{
        loging.d("no change needed")
    }
}

function lightUpComand(event){

}
createGrid();


function stopColoring(){
    stop_coloring = !stop_coloring;
    document.getElementById("stop").textContent = stop_coloring ? "ALLOW" : "STOP";
}




