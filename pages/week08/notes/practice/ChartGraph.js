export default class Graph{
    /** @type {Point[]} */
    points = [];
    /**
     * 
     * @param {HTMLElement} canvas_ref
     * @param {String} type 
     */
    constructor(canvas_ref,type){
        this.canvas = canvas_ref;
        this.type = type;
        this.padding_x = 20;
        this.padding_y = 20;
        this.graph_h = canvas_ref.parentElement.getBoundingClientRect().height;
        this.graph_w = canvas_ref.parentElement.getBoundingClientRect().width;

    };

    /**
     * Converst two arrays to an array of points
     * both arrays need to be the same length
     * @param {Number[]} array_x_values 
     * @param {Number[]} array_y_values 
     */
    insertPoints(array_x_values, array_y_values){
        if(array_x_values.length != array_y_values.length){
            throw "Arrays must be same length"
        }
        // Reset if we had already done this
        this.points = []
        this.min = 0;
        this.max = 0;

        
        let max =0;
        let min =0;
        array_y_values.forEach(ele =>{
            if(ele > max){
                max = ele
            }else if(ele < min){
                min = ele;
            }
        })
        console.log(max,"max is");
        console.log(min,"min is");
        this.min = min;
        this.max = max;

        let y_vals = array_y_values 
        array_x_values.forEach((value,index) =>{
            this.points.push(new Point(value,y_vals[index]));
            console.log(`y percent is ${y_vals[index]} `,(y_vals[index]-min)/(max-min))
        })
    }

    resizeGraph(canvas){
       let parent = canvas.parentElement;
       canvas.width =parent.getBoundingClientRect().width - 6;
       canvas.height = parent.getBoundingClientRect().height - 6;
        this.graph_h = canvas.height;
        this.graph_w = canvas.width;
       console.log("width hight",canvas.width, canvas.height)

       
     }
    initGraph(canvas){
        
        
      this.resizeGraph(canvas)
      let context = canvas.getContext("2d");
        context.fillStyle = "#ff000025";
        context.fillRect(this.padding_y,this.padding_x,this.graph_w-this.padding_x*2, this.graph_h-this.padding_y*2)
   
   }

    drawLine(startPoint,endPoint){
        // debugger;
        var context = this.canvas.getContext("2d");
        context.beginPath();

        // context.moveTo(startPoint.x, startPoint.y);

        let graph_render_hight = this.graph_h - this.padding_y*2;
        let start_y_percent = (startPoint.y-this.min)/(this.max-this.min);
        let end_y_percent = (endPoint.y-this.min)/(this.max-this.min);

        let start_point_y_calc = graph_render_hight-(graph_render_hight * start_y_percent)+this.padding_y;
        let end_point_y_calc = graph_render_hight-(graph_render_hight * end_y_percent) +this.padding_y;
        console.log(start_point_y_calc,end_point_y_calc)

        
        context.moveTo(startPoint.x, start_point_y_calc);
        console.log(`moved to ${startPoint.x},${start_point_y_calc}`)
        

        context.lineTo(endPoint.x, end_point_y_calc);
        console.log(`line to ${endPoint.x},${end_point_y_calc}`)

        context.strokeStyle = "red";
        context.lineWidth = 3;
        context.closePath();
    
        context.stroke(); 
    }

    drawCircle(point) {

        let graph_render_hight = this.graph_h - this.padding_y*2;
        let point_percent = (point.y-this.min)/(this.max-this.min);

        let point_calc = graph_render_hight-(graph_render_hight * point_percent)+this.padding_y;
        console.log(point_calc)

        var context = this.canvas.getContext("2d");
        context.beginPath();
        context.arc(point.x, point_calc, 5 , 0, Math.PI*2, true);
        context.closePath();
        context.strokeStyle = "red";
        context.fillStyle = "blue";
        context.lineWidth = 2;
        context.fill(); 
        context.stroke(); 
    }
    renderGraph(){
        
    console.debug(this.canvas);
    this.initGraph(this.canvas);
    this.points.forEach((value, index)=>{
        if(this.points.length >0 && index < this.points.length-1){
            this.drawLine(value,this.points[index+1]);
            
        }
        this.drawCircle(value)

    })
    
    

}
    

}

export class Point {
    x = 0;
    y = 0;
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x,y){
        this.x = x;
        this.y = y;
    };

};