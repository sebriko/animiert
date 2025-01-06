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

		graphics.beginStroke(this.color);
		graphics.setStrokeStyle(this.thickness);

		if (this.points.length > 1) {
			graphics.moveTo(this.points[0].x, this.points[0].y);

			for (let i = 0; i < this.points.length - 1; i++) {
				const p0 = this.points[i === 0 ? i : i - 1]; 
				const p1 = this.points[i];                  
				const p2 = this.points[i + 1];              
				const p3 = this.points[i + 2] || p2;       

				const controlX1 = p1.x + (p2.x - p0.x) / 6;
				const controlY1 = p1.y + (p2.y - p0.y) / 6;

				const controlX2 = p2.x - (p3.x - p1.x) / 6;
				const controlY2 = p2.y - (p3.y - p1.y) / 6;

				graphics.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, p2.x, p2.y);
			}
		}

		graphics.endStroke();
	}



/**
 * Returns the y-coordinate for a given x-coordinate on the curve.
 * @param {number} x - The x-coordinate to query.
 * @returns {number} - The y-coordinate at the given x-coordinate, or null if x is outside the curve.
 */
getY(x) {
    if (this.points.length < 2) return null;

    for (let i = 0; i < this.points.length - 1; i++) {
        const p0 = this.points[i === 0 ? i : i - 1];
        const p1 = this.points[i];
        const p2 = this.points[i + 1];
        const p3 = this.points[i + 2] || p2;

        // Kontrollpunkte für diesen Abschnitt berechnen
        const controlX1 = p1.x + (p2.x - p0.x) / 6;
        const controlY1 = p1.y + (p2.y - p0.y) / 6;

        const controlX2 = p2.x - (p3.x - p1.x) / 6;
        const controlY2 = p2.y - (p3.y - p1.y) / 6;

        // Prüfen, ob x in diesem Abschnitt liegt
        if (p1.x <= x && x <= p2.x) {
            // Parameter t iterativ bestimmen
            let t = 0.5; // Startwert
            const tolerance = 0.0001; // Genauigkeit
            let lower = 0, upper = 1;

            while (upper - lower > tolerance) {
                const curveX = this._bezierPoint(t, p1.x, controlX1, controlX2, p2.x);
                if (curveX < x) {
                    lower = t;
                } else {
                    upper = t;
                }
                t = (lower + upper) / 2;
            }

            // y-Wert berechnen
            const curveY = this._bezierPoint(t, p1.y, controlY1, controlY2, p2.y);
            return curveY;
        }
    }

    return null; // Wenn x außerhalb der Kurve liegt
}

/**
 * Helper function to calculate a point on a Bézier curve for a given t.
 * @param {number} t - The parameter (0 <= t <= 1).
 * @param {number} p0 - The starting point.
 * @param {number} p1 - The first control point.
 * @param {number} p2 - The second control point.
 * @param {number} p3 - The ending point.
 * @returns {number} - The calculated point value.
 */
_bezierPoint(t, p0, p1, p2, p3) {
    const oneMinusT = 1 - t;
    return (
        oneMinusT ** 3 * p0 +
        3 * oneMinusT ** 2 * t * p1 +
        3 * oneMinusT * t ** 2 * p2 +
        t ** 3 * p3
    );
}
}
