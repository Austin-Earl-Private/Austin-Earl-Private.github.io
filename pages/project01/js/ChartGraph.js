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
        this.left_padding = 30;
        this.padding_x = 30;
        this.padding_y = 30;
        // this.padding_y = this.padding_y + this.left_padding
        this.graph_h = canvas_ref.parentElement.getBoundingClientRect().height;
        this.graph_w = canvas_ref.parentElement.getBoundingClientRect().width;

        this.graphGridStyle = {}
        this.graphGridStyle.background_color = "#00000025"
        this.graphGridStyle.BaseLineColor = "#000000"
        this.graphGridStyle.innerLineColor = "#808080"

        this.info_box = {}
        this.info_box.background_color = "#a0a0a08f"
        this.info_box.text_color = "#000000"
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
        this.pointPosition.x_spacing = 15;

        this.selectedPoint;


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
        min = array_y_values[0]
        array_y_values.forEach(ele => {
            if (ele > max) {
                max = ele
            } else if (ele < min) {
                min = ele;
            }
        })
        min = min * .99
        max += max * .01

        if (min.toFixed(2) != 0) {
            this.min = min
            this.max = max
        } else {
            this.min = min
            this.max = max
        }


        let y_vals = array_y_values
        let x_pos = 0;

        // let text_width = this.canvas.getContext("2d").measureText(this.max)
        // this.left_padding = text_width.width

        // x_pos += this.padding_x + this.left_padding

        this.min_x = 0
        this.max_x = 0
        array_x_values.forEach((value, index) => {
            this.points.push(new Point(x_pos, y_vals[index]));
            x_pos += 1
            if (value > this.max_x) {
                this.max_x = x_pos
            } else if (value < this.min_x) {
                this.min_x = x_pos;
            }


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
        context.fillRect(this.padding_y + this.left_padding, this.padding_x, this.graph_w - this.padding_x * 2 - this.left_padding, this.graph_h - this.padding_y * 2)
        this.renderGraphLines();

    }

    renderGraphLines() {
        let cxt = this.canvas.getContext("2d");
        cxt.strokeStyle = this.graphGridStyle.BaseLineColor

        cxt.beginPath();
        cxt.moveTo(this.padding_x + this.left_padding, this.graph_h - this.padding_y);
        cxt.lineTo(this.graph_w - this.padding_x, this.graph_h - this.padding_y)
        cxt.closePath();
        cxt.stroke()

        cxt.beginPath();
        cxt.moveTo(this.padding_x + this.left_padding, this.graph_h - this.padding_y);
        cxt.lineTo(this.padding_x + this.left_padding, this.padding_y)
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
        let graph_render_hight = this.graph_h - this.padding_x * 2;
        let base_y_hight = graph_render_hight - (graph_render_hight * start_y_percent) + this.padding_y;
        // this.left_padding = cxt.measureText(value)

        cxt.beginPath();
        cxt.moveTo(this.padding_x + this.left_padding, base_y_hight);
        cxt.lineTo(this.graph_w - this.padding_x, base_y_hight)
        cxt.closePath();
        cxt.stroke()
        cxt.textAlign = "right"
        cxt.font = "15px Arial"
        cxt.fillStyle = this.graphGridStyle.innerLineColor

        cxt.fillText(value.toFixed(4), this.padding_x - 5 + this.left_padding, base_y_hight + 5)
    }

    drawLine(startPoint, endPoint) {
        // debugger;
        var context = this.canvas.getContext("2d");
        context.beginPath();

        // context.moveTo(startPoint.x, startPoint.y);

        let graph_render_hight = this.graph_h - this.padding_x * 2;
        let graph_render_length = this.graph_w - this.padding_y * 2;

        let start_point_y_calc = this.getPositionalPointFromBounds(startPoint.y, this.min, this.max, 0, graph_render_hight)
        let end_point_y_calc = this.getPositionalPointFromBounds(endPoint.y, this.min, this.max, 0, graph_render_hight);
        let start_point_x_calc = this.getPositionalPointFromBounds(startPoint.x, this.max_x, this.min_x, this.left_padding + this.padding_x, graph_render_length + this.left_padding)
        let end_point_x_calc = this.getPositionalPointFromBounds(endPoint.x, this.max_x, this.min_x, this.left_padding + this.padding_x, graph_render_length + this.left_padding);



        context.moveTo(start_point_x_calc, start_point_y_calc);


        context.lineTo(end_point_x_calc, end_point_y_calc);

        context.strokeStyle = this.lineStyle.lineColor;
        context.lineWidth = this.lineStyle.lineWidth;
        // console.log(context.strokeStyle, context.fillStyle, context.lineWidth)
        context.closePath();
        // context.globalCompositeOperation = "source-over";

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


        // context.globalCompositeOperation = "source-over";

        let graph_render_hight = this.graph_h - this.padding_y * 2;
        let graph_render_length = this.graph_w - this.padding_x * 2;
        let point_percent = (point.y - this.min) / (this.max - this.min);
        let x_point_percent = (point.x - this.max_x) / (this.min_x - this.max_x);


        // let point_calc = graph_render_hight - (graph_render_hight * point_percent) + this.padding_y;
        // let x_point_calc = graph_render_length - (graph_render_length * x_point_percent) + this.padding_x;
        // var context = this.canvas.getContext("2d");
        let point_calc = this.getPositionalPointFromBounds(point.y, this.min, this.max, 0, graph_render_hight)
        let x_point_calc = this.getPositionalPointFromBounds(point.x, this.max_x, this.min_x, this.left_padding + this.padding_x, graph_render_length + this.left_padding);


        context.strokeStyle = this.pointStyle.outLine_color;
        context.fillStyle = this.pointStyle.background_color;
        context.lineWidth = this.pointStyle.lineWidth;

        context.beginPath();
        context.arc(x_point_calc, point_calc, size, 0, Math.PI * 2, true);
        context.closePath();
        if (context.isPointInPath(relative_mouse_x, relative_mouse_y)) {
            // context.globalCompositeOperation = "source-over";

            // context.globalCompositeOperation = "source-over";
            context.beginPath();


            // console.log("width", this.graph_w, "Xpoint clacl", x_point_calc, "Percent ", x_point_percent, " x_min ", this.min_x, "max x ", this.max_x, "point x", point.x)

            context.arc(x_point_calc, point_calc, size + size * this.pointStyle.pointGrowthMultiplyer, 0, Math.PI * 2, true);
            context.closePath();
            this.info_box.render = true;
            this.info_box.mouse_x = relative_mouse_x;
            this.info_box.mouse_y = relative_mouse_y;
            this.info_box.point = point;
            // context.globalCompositeOperation = "destination-over";
            // context.globalCompositeOperation = "destination-over";


            // this.renderInfoBox(context, this.info_box.mouse_x, this.info_box.mouse_y, this.info_box.point);
            // this.drawBubble(bubble_context, relative_mouse_x, relative_mouse_y, 30, 30, 2)
            // console.log(context.strokeStyle, context.fillStyle, context.lineWidth)
        }
        context.strokeStyle = this.pointStyle.outLine_color;
        context.fillStyle = this.pointStyle.background_color;
        context.lineWidth = this.pointStyle.lineWidth;
        if (context.isPointInPath(relative_mouse_x, relative_mouse_y)) {
            console.log(context.strokeStyle, context.fillStyle, context.lineWidth)
        }
        context.fill();
        context.stroke();
        // context.globalCompositeOperation = "destination-over";


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
        // console.log(render_x, render_y, this.padding_y)


        let graph_render_length = this.graph_w - this.padding_y * 2

        let text = parseFloat(point.y) + ""

        let text_width = context.measureText(text)

        if (mouse_x - text_width.width / 2 < 0) {
            // Shift over to the right if we are going off the graph
            let shift = mouse_x - text_width.width / 2
            context.fillRect(render_x - (text_width.width / 2) - 5 - shift, render_y - 15 - 25, text_width.width + 10, 30)
            context.fillStyle = this.info_box.text_color

            context.fillText(text, render_x - shift + 5, render_y - 15)
        } else if (mouse_x + text_width.width / 2 > graph_render_length) {
            let shift = mouse_x + text_width.width / 2 - graph_render_length
            context.fillRect(render_x - (text_width.width / 2) - 5 - shift, render_y - 15 - 25, text_width.width + 10, 30)
            context.fillStyle = this.info_box.text_color

            context.fillText(text, render_x - shift + 5, render_y - 15)
        } else {
            context.fillRect(render_x - (text_width.width / 2) - 5, render_y - 15 - 25, text_width.width + 10, 30)
            context.fillStyle = this.info_box.text_color

            context.fillText(text, render_x, render_y - 15)
        }




        // context.globalCompositeOperation = "destination-over";

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
        this.info_box.render = false
        this.points.forEach((value, index) => {
            if (this.points.length > 0 && index < this.points.length - 1) {
                this.drawLine(value, this.points[index + 1]);

            }

            this.drawCircle(value, this.pointStyle.pointSize, relative_mouse_x, relative_mouse_y, cxt);

        })

        // this.renderInfoBox(this.getContext("2d"), relative_mouse_x, relative_mouse_y, this.selectedPoint)
        if (this.info_box.render) {

            this.renderInfoBox(this.canvas.getContext("2d"), this.info_box.mouse_x, this.info_box.mouse_y, this.info_box.point);
        }

        // if (this.info_box.render && this.canvas.getContext("2d").isPointInPath(relative_mouse_x, relative_mouse_y)) {
        //     this.renderInfoBox(this.info_box.mouse_x, this.info_box.mouse_y, this.info_box.point);
        // }


    }

    /**
     * 
     * @param {Number} value 
     * @param {Number} min 
     * @param {Number} max 
     */
    getNormalizedPercentValue(value, min, max) {
        return (value - min) / (max - min);
    }

    /**
     * Get positionalPoint From bounds will calculate the Percent difference from min and max possible values
     * and return a value with that percent inbetween the lower and upper Bounds.
     * if your min val is 5 and max val 15 and lower bounds 0 and upper bounds 10
     * and your value is 10
     * the percent value is 50%
     * 50% of 0-10 is 5 
     * so 5 is returned.
     * This is used to allow dynamicly scaled windows for points on the y and x
     * @param {Number} value 
     * @param {Number} min 
     * @param {Number} max 
     * @param {Number} lowerBounds 
     * @param {Number} upperBounds 
     */
    getPositionalPointFromBounds(value, min, max, lowerBounds, upperBounds) {
        let percent = this.getNormalizedPercentValue(value, min, max);
        let innerBounds = upperBounds - lowerBounds;
        let valueMoved = (innerBounds - (innerBounds * percent)) + lowerBounds
        return valueMoved
    }


}

export class Point {
    x = 0;
    y = 0;
    extra = {}
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    };

    /**
     * 
     * @param {Object} extra
     */
    set extra(extra) {
        this.extra = extra
    };

};