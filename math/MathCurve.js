// Exportiere die MathCurve-Klasse als Modul
export class MathCurve extends createjs.Shape {
    constructor(equation, color) {
        super();
        this.graphics.setStrokeStyle(2);
        this.drawCurve(equation, color);
    }

    drawCurve(equation, color) {
        this.graphics.clear();
        this.graphics.beginStroke(color);

        for (let x = 0; x <= stage.canvas.width; x += 1) {
            const y = equation(x);
            if (x === 0) {
                this.graphics.moveTo(x, y);
            } else {
                this.graphics.lineTo(x, y);
            }
        }

        this.graphics.endStroke();

        stage.addChild(this);
        stage.update();
    }
}