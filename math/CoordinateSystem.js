import { Arrow } from '../com/Arrow.js';

/**
 * Represents a coordinate system.
 * @extends createjs.Container
 */
export class CoordinateSystem extends createjs.Container {
    /**
     * Creates an instance of CoordinateSystem.
     * @param {number} sizeTop - The size of the top arrow.
     * @param {number} sizeBottom - The size of the bottom arrow.
     * @param {number} sizeLeft - The size of the left arrow.
     * @param {number} sizeRight - The size of the right arrow.
     * @param {string} [color=createjs.Graphics.getRGB(255, 0, 0)] - The color of the arrows.
     * @param {number} arrowLength - The length of the arrows.
     * @param {number} arrowWidth - The width of the arrows.
     * @param {number} [thickness=1] - The thickness of the arrows.
     */
    constructor(sizeTop, sizeBottom, sizeLeft, sizeRight, color = createjs.Graphics.getRGB(255, 0, 0), arrowLength, arrowWidth, thickness = 1) {
        super();
		
        this.sizeTop = sizeTop;
        this.sizeBottom = sizeBottom;
        this.sizeLeft = sizeLeft;
        this.sizeRight = sizeRight;
		
		this.arrowLength = arrowLength;
        this.arrowWidth = arrowWidth;
		
        this.color = color;
        this.thickness = thickness;

        this.drawCoordinateSystem();
        stage.addChild(this); // Add the container to the stage
    }

    /**
     * Draws the coordinate system with arrows.
     */
    drawCoordinateSystem() {
		
        if (this.sizeTop != 0) {
            this.arrowTop = new Arrow(0, 0, 0, -this.sizeTop, this.color, this.arrowLength, this.arrowWidth, 1);
            this.addChild(this.arrowTop);
        }
		
        if (this.sizeBottom != 0) {
		    this.arrowBottom = new Arrow(0, 0, 0, this.sizeBottom, this.color, this.arrowLength, this.arrowWidth, 1);
            this.addChild(this.arrowBottom);
        }		
		
        if (this.sizeLeft != 0) {
            this.arrowLeft = new Arrow(0, 0, -this.sizeLeft, 0, this.color, this.arrowLength, this.arrowWidth, 1);
            this.addChild(this.arrowLeft);
        }		

        if (this.sizeRight != 0) {
            this.arrowRight = new Arrow(0, 0, this.sizeRight, 0, this.color, this.arrowLength, this.arrowWidth, 1);
            this.addChild(this.arrowRight);
        }		

        stage.update();
    }
}
