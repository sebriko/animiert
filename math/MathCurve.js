import { Line } from '../com/Line.js'; 

/**
 * MathCurve class represents a mathematical curve drawn on the stage.
 * @extends createjs.Container
 */
export class MathCurve extends createjs.Container {
    /**
     * Creates an instance of MathCurve.
     * @param {Function} equation - The mathematical equation defining the curve.
     * @param {number} startX - The starting value of x.
     * @param {number} endX - The ending value of x.
     * @param {number} step - The step size for incrementing x.
     * @param {number} scaleValueX - The scaling factor for x-axis.
     * @param {string} [color=createjs.Graphics.getRGB(255, 0, 0)] - The color of the curve.
     * @param {number} [thickness=1] - The thickness of the curve.
     */
    constructor(equation, startX, endX, step, scaleValueX, color=createjs.Graphics.getRGB(255, 0, 0), thickness=1) {
        super();
        this.equation = equation;
        this.color = color;
        this.startX = startX;
        this.endX = endX;
        this.scaleValueX = scaleValueX;
        this.markedX = 0;
        this.markerInitialized = false;
        this.markColor = createjs.Graphics.getRGB(0, 0, 0);
        this.markRadius = 3;
        this.thickness = thickness;
        this.step = step;
        // Erstelle die Kurve
        this.curve = new createjs.Shape();
        this.curve.graphics.setStrokeStyle(this.thickness);
        this.addChild(this.curve);

        // Erstelle den Kreis
        this.markedCircle = new createjs.Shape();
        this.markedCircle.graphics.setStrokeStyle(5);
        this.addChild(this.markedCircle);

        this.vGuideLine = new Line(0, 0, 0, 0, color, thickness);
        this.addChild(this.vGuideLine);

        this.hGuideLine = new Line(0, 0, 0, 0, color, thickness); 
        this.addChild(this.hGuideLine); 

        this.drawCurve();
        stage.addChild(this); 
    }

    /**
     * Draws the curve based on the provided equation and parameters.
     */
    drawCurve() {
        this.curve.graphics.clear();
        this.curve.graphics.beginStroke(this.color);
        this.curve.graphics.setStrokeStyle(this.thickness);

        for (let x = this.startX; x <= this.endX; x += this.step) {
            const y = this.equation(x);

            if (x === this.startX) {
                this.curve.graphics.moveTo(x * this.scaleValueX, y);
            } else {
                this.curve.graphics.lineTo(x * this.scaleValueX, y);
            }
        }

        this.curve.graphics.endStroke();
        stage.update();
    }

    /**
     * Sets the starting value of x and redraws the curve.
     * @param {number} startX - The new starting value of x.
     */
    setStartX(startX) {
        this.startX = startX;
        this.drawCurve();
    }

    /**
     * Sets the ending value of x and redraws the curve.
     * @param {number} endX - The new ending value of x.
     */
    setEndX(endX) {
        this.endX = endX;
        this.drawCurve();
    }

    /**
     * Sets the thickness of the curve and redraws it.
     * @param {number} thickness - The new thickness of the curve.
     */
    setStrokeThickness(thickness) {
        this.thickness = thickness;
        this.curve.graphics.setStrokeStyle(this.thickness);
        this.drawCurve();
    }

    /**
     * Sets the properties of the marker for specific points on the curve.
     * @param {string} [color] - The color of the marker.
     * @param {number} [radius] - The radius of the marker.
     */
    setMarkProperties(color, radius) {
        this.markerInitialized = true;
        this.markColor = color || this.markColor;
        this.markRadius = radius || this.markRadius;

        this.markedCircle.graphics.clear();
        this.markedCircle.graphics.beginFill(this.markColor)
            .drawCircle(0, 0, this.markRadius)
            .endFill();

        stage.update();
    }

    /**
     * Draws guidelines at a specified x-coordinate on the curve.
     * @param {number} [x=this.markedX] - The x-coordinate where guidelines should be drawn.
     */
    drawMarker(x=this.markedX, withLines=true) {
        if (!this.markerInitialized) {
            this.setMarkProperties();
        }

        this.markedX = x;
        const markedY = this.equation(this.markedX); // Calculate the result of the equation
        const startX = this.markedX;
        const startY = 0;
        const endX = this.markedX;
        const endY = markedY;

        this.markedCircle.x = x;
        this.markedCircle.y = markedY;

        // Update the coordinates of the line
		if (withLines===true) {
        this.vGuideLine.setStartEnd(startX, startY, endX, endY);
		this.hGuideLine.setStartEnd(0, endY, endX, endY);
		}
    }
}
