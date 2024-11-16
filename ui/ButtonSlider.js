// ButtonSlider-Klasse mit Strichklick-Funktionalität
export class ButtonSlider extends createjs.Container {
    /**
     * Creates an instance of ButtonSlider.
     * @param {number} size Die Größe des Schiebereglers.
     * @param {number} width Die Breite des Schiebereglers.
     * @param {number} height Die Höhe des Schiebereglers.
     * @param {number} minValue Der minimale Wert des Schiebereglers.
     * @param {number} maxValue Der maximale Wert des Schiebereglers.
     * @param {number} defaultValue Der Standardwert des Schiebereglers.
     * @param {string} [orientation='horizontal'] Die Ausrichtung des Schiebereglers (horizontal oder vertikal).
     * 
     * @example
     * const slider = new ButtonSlider(100, 200, 20, 0, 100, 50, "horizontal");
     * // Fügen Sie einen Event-Listener hinzu, um Änderungen des Schiebereglers zu behandeln
     * slider.addEventListener("change", function() {
     *     // Hier können Sie Ihre Reaktion auf Schieberegleränderungen definieren
     *     console.log("Schiebereglerwert geändert:", slider.value);
     * });
     */
    constructor(size, width, height, minValue, maxValue, defaultValue, orientation, backgroundColor="rgba(255, 255, 255, 1)") {
        super();
        
        this.size = size;
        this.width = width;
        this.height = height;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.value = defaultValue;
		this.backgroundColor = backgroundColor;
        this.orientation = orientation || "horizontal";

        this.line = new createjs.Shape();
        this.drawline("#555555");

        this.thumb = new createjs.Shape();
        this.drawThumb("#999999");

        this.container = new createjs.Container();

        this.drawBackground();
		
        this.container.addChild(this.line, this.thumb);

        this.thumb.addEventListener("mousedown", this.onThumbMouseDown.bind(this));
        this.thumb.addEventListener("pressmove", this.onThumbPressMove.bind(this));
        this.thumb.addEventListener("mouseover", this.onThumbMouseOver.bind(this));
        this.thumb.addEventListener("mouseout", this.onThumbMouseOut.bind(this));

        this.addChild(this.container);
        stage.addChild(this);
        stage.enableMouseOver();
        stage.update();
    }

drawBackground() {
    this.stripClickArea = new createjs.Shape();
    this.drawStripClickArea();

    this.container.addChild(this.stripClickArea);

    this.stripClickArea.addEventListener("mousedown", function (event) {
        this.handleStripClick(event);
    }.bind(this));
}

drawStripClickArea() {
    // Vergrößern des Klickbereichs um 20 Pixel an jedem Ende des Reglerstrichs
    var extendedSize = this.size + 40;
    if (this.orientation === "horizontal") {
        this.stripClickArea.graphics.clear().beginFill(this.backgroundColor).drawRect(-20, -this.height / 2, extendedSize, this.height);
    } else if (this.orientation === "vertical") {
        this.stripClickArea.graphics.clear().beginFill(this.backgroundColor).drawRect(-this.width / 2, -20, this.width, extendedSize);
    }
    //this.stripClickArea.alpha = 0.1; 
}

// Methode zur Behandlung von Strichklick-Ereignissen
handleStripClick(event) {
    var point = this.container.globalToLocal(event.stageX, event.stageY);

    if (this.orientation === "horizontal") {
        // Überprüfen, ob der Klick innerhalb des tatsächlichen Reglerstrichs liegt
        if (point.x >= 0 && point.x <= this.size) {
            var percentage = point.x / this.size;
            this.setValue(this.minValue + percentage * (this.maxValue - this.minValue));
        } else {
            // Klick außerhalb des Reglerstrichs - springe zum minimalen oder maximalen Wert
            if (point.x < 0) {
                this.setValue(this.minValue);
            } else {
                this.setValue(this.maxValue);
            }
        }
    } else if (this.orientation === "vertical") {
        // Überprüfen, ob der Klick innerhalb des tatsächlichen Reglerstrichs liegt
        if (point.y >= 0 && point.y <= this.size) {
            // Korrigiertes Verhalten für die y-Achse
            var percentage = 1 - (point.y / this.size);
            this.setValue(this.minValue + percentage * (this.maxValue - this.minValue));
        } else {
            // Klick außerhalb des Reglerstrichs - springe zum minimalen oder maximalen Wert
            if (point.y < 0) {
                this.setValue(this.maxValue);  // Korrigiert für nach unten wachsendes Koordinatensystem
            } else {
                this.setValue(this.minValue);  // Korrigiert für nach unten wachsendes Koordinatensystem
            }
        }
    }
}	
					
					

    /**
     * Handles the mouse down event on the thumb.
     * @param {object} event The mouse down event object.
     * @private
     */
    onThumbMouseDown(event) {
        const point = this.container.globalToLocal(event.stageX, event.stageY);
        this.offset = { x: this.thumb.x - point.x, y: this.thumb.y - point.y };
    }

    /**
     * Handles the press move event on the thumb.
     * @param {object} event The press move event object.
     * @private
     */
    onThumbPressMove(event) {
        const point = this.container.globalToLocal(event.stageX, event.stageY);
        let newX, newY;
        
        if (this.orientation === "horizontal") {
            newX = Math.max(0, Math.min(point.x + this.offset.x, this.size));
            this.setValue(this.minValue + (newX / this.size) * (this.maxValue - this.minValue));
        } else if (this.orientation === "vertical") {
            newY = Math.max(0, Math.min(point.y + this.offset.y, this.size));
            this.setValue(this.maxValue - (newY / this.size) * (this.maxValue - this.minValue));
        }
    }

    /**
     * Handles the mouse over event on the thumb.
     * @private
     */
    onThumbMouseOver(event) {
        this.drawThumb("#228B22");
    }

    /**
     * Handles the mouse out event on the thumb.
     * @private
     */
    onThumbMouseOut(event) {
        this.drawThumb("#999999");
    }

    /**
     * Draws the thumb of the slider.
     * @param {string} strokeColor The color of the thumb stroke.
     * @private
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
     * @private
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
		
		stage.update();
    }

    /**
     * Draws the vertical thumb of the slider.
     * @param {string} strokeColor The color of the thumb stroke.
     * @private
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
		
		stage.update();
    }

    /**
     * Calculates the horizontal position of the thumb.
     * @returns {number} The horizontal position of the thumb.
     * @private
     */
    getThumbPositionX() {
        return (this.value - this.minValue) / (this.maxValue - this.minValue) * this.size;
    }

    /**
     * Calculates the vertical position of the thumb.
     * @returns {number} The vertical position of the thumb.
     * @private
     */
    getThumbPositionY() {
        return (this.maxValue - this.value) / (this.maxValue - this.minValue) * this.size;
    }

    /**
     * Draws the line of the slider.
     * @param {string} fillColor The color of the line fill.
     * @private
     */
    drawline(fillColor) {
        if (this.orientation === "vertical") {
            this.drawlineVertical(fillColor);
        } else {
            this.drawlineHorizontal(fillColor);
        }
    }

    /**
     * Draws the horizontal line of the slider.
     * @param {string} fillColor The color of the line fill.
     * @private
     */
    drawlineHorizontal(fillColor) {
        this.line.graphics.clear().beginFill(fillColor).drawRect(0,0, this.size, 1).endFill();
    }

    /**
     * Draws the vertical line of the slider.
     * @param {string} fillColor The color of the line fill.
     * @private
     */
    drawlineVertical(fillColor) {
        this.line.graphics.clear().beginFill(fillColor).drawRect(0,0, 1, this.size).endFill();
    }

    /**
     * Sets the value of the slider.
     * @param {number} value The value to set.
     * @private
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
	
	dispatchChangeEvent() {
    this.dispatchEvent("change");
}
}
