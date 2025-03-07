/**
 * A numeric stepper control with editable text field and increment/decrement buttons.
 * Supports auto-increment/decrement when holding the buttons.
 * @class
 * @extends createjs.Container
 */
export class NumericStepper extends createjs.Container {
    /**
     * Creates a new NumericStepper instance.
     * @param {number} numericValue - The initial numeric value
     * @param {string} styles - The text styles (font family, size, etc.)
     * @param {string} color - The text color
     * @param {number} width - The width of the control
     * @param {number} [stepValue=1] - The amount to increment/decrement by
     * @param {number} [maxLength=Infinity] - Maximum number of characters allowed
     * @param {number} [minValue=-Infinity] - Minimum allowed value
     * @param {number} [maxValue=Infinity] - Maximum allowed value
     */
    constructor(numericValue, styles, color, width, stepValue = 1, maxLength = Infinity, minValue = -Infinity, maxValue = Infinity) {
        super();

        const self = this;
        
        this.numericValue = numericValue;
        this.color = color;
        this.width = width;
        this.styles = styles;
        this.padding = 9;
        this.maxLength = maxLength;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.cursorIndex = String(numericValue).length;
        this.decimalPlaces = 0;
        this.shiftPressed = false;
        this.selectionStart = -1;
        this.selectionEnd = -1;
        this.stepValue = stepValue;
        
        // Auto-increment/decrement properties
        this.autoIncreaseInterval = null;
        this.autoDecreaseInterval = null;
        this.initialDelay = 500; // Delay before auto-increment starts (in ms)
        this.repeatInterval = 100; // Interval between repetitions (in ms)

        this.textObj = new createjs.Text("", this.styles, this.color);
        const textHeight = this.textObj.getMeasuredHeight();

        this.drawBackgroundAndBorder();
        this.drawText();
        this.drawCursor();

        this.selectionRect = new createjs.Shape();
        this.addChild(this.selectionRect);

        this.whiteText = new createjs.Text("", this.styles, "#FFFFFF");
        this.addChild(this.whiteText);

        this.increaseButton = new createjs.Shape();
        this.decreaseButton = new createjs.Shape();

        this.addChild(this.increaseButton);
        this.addChild(this.decreaseButton);

        this.addButtons();
        this.addButtonListeners(this);
        this.addMouseListeners(this);

        stage.addChild(this);
        
        stage.enableMouseOver();
        stage.update();

        document.addEventListener("keydown", function(event) {
            self.shiftPressed = event.shiftKey;

            if (event.keyCode === 37) { // Left arrow
                if (self.cursorIndex > 0) {
                    self.cursorIndex--;
                }

                if (self.shiftPressed) {
                    self.selectionEnd = self.cursorIndex;
                    if (self.selectionStart === -1) {
                        self.selectionStart = self.selectionEnd + 1;
                    }
                }
            } else if (event.keyCode === 39) { // Right arrow
                if (self.cursorIndex < self.textObj.text.length) {
                    self.cursorIndex++;
                }

                if (self.shiftPressed) {
                    self.selectionEnd = self.cursorIndex;
                    if (self.selectionStart === -1) {
                        self.selectionStart = self.selectionEnd - 1;
                    }
                }
            }

            if ((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode === 190 || event.keyCode === 188) {
                const tempTextWidth = self.getWidthUpToIndex(self.cursorIndex + 1);
                if (tempTextWidth <= self.width && self.textObj.text.length < self.maxLength) {
                    self.textObj.text = self.textObj.text.slice(0, self.cursorIndex) + event.key + self.textObj.text.slice(self.cursorIndex);
                    self.cursorIndex++;
                }
            }

            if (event.keyCode === 8 || event.keyCode === 46) { // Backspace or Delete
                if (self.selectionStart !== -1 && self.selectionEnd !== -1 && self.selectionStart !== self.selectionEnd) {
                    const start = Math.min(self.selectionStart, self.selectionEnd);
                    const end = Math.max(self.selectionStart, self.selectionEnd);
                    self.textObj.text = self.textObj.text.slice(0, start) + self.textObj.text.slice(end);
                    self.cursorIndex = start;
                } else if (event.keyCode === 8) { // Backspace
                    if (self.cursorIndex > 0) {
                        self.textObj.text = self.textObj.text.slice(0, self.cursorIndex - 1) + self.textObj.text.slice(self.cursorIndex);
                        self.cursorIndex--;
                    }
                } else if (event.keyCode === 46) { // Delete
                    if (self.cursorIndex < self.textObj.text.length) {
                        self.textObj.text = self.textObj.text.slice(0, self.cursorIndex) + self.textObj.text.slice(self.cursorIndex + 1);
                    }
                }

                self.selectionStart = -1;
                self.selectionEnd = -1;
                self.selectionRect.graphics.clear();
                self.whiteText.text = "";
                self.updateCursor();
                self.updateSelectionRect();
                stage.update();
            }

            if (!self.shiftPressed) {
                self.selectionStart = -1;
                self.selectionEnd = -1;
                self.selectionRect.graphics.clear();
                self.whiteText.text = "";
                self.updateCursor();
            }

            self.updateSelectionRect();
            stage.update();

            if (event.keyCode === 13) { // Return
                self.numericValue = parseFloat(self.textObj.text);
                self.dispatchChangeEvent();
            }
        });
    }

    /**
     * Creates and adds the text object to display the current value
     * @private
     */
    drawText() {
        this.textObj = new createjs.Text(String(this.numericValue), this.styles, this.color);
        this.textObj.x = 0;
        this.textObj.y = 0;
        this.addChild(this.textObj);
    }

    /**
     * Creates and adds the background and border for the control
     * @private
     */
    drawBackgroundAndBorder() {
        this.backgroundRect = new createjs.Shape();
        this.backgroundRect.graphics.setStrokeStyle(0.5);
        this.backgroundRect.graphics.beginStroke("#CCCCCC");
        this.backgroundRect.graphics.beginFill("#FFFFFF"); 
        this.backgroundRect.graphics.drawRect(-this.padding / 2, -this.padding / 2, this.width, this.textObj.getMeasuredHeight() + this.padding);
        this.addChild(this.backgroundRect);
    }

    /**
     * Creates and adds the cursor object
     * @private
     */
    drawCursor() {
        this.cursorObj = new createjs.Shape();
        this.cursorObj.graphics.beginFill("#000").drawRect(0, 0, 1, this.textObj.getMeasuredHeight());
        this.updateCursor();
        this.addChild(this.cursorObj);
    }

    /**
     * Updates the cursor position based on the current cursor index
     * @private
     */
    updateCursor() {
        const cursorPositionText = this.textObj.text.slice(0, this.cursorIndex);
        const cursorWidth = new createjs.Text(cursorPositionText, this.styles, this.color).getMeasuredWidth();
        this.cursorObj.x = cursorWidth;
    }

    /**
     * Updates the text selection rectangle and highlighted text
     * @private
     */
    updateSelectionRect() {
        this.selectionRect.graphics.clear();
        this.whiteText.text = "";

        if (this.selectionStart !== -1 && this.selectionEnd !== -1 && this.selectionStart !== this.selectionEnd) {
            const start = Math.min(this.selectionStart, this.selectionEnd);
            const end = Math.max(this.selectionStart, this.selectionEnd);

            const startX = this.getWidthUpToIndex(start);
            const endX = this.getWidthUpToIndex(end);
            const rectWidth = endX - startX;

            this.selectionRect.graphics.beginFill("#0000FF");
            this.selectionRect.graphics.drawRect(startX, 0, rectWidth, this.textObj.getMeasuredHeight());

            const selectedText = this.textObj.text.slice(start, end);
            this.whiteText = new createjs.Text(selectedText, this.styles, "#FFFFFF");
            this.whiteText.x = startX;
            this.whiteText.y = 0;

            this.addChild(this.whiteText);
        }
    }

    /**
     * Creates and adds the increment/decrement buttons
     * @private
     */
    addButtons() {
        this.drawButton(this.increaseButton, "#CCCCCC", 0, 0, 24, (this.textObj.getMeasuredHeight() + this.padding) / 2, "#444", true);
        this.drawButton(this.decreaseButton, "#CCCCCC", 0, 0, 24, (this.textObj.getMeasuredHeight() + this.padding) / 2, "#444", false);

        const buttonX = this.width - this.padding / 2;
        const increaseButtonY = -this.padding / 2;
        const decreaseButtonY = (this.textObj.getMeasuredHeight() + this.padding) / 2 - this.padding / 2;

        this.increaseButton.x = buttonX;
        this.increaseButton.y = increaseButtonY;
        this.decreaseButton.x = buttonX;
        this.decreaseButton.y = decreaseButtonY;
    }

    /**
     * Draws a button with specified styles and arrow direction
     * @param {createjs.Shape} button - The button shape object
     * @param {string} strokeColor - The border color
     * @param {number} x - The x position
     * @param {number} y - The y position
     * @param {number} width - The button width
     * @param {number} height - The button height
     * @param {string} fillColor - The triangle fill color
     * @param {boolean} isUpArrow - Whether to draw an up arrow (true) or down arrow (false)
     * @private
     */
    drawButton(button, strokeColor, x, y, width, height, fillColor, isUpArrow) {
        button.graphics.clear();
        button.graphics.setStrokeStyle(0.5);
        button.graphics.beginStroke(strokeColor);
        button.graphics.beginLinearGradientFill(["rgba(250, 250, 250, 0.5)", "rgba(204, 204, 204, 0.3)"], [0, 1], 0, 0, 0, height);
        button.graphics.drawRect(x, y, width, height);
        button.graphics.endStroke();

        button.graphics.beginFill(fillColor);
        const midX = width / 2;
        let baseY = 0;
        const triangleHeight = 4;

        if (isUpArrow) {
            baseY = this.padding/3;
            button.graphics.moveTo(midX, baseY);
            button.graphics.lineTo(midX - 3, baseY+triangleHeight);
            button.graphics.lineTo(midX + 3, baseY+triangleHeight);
        } else {
            baseY = height - this.padding/3;
            button.graphics.moveTo(midX, baseY);
            button.graphics.lineTo(midX + 3, baseY - triangleHeight);
            button.graphics.lineTo(midX - 3, baseY - triangleHeight);
        }
        button.graphics.closePath();
    }

    /**
     * Adds event listeners to the increment/decrement buttons
     * @param {NumericStepper} self - Reference to the current instance
     * @private
     */
    addButtonListeners(self) {
        // Event listeners for button auto-increment/decrement
        self.increaseButton.addEventListener("mousedown", function(event) {
            // Immediate first increment
            self.increaseValue();
            
            // Continue after initial delay
            self.autoIncreaseInterval = setTimeout(function() {
                // After initial delay, continue at faster intervals
                self.autoIncreaseInterval = setInterval(function() {
                    self.increaseValue();
                }, self.repeatInterval);
            }, self.initialDelay);
        });

        self.decreaseButton.addEventListener("mousedown", function(event) {
            // Immediate first decrement
            self.decreaseValue();
            
            // Continue after initial delay
            self.autoDecreaseInterval = setTimeout(function() {
                // After initial delay, continue at faster intervals
                self.autoDecreaseInterval = setInterval(function() {
                    self.decreaseValue();
                }, self.repeatInterval);
            }, self.initialDelay);
        });

        // Add event listeners to stop auto-increment/decrement
        self.increaseButton.addEventListener("pressup", function() {
            self.stopAutoIncrease();
        });

        self.decreaseButton.addEventListener("pressup", function() {
            self.stopAutoDecrease();
        });

        // Mouse leaves the button
        self.increaseButton.addEventListener("mouseout", function() {
            self.stopAutoIncrease();
            self.onButtonMouseOut(self.increaseButton);
        });

        self.decreaseButton.addEventListener("mouseout", function() {
            self.stopAutoDecrease();
            self.onButtonMouseOut(self.decreaseButton);
        });

        // Mouse over the button
        self.increaseButton.addEventListener("mouseover", function() {
            self.onButtonMouseOver(self.increaseButton);
            document.body.style.cursor = "default";
        });

        self.decreaseButton.addEventListener("mouseover", function() {
            self.onButtonMouseOver(self.decreaseButton);
            document.body.style.cursor = "default";
        });
    }

    /**
     * Stops auto-increment process and clears intervals/timeouts
     * @private
     */
    stopAutoIncrease() {
        if (this.autoIncreaseInterval) {
            clearTimeout(this.autoIncreaseInterval);
            clearInterval(this.autoIncreaseInterval);
            this.autoIncreaseInterval = null;
        }
    }

    /**
     * Stops auto-decrement process and clears intervals/timeouts
     * @private
     */
    stopAutoDecrease() {
        if (this.autoDecreaseInterval) {
            clearTimeout(this.autoDecreaseInterval);
            clearInterval(this.autoDecreaseInterval);
            this.autoDecreaseInterval = null;
        }
    }

    /**
     * Adds mouse event listeners for text editing and selection
     * @param {NumericStepper} self - Reference to the current instance
     * @private
     */
    addMouseListeners(self) {
        this.addEventListener("click", function(event) {
            const localPoint = self.globalToLocal(event.stageX, event.stageY);
            self.cursorIndex = self.getCursorIndexFromX(localPoint.x);
            self.updateCursor();
            stage.update();
        });

        this.addEventListener("mousedown", function(event) {
            const localPoint = self.globalToLocal(event.stageX, event.stageY);
            const buttonX = self.increaseButton.x; 
            if (localPoint.x < buttonX) {
                self.selectionStart = self.getCursorIndexFromX(localPoint.x);
            }
        });

        this.addEventListener("pressmove", function(event) {
            const localPoint = self.globalToLocal(event.stageX, event.stageY);
            self.selectionEnd = self.getCursorIndexFromX(localPoint.x);
            self.updateSelectionRect();
            stage.update();
        });

        this.addEventListener("pressup", function(event) {
            const localPoint = self.globalToLocal(event.stageX, event.stageY);
            self.selectionEnd = self.getCursorIndexFromX(localPoint.x);
            self.updateSelectionRect();
            stage.update();
        });
        
        this.backgroundRect.addEventListener("mouseover", function() {
            document.body.style.cursor = "text";
        });

        this.selectionRect.addEventListener("mouseover", function() {
            document.body.style.cursor = "text";
        });

        this.textObj.addEventListener("mouseover", function() {
            document.body.style.cursor = "text";
        });

        this.whiteText.addEventListener("mouseover", function() {
            document.body.style.cursor = "text";
        });
        
        self.addEventListener("mouseout", function() {
            document.body.style.cursor = "default";
        });
    }

    /**
     * Increases the numeric value by the step amount
     * @public
     */
    increaseValue() {
        this.numericValue = Math.min(parseFloat(this.textObj.text) + this.stepValue, this.maxValue);
        this.textObj.text = String(this.numericValue);
        this.updateCursor();
        stage.update();
        this.dispatchChangeEvent();
    }

    /**
     * Decreases the numeric value by the step amount
     * @public
     */
    decreaseValue() {
        this.numericValue = Math.max(parseFloat(this.textObj.text) - this.stepValue, this.minValue);
        this.textObj.text = String(this.numericValue);
        this.updateCursor();
        stage.update();
        this.dispatchChangeEvent();
    }

    /**
     * Updates button appearance when mouse hovers over it
     * @param {createjs.Shape} button - The button to update
     * @private
     */
    onButtonMouseOver(button) {
        button.graphics.clear();
        this.drawButton(button, "#228B22", 0, 0, 24, (this.textObj.getMeasuredHeight() + this.padding) / 2, "#444", button === this.increaseButton);
        stage.update();
    }

    /**
     * Restores button appearance when mouse leaves it
     * @param {createjs.Shape} button - The button to update
     * @private
     */
    onButtonMouseOut(button) {
        button.graphics.clear();
        this.drawButton(button, "#CCCCCC", 0, 0, 24, (this.textObj.getMeasuredHeight() + this.padding) / 2, "#444", button === this.increaseButton);
        stage.update();
    }

    /**
     * Calculates text width up to a specified index
     * @param {number} index - The character index
     * @returns {number} The width in pixels
     * @private
     */
    getWidthUpToIndex(index) {
        const tempText = new createjs.Text(this.textObj.text.slice(0, index), this.styles, this.color);
        return tempText.getMeasuredWidth();
    }

    /**
     * Determines the character index at a given x-coordinate
     * @param {number} x - The x-coordinate
     * @returns {number} The character index
     * @private
     */
    getCursorIndexFromX(x) {
        const charWidths = [];
        for (let i = 0; i < this.textObj.text.length; i++) {
            charWidths[i] = this.getWidthUpToIndex(i + 1);
        }

        // Calculate half-width of each character to determine position
        for (let i = 0; i < charWidths.length; i++) {
            const halfCharWidth = (charWidths[i] - (i > 0 ? charWidths[i - 1] : 0)) / 2;
            const threshold = (i > 0 ? charWidths[i - 1] : 0) + halfCharWidth;

            if (x < threshold) {
                return i;
            }
        }

        return this.textObj.text.length;
    }

    /**
     * Dispatches a change event when the value changes
     * @private
     */
    dispatchChangeEvent() {
        const event = new createjs.Event("change", true, false);
        this.dispatchEvent(event);
    }
}