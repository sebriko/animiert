/**
 * Represents a quadratic Bezier curve.
 * @extends {createjs.Container}
 */
export class BezierCurve extends createjs.Container {
    /**
     * Creates an instance of BezierCurve.
     * @param {number} startX - The x-coordinate of the starting point of the curve.
     * @param {number} startY - The y-coordinate of the starting point of the curve.
     * @param {number} controlX - The x-coordinate of the control point of the curve.
     * @param {number} controlY - The y-coordinate of the control point of the curve.
     * @param {number} endX - The x-coordinate of the ending point of the curve.
     * @param {number} endY - The y-coordinate of the ending point of the curve.
     * @param {string} [color='black'] - The color of the curve.
     * @param {number} [thickness=2] - The thickness of the curve.
     */
    constructor(startX, startY, controlX, controlY, endX, endY, color = 'black', thickness = 2) {

        super();
        this.startX = startX;
        this.startY = startY;
        this.controlX = controlX;
        this.controlY = controlY;
        this.endX = endX;
        this.endY = endY;
        this.color = color;
        this.thickness = thickness;

        this.curveShape = new createjs.Shape();
        
        this.addChild(this.curveShape);

        this.drawCurve();
        stage.addChild(this); 
    }

    /**
     * Draws the Bezier curve.
	 * @private
     */
    drawCurve() {
        const graphics = this.curveShape.graphics;
        graphics.clear();

        graphics.beginStroke(this.color);
        graphics.setStrokeStyle(this.thickness);

        graphics.moveTo(this.startX, this.startY);
        graphics.quadraticCurveTo(this.controlX, this.controlY, this.endX, this.endY);

        graphics.endStroke();
    }

    /**
     * Calculates the y-coordinate on the curve for a given x-coordinate.
     * @param {number} x - The x-coordinate for which to calculate the y-coordinate.
     * @returns {number} - The y-coordinate at the given x-coordinate.
     */
    getY(x) {
        // Calculate the parameter t based on the given x-coordinate
        const t = this.calculateT(x);

        // Calculate the y-coordinate using the quadratic Bezier formula
        const y = (1 - t) ** 2 * this.startY +
                  2 * (1 - t) * t * this.controlY +
                  t ** 2 * this.endY;

        return y;
    }

    /**
     * Calculates the parameter t for the given x-coordinate.
     * @param {number} x - The x-coordinate.
     * @returns {number} - The parameter t corresponding to the given x-coordinate.
	 * @private
     */
    calculateT(x) {
 
        const totalLength = this.endX - this.startX;

        const position = x - this.startX;

        return position / totalLength;
    }

    /**
     * Displays the control points and lines connecting them to the curve's endpoints.
     */
    showControls() {

        const controlLineShape = new createjs.Shape();

        controlLineShape.graphics.beginStroke('gray');
        controlLineShape.graphics.setStrokeStyle(1);
        
        controlLineShape.graphics.moveTo(this.startX, this.startY);
        controlLineShape.graphics.lineTo(this.controlX, this.controlY);
        controlLineShape.graphics.lineTo(this.endX, this.endY);

        controlLineShape.graphics.endStroke();

        this.addChild(controlLineShape);

        const controlPointShape = new createjs.Shape();
        controlPointShape.graphics.beginFill('gray');
        controlPointShape.graphics.drawCircle(this.controlX, this.controlY, 4);
        controlPointShape.graphics.endFill();
        
        this.addChild(controlPointShape);
    }
}