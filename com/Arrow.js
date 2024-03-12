export class Arrow extends createjs.Container {
    constructor(startX, startY, endX, endY, color = createjs.Graphics.getRGB(255, 0, 0), size, ratio, thickness=1) {
        super();
        this.color = color;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.size = size;
        this.ratio = ratio;
		this.rotation = 0;
        this.thickness = thickness;
		this.originalRotation = 0;
		this.setRotation = 0;
        this.arrow = new createjs.Shape();
        this.addChild(this.arrow);

        this.drawArrow();
        stage.addChild(this); // Füge den Container zur Bühne hinzu
    }

    drawArrow() {
        this.arrow.graphics.clear();
        this.arrow.graphics.beginStroke(this.color);
        this.arrow.graphics.setStrokeStyle(this.thickness);

        // Berechne die Länge und Rotation des Pfeils
        const dx = this.endX - this.startX;
        const dy = this.endY - this.startY;
        const arrowLength = Math.sqrt(dx * dx + dy * dy);
        const originalRotation = Math.atan2(dy, dx)*180/Math.PI;
		
		

        // Zeichne die Linie des Pfeils
        this.arrow.graphics.moveTo(0, 0);
        this.arrow.graphics.lineTo(arrowLength,0);

        // Zeichne die Pfeilspitze 
        this.arrow.graphics.moveTo(arrowLength, 0);
        this.arrow.graphics.lineTo(arrowLength-this.size, -this.ratio);
		this.arrow.graphics.lineTo(arrowLength-this.size, this.ratio);
		this.arrow.graphics.lineTo(arrowLength, 0);

        this.arrow.graphics.endStroke();
		
		
		this.arrow.x = this.startX;
		this.arrow.y = this.startY;
		
		
		
		this.arrow.rotation = originalRotation;
		

        stage.update();
		
    }

    setStartEnd(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;

        this.drawArrow();
    }
	
	    rotation(rotation) {
        this.setRotation = rotation;
		
		this.arrow.rotation = originalRotation+setRotation;

    }
	
	
	
}
