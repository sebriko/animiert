/**
 * Represents a line.
 * @extends {createjs.Container}
 */
export class Line extends createjs.Container {
    /**
     * Creates an instance of Line.
     * @param {number} startX - The x-coordinate of the starting point of the line.
     * @param {number} startY - The y-coordinate of the starting point of the line.
     * @param {number} endX - The x-coordinate of the ending point of the line.
     * @param {number} endY - The y-coordinate of the ending point of the line.
     * @param {string} [color=createjs.Graphics.getRGB(255, 0, 0)] - The color of the line.
     * @param {number} [thickness=1] - The thickness of the line.
     * @param {Array<number>} [strokeDash=null] - The pattern of dashes and gaps.
     */
    constructor(startX, startY, endX, endY, color = createjs.Graphics.getRGB(255, 0, 0), thickness = 1, strokeDash = null) {
        super();
        this.color = color;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.rotation = 0;
        this.thickness = thickness;
        this.strokeDash = strokeDash; // Array for stroke pattern
        this.originalRotation = 0;
        this.setRotation = 0;
        this.line = new createjs.Shape();
        this.addChild(this.line);

        this.drawLine();
        stage.addChild(this); // Add the container to the stage
    }

    /**
     * Draws the line based on its properties.
     * @private
     */
    drawLine() {
        this.line.graphics.clear();
        this.line.graphics.beginStroke(this.color);
        this.line.graphics.setStrokeStyle(this.thickness);

        if (this.strokeDash) {
            this.line.graphics.setStrokeDash(this.strokeDash);
        }

        const dx = this.endX - this.startX;
        const dy = this.endY - this.startY;
        const lineLength = Math.sqrt(dx * dx + dy * dy);
        const originalRotation = Math.atan2(dy, dx) * 180 / Math.PI;
		
        this.line.graphics.moveTo(0, 0);
        this.line.graphics.lineTo(lineLength, 0);

        this.line.graphics.endStroke();

        this.line.rotation = originalRotation;
		
		this.line.x = this.startX;
		this.line.y = this.startY;
        stage.update();
    }

    /**
     * Sets the starting and ending coordinates of the line.
     * @param {number} startX - The x-coordinate of the starting point of the line.
     * @param {number} startY - The y-coordinate of the starting point of the line.
     * @param {number} endX - The x-coordinate of the ending point of the line.
     * @param {number} endY - The y-coordinate of the ending point of the line.
     */
    setStartEnd(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;

        this.drawLine();
    }
	
	/**
     * Sets the x-coordinate of the starting point of the line.
     * @param {number} startX - The x-coordinate of the starting point of the line.
     */
    setStartX(startX) {
        this.startX = startX;

        this.drawLine();
    }
	
	/**
     * Sets the y-coordinate of the starting point of the line.
     * @param {number} startY - The y-coordinate of the starting point of the line.
     */
    setStartY(startY) {
        this.startY = startY;

        this.drawLine();
    }
	
	/**
     * Sets the x-coordinate of the ending point of the line.
     * @param {number} endX - The x-coordinate of the ending point of the line.
     */
    setEndX(endX) {
        this.endX = endX;

        this.drawLine();
    }
	
	/**
     * Sets the y-coordinate of the ending point of the line.
     * @param {number} endY - The y-coordinate of the ending point of the line.
     */
    setEndY(endY) {
        this.endY = endY;

        this.drawLine();
    }
	
	/**
	 * Returns the Y-value for a given X on the line.
	 * @param {number} x - The X-coordinate.
	 * @returns {number} - The Y-coordinate corresponding to the X-value.
	 */
	getY(x) {
		const dx = this.endX - this.startX;
		const dy = this.endY - this.startY;
		const m = dy / dx; // Slope

		// Y = m * X + b, with b calculated using start point
		const b = this.startY - m * this.startX;

		return m * x + b;
	}

	/**
	 * Returns the X-value for a given Y on the line.
	 * @param {number} y - The Y-coordinate.
	 * @returns {number} - The X-coordinate corresponding to the Y-value.
	 */
	getX(y) {
		const dx = this.endX - this.startX;
		const dy = this.endY - this.startY;
		const m = dy / dx; // Slope

		// X = (Y - b) / m, with b calculated using start point
		const b = this.startY - m * this.startX;

		return (y - b) / m;
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

		this.line.mask = maskShape;
		stage.update();

	}
	
	/**
     * Sets the color of the line.
     * @param {string} newColor - The new color of the line.
     */
    setColor(newColor) {
        this.color = newColor;
        this.drawLine();
    }

	

    /**
     * Sets the rotation of the line.
     * @param {number} rotation - The rotation angle in degrees.
     */
    rotation(rotation) {
        this.setRotation = rotation;

        this.line.rotation = this.originalRotation + this.setRotation;
    }
}
