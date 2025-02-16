import { Arrow } from '../com/Arrow.js';
import { Text } from '../text/Text.js';

/**
 * Represents a coordinate system.
 * @extends createjs.Container
 */
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
        stage.addChild(this);
    }

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


addTicksAndLabels(direction, firstValue, lastValue, firstPos, lastPos, divisions, tickLength, font = "21px Arial", fontColor = "#444444", except = [], decimalPlaces = 1, decimalSeparator = ".") {
    let step = (lastPos - firstPos) / divisions;
    let valueStep = (lastValue - firstValue) / divisions;

    for (let i = 0; i <= divisions; i++) {
        let pos = firstPos + i * step;
        let value = firstValue + i * valueStep;
        let tick;
        
        // Wert runden und richtig formatieren
        let roundedValue = value.toFixed(decimalPlaces).replace(".", decimalSeparator);

        // Erstelle den Strich, unabhängig davon, ob der Index im 'except' Array ist
        switch (direction) {
            case "top":
                tick = new createjs.Shape();
                tick.graphics.setStrokeStyle(this.thickness).beginStroke(this.color).moveTo(0, -pos).lineTo(-tickLength, -pos);
                break;
            case "bottom":
                tick = new createjs.Shape();
                tick.graphics.setStrokeStyle(this.thickness).beginStroke(this.color).moveTo(0, pos).lineTo(-tickLength, pos);
                break;
            case "left":
                tick = new createjs.Shape();
                tick.graphics.setStrokeStyle(this.thickness).beginStroke(this.color).moveTo(-pos, 0).lineTo(-pos, tickLength);
                break;
            case "right":
                tick = new createjs.Shape();
                tick.graphics.setStrokeStyle(this.thickness).beginStroke(this.color).moveTo(pos, 0).lineTo(pos, tickLength);
                break;
        }

        // Prüfen, ob der Index in der 'except' Liste enthalten ist
        if (except.includes(i)) {
            this.addChild(tick); // Nur den Strich hinzufügen, keine Beschriftung
            continue;
        }

        // Beschriftung erstellen
        let label = new createjs.Text(roundedValue, font, fontColor);
        switch (direction) {
            case "top":
                label.x = -tickLength - label.getMeasuredWidth() - 5;
                label.y = -pos - label.getMeasuredHeight()/2;
                break;
            case "bottom":
                label.x = -tickLength - label.getMeasuredWidth() - 5;
                label.y = -pos - label.getMeasuredHeight()/2;
                break;
            case "left":
                label.x = -pos - label.getMeasuredWidth() / 2;
                label.y = label.getMeasuredHeight()-5;
                break;
            case "right":
                label.x = pos - label.getMeasuredWidth() / 2;
                label.y = label.getMeasuredHeight()-5;
                break;
        }

        this.addChild(tick);
        this.addChild(label);
    }
}


}
