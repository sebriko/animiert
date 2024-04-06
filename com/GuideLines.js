import { Line } from './Line.js'; 

export class GuideLines extends createjs.Container {
    constructor(originX, originY, color = createjs.Graphics.getRGB(255, 0, 0), equation, currentValue, thickness = 1, radius = 2) {
        super();
        this.originX = originX;
        this.originY = originY;
        this.color = color;
        this.equation = equation;
        this.currentValue = currentValue;
        this.thickness = thickness;
        this.radius = radius;

        this.line = new Line(0, 0, 0, 0, color, thickness); // Create a Line object
        this.addChild(this.line); // Add the line to the container

        this.drawGuidlines(); // Draw the initial line
    }

    drawGuidlines() {
        const currentResult = this.equation(this.currentValue); // Calculate the result of the equation
        const startX = this.currentValue;
        const startY = 0;
        const endX = this.currentValue;
        const endY = currentResult;



        // Update the coordinates of the line
        this.line.setStartEnd(startX, startY, endX, endY);
    }

    setNewValue(newCurrentValue) {
        this.currentValue = newCurrentValue;
        this.drawGuidlines(); // Redraw the line with the new value
    }
}
