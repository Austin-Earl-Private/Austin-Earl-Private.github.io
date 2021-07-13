import Graph from "./ChartGraph.js";


var canvas = document.getElementById("myCanvas");
let window_max_width = window.innerWidth;
console.log(window.innerWidth);


let graphControler = new Graph(canvas, "line");

// let ys = [-10,50,30,40,80,60,70,80,90,50,110,120,130]
// let xs = [20,40,60,80,100,120,140,160,180,200,220,240,260]
let ys = [-10, 50, 30, 20, -9]
let xs = [20, 40, 60, 80, 100]

graphControler.insertPoints(xs, ys);
console.log(graphControler.points);
graphControler.renderGraph(0, 0);

graphControler.canvas.onmousemove = function (e) {
    var rect = this.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top,
        i = 0,
        r;

    graphControler.renderGraph(x, y)
}

document.querySelector("#recalulate").onclick = () => {
    let h = document.querySelector("#size").value
    /** @type{String} */
    let numbers = document.querySelector("#numbers").value
    let numbersArray = []
    let spacingArray = []
    if (numbers != "") {
        let numbersSplit = numbers.split(",")

        let counter = 20
        for (let ele of numbersSplit) {
            numbersArray.push(parseFloat(ele))
            spacingArray.push(counter)
            counter += 20;
        }
    } else {
        numbersArray = ys
        spacingArray = xs
    }

    console.log("h is ", h);
    let graphs = document.querySelectorAll(".graph")
    console.log(graphs)
    graphs[0].style.height = h + "px";
    graphControler.insertPoints(spacingArray, numbersArray)
    graphControler.renderGraph();

};