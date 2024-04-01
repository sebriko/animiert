export class Line extends createjs.Container {
    constructor(startX, startY, endX, endY, color = createjs.Graphics.getRGB(255, 0, 0), thickness = 1, strokeDash = null) {
        super();
        this.color = color;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.rotation = 0;
        this.thickness = thickness;
        this.strokeDash = strokeDash; // Array für das Strichmuster
        this.originalRotation = 0;
        this.setRotation = 0;
        this.line = new createjs.Shape();
        this.addChild(this.line);

        this.drawLine();
        stage.addChild(this); // Füge den Container zur Bühne hinzu
    }

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

        stage.update();
    }

    setStartEnd(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;

        this.drawLine();
    }

    rotation(rotation) {
        this.setRotation = rotation;

        this.line.rotation = this.originalRotation + this.setRotation;
    }
}
