export default class Graph {
    /** @type {Point[]} */
    points = [];
    /**
     * 
     * @param {HTMLCanvasElement} canvas_ref
     * @param {String} type 
     */
    constructor(canvas_ref, type) {
        this.canvas = canvas_ref;
        this.type = type;
        this.padding_x = 30;
        this.padding_y = 30;
        this.graph_h = canvas_ref.parentElement.getBoundingClientRect().height;
        this.graph_w = canvas_ref.parentElement.getBoundingClientRect().width;

        this.graphGridStyle = {}
        this.graphGridStyle.background_color = "#00000025"
        this.graphGridStyle.BaseLineColor = "black"
        this.graphGridStyle.innerLineColor = "grey"

        this.info_box = {}
        this.info_box.background_color = "#a0a0a08f"
        this.info_box.text_color = "black"
        this.info_box.textAlign = "center"
        this.info_box.fontStyle = "bold 20px  Verdana "
        this.info_box.render = false;
        this.info_box.mouse_x = 0;
        this.info_box.mouse_y = 0;
        this.info_box.point = new Point(0, 0);

        this.pointStyle = {}
        this.pointStyle.background_color = "#02aaec"
        this.pointStyle.outLine_color = "#0077a7"
        this.pointStyle.outline_thickness = 2
        this.pointStyle.pointSize = 5;
        this.pointStyle.pointGrowthMultiplyer = .5

        this.lineStyle = {}
        this.lineStyle.lineWidth = 4;
        this.lineStyle.lineColor = "#00b7ff"

        this.pointPosition = {}
        this.pointPosition.x_spacing = 20;


    };

    /**
     * Converst two arrays to an array of points
     * both arrays need to be the same length
     * @param {Number[]} array_x_values 
     * @param {Number[]} array_y_values 
     */
    insertPoints(array_x_values, array_y_values) {
        if (array_x_values.length != array_y_values.length) {
            throw "Arrays must be same length"
        }
        // Reset if we had already done this
        this.points = []
        this.min = 0;
        this.max = 0;


        let max = 0;
        let min = 0;
        array_y_values.forEach(ele => {
            if (ele > max) {
                max = ele
            } else if (ele < min) {
                min = ele;
            }
        })
        this.min = min;
        this.max = max;

        let y_vals = array_y_values
        let x_pos = 0;
        x_pos += this.padding_x
        array_x_values.forEach((value, index) => {
            this.points.push(new Point(x_pos, y_vals[index]));
            x_pos += this.pointPosition.x_spacing;
            // console.log(`y percent is ${y_vals[index]} `,(y_vals[index]-min)/(max-min))
        })
    }

    resizeGraph(canvas) {
        let parent = canvas.parentElement;
        canvas.width = parent.getBoundingClientRect().width - 6;
        canvas.height = parent.getBoundingClientRect().height - 6;
        this.graph_h = canvas.height;
        this.graph_w = canvas.width;


    }
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    initGraph(canvas) {


        this.resizeGraph(canvas)

        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = this.graphGridStyle.background_color;
        context.fillRect(this.padding_y, this.padding_x, this.graph_w - this.padding_x * 2, this.graph_h - this.padding_y * 2)
        this.renderGraphLines();

    }

    renderGraphLines() {
        let cxt = this.canvas.getContext("2d");
        cxt.strokeStyle = this.graphGridStyle.BaseLineColor

        cxt.beginPath();
        cxt.moveTo(this.padding_x, this.graph_h - this.padding_y);
        cxt.lineTo(this.graph_w - this.padding_x, this.graph_h - this.padding_y)
        cxt.closePath();
        cxt.stroke()

        cxt.beginPath();
        cxt.moveTo(this.padding_x, this.graph_h - this.padding_y);
        cxt.lineTo(this.padding_x, this.padding_y)
        cxt.closePath();
        cxt.stroke()

        this.renderGuideLines(0, cxt);
        this.renderGuideLines(this.min, cxt);
        this.renderGuideLines(this.max, cxt);

    }

    /**
     * 
     * @param {Number} value 
     * @param {CanvasRenderingContext2D} context 
     */
    renderGuideLines(value, cxt) {
        cxt.strokeStyle = this.graphGridStyle.innerLineColor
        // CONVERT THIS INTO FUNCTION AND LOOP OVER
        let start_y_percent = (value - this.min) / (this.max - this.min);
        let graph_render_hight = this.graph_h - this.padding_y * 2;
        let base_y_hight = graph_render_hight - (graph_render_hight * start_y_percent) + this.padding_y;
        cxt.beginPath();
        cxt.moveTo(this.padding_x, base_y_hight);
        cxt.lineTo(this.graph_w - this.padding_x, base_y_hight)
        cxt.closePath();
        cxt.stroke()
        cxt.textAlign = "right"
        cxt.font = "15px Arial"
        cxt.fillStyle = this.graphGridStyle.innerLineColor

        cxt.fillText(value, this.padding_x - 5, base_y_hight + 5)
    }

    drawLine(startPoint, endPoint) {
        // debugger;
        var context = this.canvas.getContext("2d");
        context.beginPath();

        // context.moveTo(startPoint.x, startPoint.y);

        let graph_render_hight = this.graph_h - this.padding_y * 2;
        let start_y_percent = (startPoint.y - this.min) / (this.max - this.min);
        let end_y_percent = (endPoint.y - this.min) / (this.max - this.min);

        let start_point_y_calc = graph_render_hight - (graph_render_hight * start_y_percent) + this.padding_y;
        let end_point_y_calc = graph_render_hight - (graph_render_hight * end_y_percent) + this.padding_y;


        context.moveTo(startPoint.x, start_point_y_calc);


        context.lineTo(endPoint.x, end_point_y_calc);

        context.strokeStyle = this.lineStyle.lineColor;
        context.lineWidth = this.lineStyle.lineWidth;
        context.closePath();

        context.stroke();
    }
    /**
     * 
     * @param {Point} point 
     * @param {Number} size 
     * @param {Number} relative_mouse_x 
     * @param {Number} relative_mouse_y 
     * @param {CanvasRenderingContext2D} context 
     */
    drawCircle(point, size, relative_mouse_x, relative_mouse_y, context) {



        let graph_render_hight = this.graph_h - this.padding_y * 2;
        let point_percent = (point.y - this.min) / (this.max - this.min);

        let point_calc = graph_render_hight - (graph_render_hight * point_percent) + this.padding_y;

        // var context = this.canvas.getContext("2d");




        context.beginPath();
        context.arc(point.x, point_calc, size, 0, Math.PI * 2, true);
        context.closePath();
        if (context.isPointInPath(relative_mouse_x, relative_mouse_y)) {
            // context.globalCompositeOperation = "destination-over";
            context.beginPath();
            context.arc(point.x, point_calc, size + size * this.pointStyle.pointGrowthMultiplyer, 0, Math.PI * 2, true);
            context.closePath();
            this.info_box.render = true;
            this.info_box.mouse_x = relative_mouse_x;
            this.info_box.mouse_y = relative_mouse_y;
            this.info_box.point = point;


            this.renderInfoBox(context, this.info_box.mouse_x, this.info_box.mouse_y, this.info_box.point);
            // this.drawBubble(bubble_context, relative_mouse_x, relative_mouse_y, 30, 30, 2)

        }
        context.strokeStyle = this.pointStyle.outLine_color;
        context.fillStyle = this.pointStyle.background_color;
        context.lineWidth = this.pointStyle.lineWidth;
        context.fill();
        context.stroke();
    }
    /**
     * @param {CanvasRenderingContext2D} context
     * @param {Number} mouse_x 
     * @param {Number} mouse_y 
     * @param {Point} point 
     */
    renderInfoBox(context, mouse_x, mouse_y, point) {
        // let context = this.canvas.getContext("2d");
        let render_x = mouse_x;
        let render_y = mouse_y;

        if (render_y - 25 - this.padding_y < 0) {
            render_y += 40 + 15
        }

        context.globalCompositeOperation = "source-over";
        context.font = this.info_box.fontStyle
        context.textAlign = this.info_box.textAlign
        context.fillStyle = this.info_box.background_color
        console.log(render_x, render_y, this.padding_y)
        let text_width = context.measureText(point.y)
        console.log("box left ", render_x - (text_width.width / 2))
        context.fillRect(render_x - (text_width.width / 2) - 5, render_y - 15 - 25, text_width.width + 10, 30)
        context.fillStyle = this.info_box.text_color

        context.fillText(point.y, render_x, render_y - 15)

        context.globalCompositeOperation = "destination-over";

    }

    drawBubble(ctx, x, y, w, h, radius) {
        var r = x + w;
        var b = y + h;
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = "2";
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + radius / 2, y - 10);
        ctx.lineTo(x + radius * 2, y);
        ctx.lineTo(r - radius, y);
        ctx.quadraticCurveTo(r, y, r, y + radius);
        ctx.lineTo(r, y + h - radius);
        ctx.quadraticCurveTo(r, b, r - radius, b);
        ctx.lineTo(x + radius, b);
        ctx.quadraticCurveTo(x, b, x, b - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.stroke();
    }
    renderGraph(relative_mouse_x, relative_mouse_y) {

        this.initGraph(this.canvas);
        let cxt = this.canvas.getContext("2d");
        this.points.forEach((value, index) => {
            if (this.points.length > 0 && index < this.points.length - 1) {
                this.drawLine(value, this.points[index + 1]);

            }

            this.drawCircle(value, this.pointStyle.pointSize, relative_mouse_x, relative_mouse_y, cxt);

        })

        // if (this.info_box.render && this.canvas.getContext("2d").isPointInPath(relative_mouse_x, relative_mouse_y)) {
        //     this.renderInfoBox(this.info_box.mouse_x, this.info_box.mouse_y, this.info_box.point);
        // }


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
    constructor(x, y) {
        this.x = x;
        this.y = y;
    };

};