/**
 * Represents an arrow object.
 * @extends createjs.Container
 */
export class Arrow extends createjs.Container {
    /**
     * Constructs a new Arrow object.
     * @param {number} startX - The x-coordinate of the start position.
     * @param {number} startY - The y-coordinate of the start position.
     * @param {number} endX - The x-coordinate of the end position.
     * @param {number} endY - The y-coordinate of the end position.
     * @param {number} [color] - Color of the arrow.
     * @param {number} [arrowHeadLength] - The length of the arrow.
     * @param {number} [arrowHeadWidth] - The width of the arrow.
     * @param {number} [thickness] - Thickness of the arrow.
     */
    constructor(startX, startY, endX, endY, color = createjs.Graphics.getRGB(255, 0, 0), arrowHeadLength, arrowHeadWidth, thickness = 1) {
        super();
        this.color = color;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.arrowHeadLength = arrowHeadLength;
        this.arrowHeadWidth = arrowHeadWidth;
        this.rotation = 0;
        this.thickness = thickness;
        this.originalRotation = 0;
        this.setRotation = 0;
        this.arrow = new createjs.Shape();
        this.addChild(this.arrow);

        this.drawArrow();
        stage.addChild(this); 
    }

    /**
     * Draws the arrow based on its properties.
     * @private
     */
    drawArrow() {
        this.arrow.graphics.clear();
        this.arrow.graphics.beginStroke(this.color);
        this.arrow.graphics.beginFill(this.color); 

        this.arrow.graphics.setStrokeStyle(this.thickness);

        // Calculate arrow length and rotation
        const dx = this.endX - this.startX;
        const dy = this.endY - this.startY;
        const arrowHeadLength = Math.sqrt(dx * dx + dy * dy);
        const originalRotation = Math.atan2(dy, dx) * 180 / Math.PI;

        // Draw the arrow line
        this.arrow.graphics.moveTo(0, 0);
        this.arrow.graphics.lineTo(arrowHeadLength, 0);

        // Draw the arrowhead
        this.arrow.graphics.moveTo(arrowHeadLength, 0);
        this.arrow.graphics.lineTo(arrowHeadLength - this.arrowHeadLength, -this.arrowHeadWidth / 2);
        this.arrow.graphics.lineTo(arrowHeadLength - this.arrowHeadLength, this.arrowHeadWidth / 2);
        this.arrow.graphics.lineTo(arrowHeadLength, 0);

        this.arrow.graphics.endFill();
        this.arrow.graphics.endStroke();

        this.arrow.x = this.startX;
        this.arrow.y = this.startY;

        this.arrow.rotation = originalRotation;

        stage.update();
    }

    /**
     * Sets the start and end positions of the arrow.
     * @param {number} startX - The x-coordinate of the start position.
     * @param {number} startY - The y-coordinate of the start position.
     * @param {number} endX - The x-coordinate of the end position.
     * @param {number} endY - The y-coordinate of the end position.
     */
    setStartEnd(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;

        this.drawArrow();
    }

    /**
     * Sets the rotation of the arrow.
     * @param {number} rotation - The rotation angle in degrees.
     */
    rotation(rotation) {
        this.setRotation = rotation;

        this.arrow.rotation = this.originalRotation + this.setRotation;
    }
}
