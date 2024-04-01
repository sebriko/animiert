/**
 * Represents a mathematical curve.
 * @extends {createjs.Shape}
 */
class MathCurve extends createjs.Shape {
    /**
     * Creates an instance of MathCurve.
     * @param {Function} equation The equation representing the curve.
     * @param {string} color The color of the curve.
     */
    constructor(equation, color) {
        super();
        this.graphics.setStrokeStyle(2); // Set the stroke width to 2

        // Pass the equation and color to the drawCurve method
        this.drawCurve(equation, color);
    }

    /**
     * Draws a mathematical curve based on the provided equation.
     * @param {Function} equation The equation representing the curve.
     * @param {string} color The color of the curve.
     */
    drawCurve(equation, color) {
        this.graphics.clear(); // Clear previous graphics
        this.graphics.beginStroke(color); // Set the stroke color

        // Draw the curve based on the equation
        for (let x = 0; x <= stage.canvas.width; x += 1) {
            const y = equation(x);
            if (x === 0) {
                this.graphics.moveTo(x, y);
            } else {
                this.graphics.lineTo(x, y);
            }
        }

        this.graphics.endStroke(); // End the stroke

        // Add the curve to the stage
        stage.addChild(this);
        stage.update(); // Update the stage to see the changes
    }
}
