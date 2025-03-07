import { Line } from '../com/Line.js'; 

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

        this.curve = new createjs.Shape();
        this.curve.graphics.setStrokeStyle(this.thickness);
        this.addChild(this.curve);

        this.markedCircle = new createjs.Shape();
        this.markedCircle.graphics.setStrokeStyle(5);
        this.addChild(this.markedCircle);

        this.vGuideLine = new Line(0, 0, 0, 0, color, thickness);
        this.addChild(this.vGuideLine);

        this.hGuideLine = new Line(0, 0, 0, 0, color, thickness); 
        this.addChild(this.hGuideLine); 

        this.drawCurve();
        stage.addChild(this); 
    }

    drawCurve() {
        this.curve.graphics.clear();
        this.curve.graphics.beginStroke(this.color);
        this.curve.graphics.setStrokeStyle(this.thickness);

        for (let x = this.startX; x <= this.endX; x += this.step) {
            const y = this.equation(x);
            if (x === this.startX) {
                this.curve.graphics.moveTo(x * this.scaleValueX, y);
            } else {
                this.curve.graphics.lineTo(x * this.scaleValueX, y);
            }
        }

        this.curve.graphics.endStroke();
        stage.update();
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

    getValue(x) {
        return this.equation(x);
    }

    getValueByPercentage(percent) {
        const clampedPercent = Math.max(0, Math.min(100, percent));
        const x = this.startX + (clampedPercent / 100) * (this.endX - this.startX);
        return this.getValue(x);
    }

    drawMarker(value = this.markedX, isPercentage = false, withLines = true) {
        if (!this.markerInitialized) {
            this.setMarkProperties();
        }

        this.markedX = isPercentage ? this.startX + (Math.max(0, Math.min(100, value)) / 100) * (this.endX - this.startX) : value;
        const markedY = this.equation(this.markedX);
        const startX = this.markedX;
        const startY = 0;
        const endX = this.markedX;
        const endY = markedY;

        this.markedCircle.x = this.markedX * this.scaleValueX;
        this.markedCircle.y = markedY;

        if (withLines) {
            this.vGuideLine.setStartEnd(startX, startY, endX, endY);
            this.hGuideLine.setStartEnd(0, endY, endX, endY);
        }
    }
	
	
    updateEquation(newEquation) {
        this.equation = newEquation;
        this.drawCurve();
        this.drawMarker(this.markedX); 
    }
}
