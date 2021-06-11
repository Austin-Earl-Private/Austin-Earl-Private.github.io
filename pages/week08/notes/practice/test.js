import Graph from "./ChartGraph.js";

 
var canvas = document.getElementById("myCanvas");
let window_max_width = window.innerWidth;
console.log(window.innerWidth);
// last
// var context = canvas.getContext("2d");
// context.strokeStyle = "red";
// context.fillStyle = "rgba(0, 0, 255, 0.5)";
// context.fillRect(10, 10, 100, 100);   
// context.strokeRect(10, 10, 100, 100);

// drawCircle(canvas);








// function resizeCycle(){
//     if(window.innerWidth > window_max_width){
//         console.log("resizing graph")

//         renderGraph(canvas);

//         console.log("graph resized")

//         window_max_width = window.innerWidth;

//     }
    
// } 

// window.onresize = resizeCycle;
// renderGraph(canvas)

let graphControler = new Graph(canvas,"line");

// let ys = [-10,50,30,40,80,60,70,80,90,50,110,120,130]
// let xs = [20,40,60,80,100,120,140,160,180,200,220,240,260]
let ys = [-10,50,30,20,-9]
let xs = [20,40,60,80,100]

graphControler.insertPoints(xs,ys);
console.log(graphControler.points);
graphControler.renderGraph();
document.querySelector("#recalulate").onclick = ()=>{
    let h = document.querySelector("#size").value
    /** @type{String} */
    let numbers =  document.querySelector("#numbers").value
    let numbersArray = []
    let spacingArray = []
    if(numbers != ""){
        let numbersSplit = numbers.split(",")
        
        let counter = 20
        for(let ele of numbersSplit){
            numbersArray.push(parseFloat(ele))
            spacingArray.push(counter)
            counter += 20;
        }
    }else{
        numbersArray = ys
        spacingArray = xs
    }
    
    console.log("h is ",h);
    let graphs = document.querySelectorAll(".graph")
    console.log(graphs)
    graphs[0].style.height = h+"px";
    graphControler.insertPoints(spacingArray,numbersArray)
    graphControler.renderGraph();

};
