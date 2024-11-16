export class NumericStepper extends createjs.Container {
    constructor(numericValue, styles, color, width, stepValue = 1, maxLength = Infinity, minValue = -Infinity, maxValue = Infinity) {
        super();

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
        this.addButtonListeners();
        this.addMouseListeners();

        stage.addChild(this);
		
		stage.enableMouseOver();
        stage.update();

        const self = this;

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
                self.whiteText.text = ""; // Lösche den weißen Text
                self.updateCursor();
                self.updateSelectionRect();
                stage.update();
            }

            if (!self.shiftPressed) {
                self.selectionStart = -1;
                self.selectionEnd = -1;
                self.selectionRect.graphics.clear();
                self.whiteText.text = ""; // Lösche den weißen Text
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

    drawText() {
        this.textObj = new createjs.Text(String(this.numericValue), this.styles, this.color);
        this.textObj.x = 0;
        this.textObj.y = 0;
        this.addChild(this.textObj);
    }

    drawBackgroundAndBorder() {
        this.backgroundRect = new createjs.Shape();
        this.backgroundRect.graphics.setStrokeStyle(0.5);
        this.backgroundRect.graphics.beginStroke("#CCCCCC");
        this.backgroundRect.graphics.beginFill("#FFFFFF"); // Weiße Füllfarbe hinzufügen
        this.backgroundRect.graphics.drawRect(-this.padding / 2, -this.padding / 2, this.width, this.textObj.getMeasuredHeight() + this.padding);
        this.addChild(this.backgroundRect);
    }

    drawCursor() {
        this.cursorObj = new createjs.Shape();
        this.cursorObj.graphics.beginFill("#000").drawRect(0, 0, 1, this.textObj.getMeasuredHeight());
        this.updateCursor();
        this.addChild(this.cursorObj);
    }

    updateCursor() {
        const cursorPositionText = this.textObj.text.slice(0, this.cursorIndex);
        const cursorWidth = new createjs.Text(cursorPositionText, this.styles, this.color).getMeasuredWidth();
        this.cursorObj.x = cursorWidth;
    }

    updateSelectionRect() {
        this.selectionRect.graphics.clear();
        this.whiteText.text = ""; // Lösche den weißen Text

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
console.log("Selection")
            this.addChild(this.whiteText);
        }
    }

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

    addButtonListeners() {
        const self = this;

        self.increaseButton.addEventListener("click", function() {
            self.increaseValue();
        });

        self.decreaseButton.addEventListener("click", function() {
            self.decreaseValue();
        });

        self.increaseButton.addEventListener("mouseover", function() {
            self.onButtonMouseOver(self.increaseButton);
        });

        self.increaseButton.addEventListener("mouseout", function() {
            self.onButtonMouseOut(self.increaseButton);
        });

        self.decreaseButton.addEventListener("mouseover", function() {
            self.onButtonMouseOver(self.decreaseButton);
        });

        self.decreaseButton.addEventListener("mouseout", function() {
            self.onButtonMouseOut(self.decreaseButton);
        });
    }

    addMouseListeners() {
        const self = this;

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
    }

    increaseValue() {
        this.numericValue = Math.min(parseFloat(this.textObj.text) + this.stepValue, this.maxValue);
        this.textObj.text = String(this.numericValue);
        this.updateCursor();
        stage.update();
        this.dispatchChangeEvent();
    }

    decreaseValue() {
        this.numericValue = Math.max(parseFloat(this.textObj.text) - this.stepValue, this.minValue);
        this.textObj.text = String(this.numericValue);
        this.updateCursor();
        stage.update();
        this.dispatchChangeEvent();
    }

    onButtonMouseOver(button) {
        button.graphics.clear();
        this.drawButton(button, "#228B22", 0, 0, 24, (this.textObj.getMeasuredHeight() + this.padding) / 2, "#444", button === this.increaseButton);
        stage.update();
    }

    onButtonMouseOut(button) {
        button.graphics.clear();
        this.drawButton(button, "#CCCCCC", 0, 0, 24, (this.textObj.getMeasuredHeight() + this.padding) / 2, "#444", button === this.increaseButton);
        stage.update();
    }

    getWidthUpToIndex(index) {
        const tempText = new createjs.Text(this.textObj.text.slice(0, index), this.styles, this.color);
        return tempText.getMeasuredWidth();
    }

    getCursorIndexFromX(x) {
        const charWidths = [];
        for (let i = 0; i < this.textObj.text.length; i++) {
            charWidths[i] = this.getWidthUpToIndex(i + 1);
        }

        // Berechne die halbe Breite jedes Buchstabens
        for (let i = 0; i < charWidths.length; i++) {
            const halfCharWidth = (charWidths[i] - (i > 0 ? charWidths[i - 1] : 0)) / 2;
            const threshold = (i > 0 ? charWidths[i - 1] : 0) + halfCharWidth;

            if (x < threshold) {
                return i;
            }
        }

        return this.textObj.text.length;
    }

    dispatchChangeEvent() {
        const event = new createjs.Event("change", true, false);
        this.dispatchEvent(event);
    }
}
