import { Line } from '../com/Line.js'; 

export class PointsCurve extends createjs.Container {
    constructor(points, scaleValueX, scaleValueY, color=createjs.Graphics.getRGB(255, 0, 0), thickness=1) {
        super();
        this.points = points;  // Array von Punkten [{x: number, y: number}]
        this.color = color;
        this.scaleValueX = scaleValueX;
        this.scaleValueY = scaleValueY;
        this.thickness = thickness;

        this.curve = new createjs.Shape();
        this.curve.graphics.setStrokeStyle(this.thickness);
        this.addChild(this.curve);

        this.drawCurve();
        stage.addChild(this); 
    }

    drawCurve() {
        this.curve.graphics.clear();
        this.curve.graphics.beginStroke(this.color);
        this.curve.graphics.setStrokeStyle(this.thickness);

        // Punkte verbinden
        this.points.forEach((point, index) => {
            const { x, y } = point;
            if (index === 0) {
                this.curve.graphics.moveTo(x * this.scaleValueX, y * this.scaleValueY);
            } else {
                this.curve.graphics.lineTo(x * this.scaleValueX, y * this.scaleValueY);
            }
        });

        this.curve.graphics.endStroke();
        stage.update();
    }
	
	updatePoints(newPoints) {
		// Punkte aktualisieren
		this.points = newPoints;
		this.drawCurve();
	}



}
