export class MathCurve extends createjs.Container {
    constructor(equation, startX, endX, step, scaleValueX, color=createjs.Graphics.getRGB(255, 0, 0), thickness=1) {
        super();
        this.equation = equation;
        this.color = color;
        this.startX = startX;
        this.endX = endX;
        this.scaleValueX = scaleValueX;
		this.markedX = 0;
		this.markerInitialized = false;
		this.markColor = createjs.Graphics.getRGB(0, 0, 0);
		this.markRadius = 3;
        this.thickness = thickness;
this.step = step;
        // Erstelle die Kurve
        this.curve = new createjs.Shape();
        this.curve.graphics.setStrokeStyle(this.thickness);
        this.addChild(this.curve);

        // Erstelle den Kreis
        this.markedCircle = new createjs.Shape();
        this.markedCircle.graphics.setStrokeStyle(5);
        this.addChild(this.markedCircle);

        this.drawCurve();
        stage.addChild(this); // Füge den Container zur Bühne hinzu
    }

    drawCurve() {
        this.curve.graphics.clear();
        this.curve.graphics.beginStroke(this.color);
        this.curve.graphics.setStrokeStyle(this.thickness);

        for (let x = this.startX; x <= this.endX; x += this.step) {
            const y = -this.equation(x);
		
            if (x === this.startX) {
                this.curve.graphics.moveTo(x * this.scaleValueX, y);
            } else {
                this.curve.graphics.lineTo(x * this.scaleValueX, y);
            }
        }

        this.curve.graphics.endStroke();
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
        this.curve.graphics.setStrokeStyle(this.thickness);
        this.drawCurve();
    }

    setMarkProperties(color, radius) {
        this.markerInitialized = true;
        this.markColor = color || this.markColor;
        this.markRadius = radius || this.markRadius;

        this.markedCircle.graphics.clear();
        this.markedCircle.graphics.beginFill(this.markColor)
            .drawCircle(0, 0, this.markRadius)
            .endFill();

        stage.update();
    }

    mark(x=this.markedX) {
        if (!this.markerInitialized) {
            this.setMarkProperties();
        }

        const y = this.equation(x);

        this.markedCircle.x = x * this.scaleValueX;
        this.markedCircle.y = y;

        this.markedX = x;

        stage.update();
    }
}
