/**
 * Represents a Spline curve.
 * @extends {createjs.Container}
 */
export class SplineCurve extends createjs.Container {
    /**
     * Creates an instance of SplineCurve.
     * @param {Array} points - An array of points defining the curve, where each point is an object with x and y properties.
     * @param {string} [color='black'] - The color of the curve.
     * @param {number} [thickness=2] - The thickness of the curve.
     */
    constructor(points = [], color = 'black', thickness = 2) {
        // Call the parent class constructor
        super();
        // Store the points, color, and thickness
        this.points = points;
        this.color = color;
        this.thickness = thickness;

        // Create a createjs.Shape instance for drawing the curve
        this.curveShape = new createjs.Shape();
        
        // Add the shape instance to this container
        this.addChild(this.curveShape);

        // Draw the Spline curve
        this.drawCurve();
		stage.addChild(this); // Füge den Container zur Bühne hinzu
    }

    /**
     * Adds a point to the curve.
     * @param {number} x - The x-coordinate of the point.
     * @param {number} y - The y-coordinate of the point.
     */
    addPoint(x, y) {
        this.points.push({ x, y });
        this.drawCurve();
    }

    /**
     * Removes a point from the curve.
     * @param {number} index - The index of the point to remove.
     */
    removePoint(index) {
        if (index >= 0 && index < this.points.length) {
            this.points.splice(index, 1);
            this.drawCurve();
        }
    }

    /**
     * Updates a point on the curve.
     * @param {number} index - The index of the point to update.
     * @param {number} x - The new x-coordinate of the point.
     * @param {number} y - The new y-coordinate of the point.
     */
    updatePoint(index, x, y) {
        if (index >= 0 && index < this.points.length) {
            this.points[index].x = x;
            this.points[index].y = y;
            this.drawCurve();
        }
    }

    /**
     * Draws the Spline curve based on the current points.
     */
    drawCurve() {
        const graphics = this.curveShape.graphics;
        graphics.clear();

        // Set color and thickness of the curve
        graphics.beginStroke(this.color);
        graphics.setStrokeStyle(this.thickness);

        // Draw the curve using quadraticCurveTo for each pair of points
        if (this.points.length > 1) {
            graphics.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length - 1; i++) {
                const controlX = (this.points[i].x + this.points[i + 1].x) / 2;
                const controlY = (this.points[i].y + this.points[i + 1].y) / 2;
                graphics.quadraticCurveTo(this.points[i].x, this.points[i].y, controlX, controlY);
            }
        }

        graphics.endStroke();
    }

    /**
     * Returns the y-coordinate for a given x-coordinate on the curve.
     * @param {number} x - The x-coordinate to query.
     * @returns {number} - The y-coordinate at the given x-coordinate.
     */
    getY(x) {
        // Implement a method to find y for a given x-coordinate
        let previousPoint = null;
        let nextPoint = null;
        for (let i = 0; i < this.points.length - 1; i++) {
            const point1 = this.points[i];
            const point2 = this.points[i + 1];
            if (point1.x <= x && x <= point2.x) {
                previousPoint = point1;
                nextPoint = point2;
                break;
            }
        }
        if (previousPoint && nextPoint) {
            // Linear interpolation for simplicity
            const t = (x - previousPoint.x) / (nextPoint.x - previousPoint.x);
            const y = previousPoint.y + t * (nextPoint.y - previousPoint.y);
            return y;
        }
        return null;
    }
}
