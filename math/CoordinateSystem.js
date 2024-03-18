import { Arrow } from '../com/Arrow.js';

export class CoordinateSystem extends createjs.Container {
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
        stage.addChild(this); // Füge den Container zur Bühne hinzu
    }

    drawCoordinateSystem() {
		
        if (this.sizeTop != 0) {
            this.arrowTop = new Arrow(0, 0, 0, -this.sizeTop, this.color, this.arrowLength, this.arrowWidth, 1);
            this.addChild(this.arrowTop);
        }
		
        if (this.sizeBottom != 0) {
		    this.arrowTop = new Arrow(0, 0, 0, this.sizeBottom, this.color, this.arrowLength, this.arrowWidth, 1);
            this.addChild(this.arrowTop);
        }		
		
		        if (this.sizeLeft!= 0) {
				
            this.arrowLeft = new Arrow(0, 0, -this.sizeLeft, 0, this.color, this.arrowLength, this.arrowWidth, 1);
            this.addChild(this.arrowLeft);
        }		
				        if (this.sizeRight!= 0) {
            this.arrowRight = new Arrow(0, 0, this.sizeRight, 0, this.color, this.arrowLength, this.arrowWidth, 1);
            this.addChild(this.arrowRight);
        }		
		
		
		
		

        stage.update();
    }
}
