/**
 * Represents a progress slider control.
 * @extends {createjs.Container}
 */
export class ProgressSlider extends createjs.Container {
    /**
     * Creates an instance of ProgressSlider.
     * @param {number} size The size of the slider.
     * @param {number} buttonSize The size of the slider button.
     * @param {number} minValue The minimum value of the slider.
     * @param {number} maxValue The maximum value of the slider.
     * @param {number} defaultValue The default value of the slider.
     * @param {string} font The font of the slider.
     * @param {number} fontSize The font size of the slider.
     * @param {string} [orientation='horizontal'] The orientation of the slider (horizontal or vertical).
     */
    constructor(size, buttonSize, minValue, maxValue, defaultValue, font, fontSize, orientation) {
        super();
        this.size = size;
        this.buttonSize = buttonSize;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.value = defaultValue;
        this.font = font;
        this.fontSize = fontSize;
        this.orientation = orientation || "horizontal";

        this.line = new createjs.Shape();
        this.drawline("#555555");

        this.thumb = new createjs.Shape();
        this.drawThumb(0);

        this.setValue(defaultValue);

        this.container = new createjs.Container();
        this.container.addChild(this.line, this.thumb);

        this.thumb.addEventListener("mouseover", this.handleThumbMouseOver.bind(this));
        this.thumb.addEventListener("mouseout", this.handleThumbMouseOut.bind(this));
        this.thumb.addEventListener("mousedown", this.handleThumbMouseDown.bind(this));
        this.thumb.addEventListener("pressmove", this.handleThumbPressMove.bind(this));

        stage.addChild(this.container);
		stage.enableMouseOver();
    }

    /**
     * Draws the line of the slider.
     * @param {string} fillColor The color of the line fill.
     * @private
     */
    drawline(fillColor) {
        this.line.graphics.clear();
        if (this.orientation === "horizontal") {
			this.line.graphics.clear().beginFill(fillColor).drawRect(0,0, this.size, 1).endFill();
        } else if (this.orientation === "vertical") {
			this.line.graphics.clear().beginFill(fillColor).drawRect(0,0, 1, this.size).endFill();
        }
        this.line.graphics.endFill();
    }

    /**
     * Draws the thumb of the slider.
     * @param {number} state The state of the thumb (0 for normal, 1 for hover).
     * @private
     */
	drawThumb(state) {
		this.thumb.graphics.clear();
		if (state === 0) {
			this.thumb.graphics.setStrokeStyle(0.5).beginStroke("#AAAAAA");
			this.thumb.graphics.beginLinearGradientFill(["#EFEFEF ", "#DDDDDD"], [0, 1], 0, 0, 0, this.buttonSize);
		} else if (state === 1) {
			this.thumb.graphics.setStrokeStyle(0.5).beginStroke("#228B22");
			this.thumb.graphics.beginLinearGradientFill(["#EFEFEF", "#EEEEEE"], [0, 1], 0, 0, 0, this.buttonSize);
		}

		const radius = this.buttonSize / 2;
		const triangleSize = this.buttonSize;
		let x1, y1, x2, y2, x3, y3;

		if (this.orientation === "horizontal") {
			x1 = radius - 7.5;
			y1 = 0;
			x2 = -7.5;
			y2 = triangleSize;
			x3 = triangleSize - 7.5;
			y3 = triangleSize;
		} else if (this.orientation === "vertical") {
			x1 = 0;
			y1 = radius - 7.5;
			x2 = -triangleSize;
			y2 = -7.5;
			x3 = -triangleSize;
			y3 = radius * 2 - 7.5;
		}

		// Abrundung der Ecken hinzufügen
		this.thumb.graphics.moveTo(x1, y1);
		this.thumb.graphics.arcTo(x1 + 10, y1, x2, y2, 5);  // Abrundung
		this.thumb.graphics.arcTo(x2 + 10, y2, x3, y3, 5);  // Abrundung
		this.thumb.graphics.arcTo(x3 + 10, y3, x1, y1, 5);  // Abrundung

		this.thumb.graphics.endFill();
		this.thumb.setBounds(0, 0, triangleSize, triangleSize);
		this.thumb.x = (this.orientation === "horizontal") ? this.getThumbPositionX() : 0;
		this.thumb.y = (this.orientation === "vertical") ? this.getThumbPositionY() : 0;
		
		stage.update();
	}

    /**
     * Sets the value of the slider.
     * @param {number} value The value to set.
     */
    setValue(value) {
        this.value = Math.max(this.minValue, Math.min(value, this.maxValue));
        if (this.orientation === "horizontal") {
            this.thumb.x = this.getThumbPositionX();
        } else if (this.orientation === "vertical") {
            this.thumb.y = this.getThumbPositionY();
        }
		
		this.dispatchChangeEvent();
		stage.update();
    }

    /**
     * Calculates the horizontal position of the thumb.
     * @returns {number} The horizontal position of the thumb.
     * @private
     */
    getThumbPositionX() {
        const percentage = (this.value - this.minValue) / (this.maxValue - this.minValue);
        return percentage * (this.size);
    }

    /**
     * Calculates the vertical position of the thumb.
     * @returns {number} The vertical position of the thumb.
     * @private
     */
    getThumbPositionY() {
        const percentage = (this.value - this.minValue) / (this.maxValue - this.minValue);
        return percentage * (this.size);
    }

    /**
     * Handles the mouse over event on the thumb.
     * @private
     */
    handleThumbMouseOver(event) {
        this.drawThumb(1);
    }

    /**
     * Handles the mouse out event on the thumb.
     * @private
     */
    handleThumbMouseOut(event) {
        this.drawThumb(0);
    }

    /**
     * Handles the mouse down event on the thumb.
     * @param {object} event The mouse down event object.
     * @private
     */
    handleThumbMouseDown(event) {
        const point = this.container.globalToLocal(event.stageX, event.stageY);
        this.offset = { x: this.thumb.x - point.x, y: this.thumb.y - point.y };
    }

    /**
     * Handles the press move event on the thumb.
     * @param {object} event The press move event object.
     * @private
     */
    handleThumbPressMove(event) {
        const point = this.container.globalToLocal(event.stageX, event.stageY);
        let newX, newY, percentage, currentAngle;

        if (this.orientation === "horizontal") {
            newX = point.x + this.offset.x;
            newX = Math.max(0, Math.min(newX, this.size));
            percentage = newX / this.size;
            this.setValue(this.minValue + percentage * (this.maxValue - this.minValue));
        } else if (this.orientation === "vertical") {
            newY = point.y + this.offset.y;
            newY = Math.max(0, Math.min(newY, this.size));
            percentage = newY / this.size;
            this.setValue(this.minValue + percentage * (this.maxValue - this.minValue));
        }

        stage.update();
    }
	
		dispatchChangeEvent() {
    this.dispatchEvent("change");
}
}
