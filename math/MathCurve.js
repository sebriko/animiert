// Exportiere die MathCurve-Klasse als Modul
export class MathCurve extends createjs.Shape {
    constructor(equation, startX, endX, scaleX, color) {
        super();
        this.equation = equation;
        this.color = color;
        this.startX = startX;
        this.endX = endX;
		
		this.scaleX = scaleX;

        this.graphics.setStrokeStyle(2);
        this.drawCurve();
    }

    drawCurve() {
        this.graphics.clear();
        this.graphics.beginStroke(this.color);

        for (let x = this.startX; x <= this.endX; x += 1) {
			
            const y = this.equation(x);
            if (x === this.endX) {
                this.graphics.moveTo(x*this.scaleX, y);
            } else {
                this.graphics.lineTo(x*this.scaleX, y);
            }
        }

        this.graphics.endStroke();

        stage.addChild(this);
        stage.update();
    }

    setStartX(startX) {
        this.startX = startX;
        this.drawCurve();
    }

    setEndX(endX) {
        this.endX = endX;
        this.drawCurve();
    }
}
