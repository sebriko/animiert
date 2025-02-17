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


addTicksAndLabels(
    direction, firstValue, lastValue, firstPos, lastPos, divisions,
    tickLength, font = "21px Arial", fontColor = "#444444",
    except = [], readingdirection = true, decimalPlaces = 1, decimalSeparator = "."
) {
    let step = (lastPos - firstPos) / divisions;
    let valueStep = (lastValue - firstValue) / divisions;

    for (let i = 0; i <= divisions; i++) {
        let pos = firstPos + i * step;
        let value = firstValue + i * valueStep;
        let roundedValue = value.toFixed(decimalPlaces).replace(".", decimalSeparator);
        let tick = new createjs.Shape();
        let tickStart, tickEnd;

        switch (direction) {
            case "top":
                tickStart = [0, -pos];
                tickEnd = readingdirection ? [-tickLength, -pos] : [tickLength, -pos];
                break;
            case "bottom":
                tickStart = [0, pos];
                tickEnd = readingdirection ? [-tickLength, pos] : [tickLength, pos];
                break;
            case "left":
                tickStart = [-pos, 0];
                tickEnd = readingdirection ? [-pos, tickLength] : [-pos, -tickLength];
                break;
            case "right":
                tickStart = [pos, 0];
                tickEnd = readingdirection ? [pos, tickLength] : [pos, -tickLength];
                break;
        }

        tick.graphics.setStrokeStyle(this.thickness).beginStroke(this.color)
            .moveTo(...tickStart).lineTo(...tickEnd);
        
        if (except.includes(i)) {
            this.addChild(tick);
            continue;
        }

        let label = new createjs.Text(roundedValue, font, fontColor);
        let labelX, labelY;

        switch (direction) {
            case "top":
            case "bottom":
                labelX = readingdirection ? -tickLength - label.getMeasuredWidth() - 5 : tickLength + 5;
                labelY = pos * (direction === "top" ? -1 : 1) - label.getMeasuredHeight() / 2;
                break;
            case "left":
            case "right":
                labelX = pos * (direction === "left" ? -1 : 1) - label.getMeasuredWidth() / 2;
                labelY = readingdirection ? 7 : -label.getMeasuredHeight() - 7;
                break;
        }

        label.x = labelX;
        label.y = labelY;

        this.addChild(tick);
        this.addChild(label);
    }
}



}
