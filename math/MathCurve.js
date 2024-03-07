export class MathCurve extends createjs.Shape {
    constructor(equation, startX, endX, scaleX, color=createjs.Graphics.getRGB(255, 0, 0), thickness=1) {
        super();
        this.equation = equation;
        this.color = color;
        this.startX = startX;
        this.endX = endX;
        this.scaleX = scaleX;
        this.thickness = thickness; // Neue Variable für Strichstärke

        this.graphics.setStrokeStyle(this.thickness); // Setze die Strichstärke im Konstruktor
        this.drawCurve();
    }

    drawCurve() {
        this.graphics.clear();
        this.graphics.beginStroke(this.color);
        this.graphics.setStrokeStyle(this.thickness); // Setze die Strichstärke in der Methode

        for (let x = this.startX; x <= this.endX; x += 1) {
            const y = this.equation(x);
            if (x === this.endX) {
                this.graphics.moveTo(x * this.scaleX, y);
            } else {
                this.graphics.lineTo(x * this.scaleX, y);
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

    setStrokeThickness(thickness) {
        this.thickness = thickness;
        this.graphics.setStrokeStyle(this.thickness); // Setze die Strichstärke neu
        this.drawCurve();
    }
}
