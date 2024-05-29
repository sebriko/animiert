export class NumericStepper extends createjs.Container {
    constructor(numericValue, styles, color, width, stepValue = 1, maxLength = Infinity) {
        super();

        this.numericValue = numericValue;
        this.color = color;
        this.width = width;
        this.styles = styles;
        this.padding = 9;
        this.maxLength = maxLength;
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


this.whiteText = new createjs.Shape();
        this.addChild(this.whiteText);
		
		
        this.increaseButton = new createjs.Shape();
        this.decreaseButton = new createjs.Shape();

        // Hinzufügen der Buttons zum Container
        this.addChild(this.increaseButton);
        this.addChild(this.decreaseButton);

        this.addButtons();
        this.addButtonListeners();
        this.addMouseListeners();

        stage.addChild(this);

        const self = this;

        // Event-Listener für Tastatureingaben
        document.addEventListener("keydown", function(event) {
            self.shiftPressed = event.shiftKey;

            if (event.keyCode === 37) { // Linke Pfeiltaste
                if (self.cursorIndex > 0) {
                    self.cursorIndex--;
                }

                if (self.shiftPressed) {
                    self.selectionEnd = self.cursorIndex;
                    if (self.selectionStart === -1) {
                        self.selectionStart = self.selectionEnd + 1;
                    }
                }
            } else if (event.keyCode === 39) { // Rechte Pfeiltaste
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

            if ((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode === 190 || event.keyCode === 188 || event.keyCode === 8) {
                if (event.keyCode === 8) { // Rücktaste
                    if (self.cursorIndex > 0) {
                        self.textObj.text = self.textObj.text.slice(0, self.cursorIndex - 1) + self.textObj.text.slice(self.cursorIndex);
                        self.cursorIndex--;
                    }
                } else {
                    const tempTextWidth = self.getWidthUpToIndex(self.cursorIndex + 1);
                    if (tempTextWidth <= self.width && self.textObj.text.length < self.maxLength) {
                        self.textObj.text = self.textObj.text.slice(0, self.cursorIndex) + event.key + self.textObj.text.slice(self.cursorIndex);
                        self.cursorIndex++;
                    }
                }
            }

            if (!self.shiftPressed) {
                self.selectionStart = -1;
                self.selectionEnd = -1;
                self.selectionRect.graphics.clear();
                //self.drawCursor();
                self.updateCursor();
	
            } 
			
			
			self.updateSelectionRect();
            stage.update();

            if (event.keyCode === 13) {
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
    this.backgroundRect.graphics.setStrokeStyle(0);
    this.backgroundRect.graphics.beginStroke("#A9A9A9");
    this.backgroundRect.graphics.beginFill("#FFFFFF"); // Weiße Füllfarbe hinzufügen
    this.backgroundRect.graphics.drawRect(-this.padding / 2, -this.padding / 2, this.width, this.textObj.getMeasuredHeight() + this.padding);
    this.addChild(this.backgroundRect);
}

drawCursor() {

        this.removeAllChildren();

		this.addChild(this.backgroundRect);

        this.addChild(this.textObj);
        this.addChild(this.selectionRect);
		this.addChild(this.whiteText);
        this.addChild(this.increaseButton);
        this.addChild(this.decreaseButton);
		this.addChild(this.cursorObj);
		
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
        this.removeAllChildren();

		this.addChild(this.backgroundRect);
        this.addChild(this.textObj);
		
        this.addChild(this.selectionRect);
        this.addChild(this.increaseButton);
        this.addChild(this.decreaseButton);
		this.addChild(this.cursorObj)
		
        this.selectionRect.graphics.clear();

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



    addButtons() {
        this.increaseButton.graphics.clear();
        this.increaseButton.graphics.setStrokeStyle(1);
        this.increaseButton.graphics.beginStroke("#A9A9A9");
        this.increaseButton.graphics.beginLinearGradientFill(["rgba(250, 250, 250, 0.5)", "rgba(204, 204, 204, 0.3)"], [0, 1], 0, 0, 0, (this.textObj.getMeasuredHeight() + this.padding) / 2)
        this.increaseButton.graphics.drawRect(0, 0, 24, (this.textObj.getMeasuredHeight() + this.padding) / 2);
        this.increaseButton.graphics.endStroke();

        this.increaseButton.graphics.beginFill("#000");
        const midXIncrease = 12;
        const baseYIncrease = this.padding/4;
        const triangleHeight = 6;
        this.increaseButton.graphics.moveTo(midXIncrease, baseYIncrease);
        this.increaseButton.graphics.lineTo(midXIncrease + 4, baseYIncrease + triangleHeight);
        this.increaseButton.graphics.lineTo(midXIncrease - 4, baseYIncrease + triangleHeight);
        this.increaseButton.graphics.closePath();

        this.decreaseButton.graphics.clear();
        this.decreaseButton.graphics.setStrokeStyle(1);
        this.decreaseButton.graphics.beginStroke("#A9A9A9");
        this.decreaseButton.graphics.beginLinearGradientFill(["rgba(250, 250, 250, 0.5)", "rgba(204, 204, 204, 0.3)"], [0, 1], 0, 0, 0, (this.textObj.getMeasuredHeight() + this.padding) / 2)
        this.decreaseButton.graphics.drawRect(0, 0, 24, (this.textObj.getMeasuredHeight() + this.padding) / 2);
        this.decreaseButton.graphics.endStroke();

        this.decreaseButton.graphics.beginFill("#000");
        const midXDecrease = 12;
        const baseYDecrease = (this.textObj.getMeasuredHeight()+this.padding)/2-this.padding/4;
        this.decreaseButton.graphics.moveTo(midXDecrease, baseYDecrease);
        this.decreaseButton.graphics.lineTo(midXDecrease + 4, baseYDecrease - triangleHeight);
        this.decreaseButton.graphics.lineTo(midXDecrease - 4, baseYDecrease - triangleHeight);
        this.decreaseButton.graphics.closePath();

        const buttonX = this.width - this.padding / 2;
        const increaseButtonY = -this.padding / 2;
        const decreaseButtonY = (this.textObj.getMeasuredHeight() + this.padding) / 2 - this.padding / 2;

        this.increaseButton.x = buttonX;
        this.increaseButton.y = increaseButtonY;
        this.decreaseButton.x = buttonX;
        this.decreaseButton.y = decreaseButtonY;
    }

    addButtonListeners() {
        const self = this;

        self.increaseButton.addEventListener("click", function() {
            self.increaseValue();
        });

        self.decreaseButton.addEventListener("click", function() {
            self.decreaseValue();
        });
    }

    increaseValue() {
        let currentValue = parseFloat(this.textObj.text);
        if (!isNaN(currentValue)) {
            currentValue += this.stepValue;
            this.textObj.text = currentValue.toFixed(this.decimalPlaces);
            this.updateCursor();
            this.numericValue = currentValue;
            this.dispatchChangeEvent();
        }
		

                this.selectionStart = -1;
                this.selectionEnd = -1;
                this.selectionRect.graphics.clear();
                this.updateCursor();
    

		this.updateSelectionRect();
        stage.update();
		

    }

    decreaseValue() {
        let currentValue = parseFloat(this.textObj.text);
        if (!isNaN(currentValue)) {
            currentValue -= this.stepValue;
            this.textObj.text = currentValue.toFixed(this.decimalPlaces);
            this.updateCursor();
            this.numericValue = currentValue;
            this.dispatchChangeEvent();
        }
		
		               this.selectionStart = -1;
                this.selectionEnd = -1;
                this.selectionRect.graphics.clear();
                this.updateCursor();
    

		this.updateSelectionRect();
        stage.update();
		
		
		
    }

    getWidthUpToIndex(index) {
        const textUpToIndex = this.textObj.text.slice(0, index);
        const tempText = new createjs.Text(textUpToIndex, this.styles, this.color);
        return tempText.getMeasuredWidth();
    }

    dispatchChangeEvent() {
        this.dispatchEvent("change");
    }

addMouseListeners() {
    const self = this;

    this.backgroundRect.addEventListener("click", function(event) {
        //const mouseX = event.localX;
        //self.cursorIndex = self.getCursorIndexFromX(mouseX);

		self.updateCursor();

        stage.update();
    });

    // Mausereignis auch auf dem Textobjekt abfangen
    this.backgroundRect.addEventListener("mousedown", function(event) {
		
		
		self.removeAllChildren();

		self.addChild(self.backgroundRect);
        self.addChild(self.textObj);
		
        self.addChild(self.increaseButton);
        self.addChild(self.decreaseButton);
		self.addChild(self.cursorObj)
		
		
        const mouseX = event.localX;
        self.cursorIndex = self.getCursorIndexFromX(mouseX);
        self.selectionStart = self.cursorIndex;
		self.selectionEnd = -1;
        self.updateCursor();
        self.updateSelectionRect();
        stage.update();

        self.backgroundRect.addEventListener("pressmove", self.handlePressMove.bind(self));
    });

    this.backgroundRect.addEventListener("pressup", function() {
        self.backgroundRect.removeEventListener("pressmove", self.handlePressMove.bind(self));
    });
}


    handlePressMove(event) {
        const mouseX = event.localX;
        this.cursorIndex = this.getCursorIndexFromX(mouseX);
        this.selectionEnd = this.cursorIndex;
        this.updateSelectionRect();
        stage.update();
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
}
