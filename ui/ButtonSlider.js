/**
 * Represents a button slider control.
 * @extends {createjs.Container}
 */
export class ButtonSlider extends createjs.Container {
    /**
     * Creates an instance of ButtonSlider.
     * @param {number} size The size of the slider.
     * @param {number} width The width of the slider.
     * @param {number} height The height of the slider.
     * @param {number} minValue The minimum value of the slider.
     * @param {number} maxValue The maximum value of the slider.
     * @param {number} defaultValue The default value of the slider.
     * @param {string} [orientation='horizontal'] The orientation of the slider (horizontal or vertical).
     * 
     * @example
     * const slider = new ButtonSlider(100, 200, 20, 0, 100, 50, "Arial", 14, "horizontal");
     * // Add an event listener to handle slider value changes
     * slider.addEventListener("change", function() {
     *     // Here you can define your reaction to slider changes
     *     console.log("Slider value changed:", slider.value);
     * });
     */
    constructor(size, width, height, minValue, maxValue, defaultValue, orientation) {
        super();
        this.size = size;
        this.width = width;
        this.height = height;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.value = defaultValue;
        this.orientation = orientation || "horizontal";

        this.background = new createjs.Shape();
        this.drawBackground("#555555");

        this.thumb = new createjs.Shape();
        this.drawThumb("#999999");

        this.container = new createjs.Container();
        this.container.addChild(this.background, this.thumb);

        this.thumb.addEventListener("mouseover", this.onThumbMouseOver.bind(this));
        this.thumb.addEventListener("mouseout", this.onThumbMouseOut.bind(this));
        this.thumb.addEventListener("mousedown", this.onThumbMouseDown.bind(this));
        this.thumb.addEventListener("pressmove", this.onThumbPressMove.bind(this));
		
		this.addChild(this.container);
		stage.addChild(this);
		stage.enableMouseOver();
    }

    /**
     * Handles the mouse down event on the thumb.
     * @param {object} event The mouse down event object.
     */
    onThumbMouseDown(event) {
		
        const point = this.container.globalToLocal(event.stageX, event.stageY);
        this.offset = { x: this.thumb.x - point.x, y: this.thumb.y - point.y };
    }

    /**
     * Handles the press move event on the thumb.
     * @param {object} event The press move event object.
     */
    onThumbPressMove(event) {
	
        const point = this.container.globalToLocal(event.stageX, event.stageY);
        let newX, newY;
        
        if (this.orientation === "horizontal") {
            newX = Math.max(0, Math.min(point.x + this.offset.x, this.size));
            this.setValue(this.minValue + (newX / this.size) * (this.maxValue - this.minValue));
        } else if (this.orientation === "vertical") {
            newY = Math.max(0, Math.min(point.y + this.offset.y, this.size));
            this.setValue(this.minValue + (newY / this.size) * (this.maxValue - this.minValue));
        }
    }

    /**
     * Handles the mouse over event on the thumb.
     */
    onThumbMouseOver(event) {
        this.drawThumb("#228B22");
    }

    /**
     * Handles the mouse out event on the thumb.
     */
    onThumbMouseOut(event) {
        this.drawThumb("#999999");
    }

    /**
     * Draws the thumb of the slider.
     * @param {string} strokeColor The color of the thumb stroke.
     */
    drawThumb(strokeColor) {
        if (this.orientation === "vertical") {
            this.drawThumbVertical(strokeColor);
        } else {
            this.drawThumbHorizontal(strokeColor);
        }
    }

    /**
     * Draws the horizontal thumb of the slider.
     * @param {string} strokeColor The color of the thumb stroke.
     */
    drawThumbHorizontal(strokeColor) {
        const thumbWidth = this.height;
        const thumbHeight = this.width;
        const borderRadius = 2;

        this.thumb.graphics.clear().beginLinearGradientFill(["rgba(250, 250, 250, 0.5)", "rgba(204, 204, 204, 0.3)"], [0, 1], 0, 0, thumbWidth, 0)
            .setStrokeStyle(0.5, "round").beginStroke(strokeColor)
            .drawRoundRect(-thumbWidth/2, -thumbHeight/2, thumbWidth, thumbHeight, borderRadius)
            .setStrokeStyle(0.5, "round").beginStroke("rgba(20, 20, 20, 0.9)")
            .moveTo(0, -thumbHeight/2).lineTo(0, thumbHeight/2).endFill();

        this.thumb.setBounds(0, 0, thumbWidth, thumbHeight);
        this.thumb.x = this.getThumbPositionX();
        this.thumb.y = 0;
    }

    /**
     * Draws the vertical thumb of the slider.
     * @param {string} strokeColor The color of the thumb stroke.
     */
    drawThumbVertical(strokeColor) {
        const thumbWidth = this.width;
        const thumbHeight = this.height;
        const borderRadius = 2;

        this.thumb.graphics.clear().beginLinearGradientFill(["rgba(250, 250, 250, 0.5)", "rgba(204, 204, 204, 0.3)"], [0, 1], 0, 0, 0, thumbHeight)
            .setStrokeStyle(0.5, "round").beginStroke(strokeColor)
            .drawRoundRect(-thumbWidth/2, -thumbHeight/2, thumbWidth, thumbHeight, borderRadius)
            .setStrokeStyle(0.5, "round").beginStroke("rgba(20, 20, 20, 0.9)")
            .moveTo(-thumbWidth/2, 0).lineTo(thumbWidth/2, 0).endFill();

        this.thumb.setBounds(0, 0, thumbWidth, thumbHeight);
        this.thumb.x = 0;
        this.thumb.y = this.getThumbPositionY();
    }

    /**
     * Calculates the horizontal position of the thumb.
     * @returns {number} The horizontal position of the thumb.
     */
    getThumbPositionX() {
        return (this.value - this.minValue) / (this.maxValue - this.minValue) * this.size;
    }

    /**
     * Calculates the vertical position of the thumb.
     * @returns {number} The vertical position of the thumb.
     */
    getThumbPositionY() {
        return (this.value - this.minValue) / (this.maxValue - this.minValue) * this.size;
    }

    /**
     * Draws the background of the slider.
     * @param {string} fillColor The color of the background fill.
     */
    drawBackground(fillColor) {
        if (this.orientation === "vertical") {
            this.drawBackgroundVertical(fillColor);
        } else {
            this.drawBackgroundHorizontal(fillColor);
        }
    }

    /**
     * Draws the horizontal background of the slider.
     * @param {string} fillColor The color of the background fill.
     */
    drawBackgroundHorizontal(fillColor) {
        this.background.graphics.clear().beginFill(fillColor).drawRect(0,0, this.size, 1).endFill();
    }

    /**
     * Draws the vertical background of the slider.
     * @param {string} fillColor The color of the background fill.
     */
    drawBackgroundVertical(fillColor) {
        this.background.graphics.clear().beginFill(fillColor).drawRect(0,0, 1, this.size).endFill();
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
    }
	
	dispatchChangeEvent() {
    this.dispatchEvent("change");
}
}
