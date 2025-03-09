import { Line } from '../com/Line.js'; 

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
		
		//Marker
		this.markedX = 0;
        this.markerInitialized = false;
        this.markColor = createjs.Graphics.getRGB(0, 0, 0);
        this.markRadius = 3;
		
		this.markedCircle = new createjs.Shape();
        this.markedCircle.graphics.setStrokeStyle(5);
        this.addChild(this.markedCircle);

        this.vGuideLine = new Line(0, 0, 0, 0, '#777777', thickness);
        this.addChild(this.vGuideLine);

        this.hGuideLine = new Line(0, 0, 0, 0, '#777777', thickness); 
        this.addChild(this.hGuideLine); 

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
	 * Replaces all points on the curve with a new set of points.
	 * @param {Array} newPoints - An array of objects, each containing x and y coordinates.
	 * Example: [{ x: 100, y: 150 }, { x: 200, y: 250 }]
	 */
	updatePoints(newPoints) {
		this.points = newPoints.map(({ x, y }) => ({ x, y }));
		this.drawCurve();
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

		// Punkte sortieren
		this.points.sort((a, b) => a.x - b.x);

		for (let i = 0; i < this.points.length - 1; i++) {
			let p0 = this.points[i === 0 ? i : i - 1];
			let p1 = this.points[i];
			let p2 = this.points[i + 1];
			let p3 = this.points[i + 2] || p2;

			const controlX1 = p1.x + (p2.x - p0.x) / 6;
			const controlY1 = p1.y + (p2.y - p0.y) / 6;

			const controlX2 = p2.x - (p3.x - p1.x) / 6;
			const controlY2 = p2.y - (p3.y - p1.y) / 6;

			if (p1.x <= x && x <= p2.x) {
				let t = 0.5;
				const tolerance = 0.0001;
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

				return this._bezierPoint(t, p1.y, controlY1, controlY2, p2.y);
			}
		}

		return null;
	}
	
	
	/**
	 * Returns the x-coordinate for a given y-coordinate on the curve.
	 * @param {number} y - The y-coordinate to query.
	 * @returns {number} - The x-coordinate at the given y-coordinate, or null if y is outside the curve.
	 */
	getX(y) {
		if (this.points.length < 2) return null;

		// Punkte sortieren
		this.points.sort((a, b) => a.y - b.y);

		for (let i = 0; i < this.points.length - 1; i++) {
			let p0 = this.points[i === 0 ? i : i - 1];
			let p1 = this.points[i];
			let p2 = this.points[i + 1];
			let p3 = this.points[i + 2] || p2;

			const controlX1 = p1.x + (p2.x - p0.x) / 6;
			const controlY1 = p1.y + (p2.y - p0.y) / 6;

			const controlX2 = p2.x - (p3.x - p1.x) / 6;
			const controlY2 = p2.y - (p3.y - p1.y) / 6;

			if (p1.y <= y && y <= p2.y) {
				let t = 0.5;
				const tolerance = 0.0001;
				let lower = 0, upper = 1;

				while (upper - lower > tolerance) {
					const curveY = this._bezierPoint(t, p1.y, controlY1, controlY2, p2.y);
					if (curveY < y) {
						lower = t;
					} else {
						upper = t;
					}
					t = (lower + upper) / 2;
				}

				return this._bezierPoint(t, p1.x, controlX1, controlX2, p2.x);
			}
		}

		return null;
	}
	
	
	
	
	/**
	 * Findet alle Schnittpunkte der Spline-Kurve mit einer gegebenen Linie.
	 * @param {number} x1 - Startpunkt X der Linie.
	 * @param {number} y1 - Startpunkt Y der Linie.
	 * @param {number} x2 - Endpunkt X der Linie.
	 * @param {number} y2 - Endpunkt Y der Linie.
	 * @param {number} [samples=100] - Anzahl der Abtastpunkte auf der Kurve.
	 * @returns {Array} - Ein Array mit Schnittpunkten als Objekte { x, y }.
	 */
	findIntersections(x1, y1, x2, y2, samples = 100) {
		let intersections = [];

		if (this.points.length < 2) return intersections;

		// Kurve in Liniensegmente zerlegen
		let previousPoint = this.points[0];
		for (let i = 1; i <= samples; i++) {
			let t = i / samples;
			let currentPoint = this.getPointOnCurve(t);

			let intersection = this.getLineIntersection(
				previousPoint.x, previousPoint.y, currentPoint.x, currentPoint.y,
				x1, y1, x2, y2
			);

			if (intersection) {
				intersections.push(intersection);
			}

			previousPoint = currentPoint;
		}

		return intersections;
	}

	/**
	 * Berechnet den Schnittpunkt zweier Liniensegmente.
	 * @returns {Object|null} - Schnittpunkt { x, y } oder null, falls keine Kreuzung.
	 */
	getLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
		let denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (denom === 0) return null; // Parallel oder identisch

		let px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denom;
		let py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denom;

		// Prüfen, ob der Punkt auf beiden Segmenten liegt
		if (
			px >= Math.min(x1, x2) && px <= Math.max(x1, x2) &&
			py >= Math.min(y1, y2) && py <= Math.max(y1, y2) &&
			px >= Math.min(x3, x4) && px <= Math.max(x3, x4) &&
			py >= Math.min(y3, y4) && py <= Math.max(y3, y4)
		) {
			return { x: px, y: py };
		}

		return null;
	}

	/**
	 * Berechnet einen Punkt auf der Spline-Kurve für einen gegebenen Parameter t.
	 * @param {number} t - Wert zwischen 0 und 1.
	 * @returns {Object} - Punkt { x, y } auf der Kurve.
	 */
	getPointOnCurve(t) {
		let n = this.points.length - 1;
		let i = Math.floor(t * n);
		let p0 = this.points[i === 0 ? i : i - 1];
		let p1 = this.points[i];
		let p2 = this.points[i + 1] || p1;
		let p3 = this.points[i + 2] || p2;

		let tt = (t * n) - i; // Lokaler t-Wert im aktuellen Segment

		let controlX1 = p1.x + (p2.x - p0.x) / 6;
		let controlY1 = p1.y + (p2.y - p0.y) / 6;
		let controlX2 = p2.x - (p3.x - p1.x) / 6;
		let controlY2 = p2.y - (p3.y - p1.y) / 6;

		let x = this.bezier(tt, p1.x, controlX1, controlX2, p2.x);
		let y = this.bezier(tt, p1.y, controlY1, controlY2, p2.y);

		return { x, y };
	}

	/**
	 * Berechnet einen Punkt auf einer kubischen Bézier-Kurve.
	 */
	bezier(t, p0, p1, p2, p3) {
		let u = 1 - t;
		return (u ** 3) * p0 + 3 * u ** 2 * t * p1 + 3 * u * (t ** 2) * p2 + (t ** 3) * p3;
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

    drawMarker(value = this.markedX, isPercentage = false, withLines = true) {
        if (!this.markerInitialized) {
            this.setMarkProperties();
        } else {
			this.markedCircle.visible = true;
		}

        this.markedX = isPercentage ? this.startX + (Math.max(0, Math.min(100, value)) / 100) * (this.endX - this.startX) : value;
        const markedY = this.getY(this.markedX);
        const startX = this.markedX;
        const startY = 0;
        const endX = this.markedX;
        const endY = markedY;

        this.markedCircle.x = this.markedX;
        this.markedCircle.y = markedY;
		

        if (withLines) {
            this.vGuideLine.setStartEnd(startX, startY, endX, endY);
            this.hGuideLine.setStartEnd(0, endY, endX, endY);
        }
    }
	
	/**
	 * Masks the current object with a rectangle.
	 * @param {number} x1 - The x-coordinate of the first point of the rectangle.
	 * @param {number} y1 - The y-coordinate of the first point of the rectangle.
	 * @param {number} x2 - The x-coordinate of the second point of the rectangle.
	 * @param {number} y2 - The y-coordinate of the second point of the rectangle.
	 */
	maskWithRectangle(x1, y1, x2, y2) {
		
		const maskShape = new createjs.Shape();
		maskShape.graphics.beginFill("#FFFFFF").drawRect(x1, y1, x2 - x1, y2 - y1); // Create the rectangle mask

		this.curveShape.mask = maskShape;
		stage.update();

	}




}
