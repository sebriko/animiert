export class NumericStepper extends createjs.Container {
    constructor(numericValue, styles, color, width, stepValue = 1, maxLength = Infinity) {
        super();

        this.numericValue = numericValue;
		
		
        this.color = color;
		this.width = width;
        this.styles = styles;
		this.padding = 9;
        this.maxLength = maxLength;
        this.cursorIndex = numericValue.length;
		
		
		this.decimalPlaces = this.getDecimalPlaces(numericValue);
		
        this.shiftPressed = false;
        this.selectionStart = -1;
        this.selectionEnd = -1;
        this.stepValue = stepValue;  // Speichert den Schrittwert

        this.drawText();
        this.drawCursor();
		this.drawBackgroundAndBorder();
		
        // Hinzufügen des Auswahlrechtecks
        this.selectionRect = new createjs.Shape();
        this.addChild(this.selectionRect);
		
        this.increaseButton = new createjs.Shape();
		this.decreaseButton = new createjs.Shape();
		
        // Hinzufügen der Buttons zum Container
        this.addChild(this.increaseButton);
        this.addChild(this.decreaseButton);
		
        this.addButtons();
        this.addButtonListeners();
		   
        stage.addChild(this);

        const self = this;

        // Event-Listener für Tastatureingaben
        document.addEventListener("keydown", function(event) {
            self.shiftPressed = event.shiftKey;

            // Linke und rechte Pfeiltasten zur Bewegung des Cursors
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

            // Verarbeiten von Tastatureingaben
            // Zahlen (0-9), Punkt, Komma und Rücktaste
            if ((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode === 190 || event.keyCode === 188 || event.keyCode === 8) {
                if (event.keyCode === 8) { // Rücktaste
                    if (self.cursorIndex > 0) {
                        self.textObj.text = self.textObj.text.slice(0, self.cursorIndex - 1) + self.textObj.text.slice(self.cursorIndex);
                        self.cursorIndex--;
                    }
                } else {
                    // Überprüfen, ob der Text die Breite überschreitet
                    const tempTextWidth = self.getWidthUpToIndex(self.cursorIndex + 1);
                    if (tempTextWidth <= self.width && self.textObj.text.length < self.maxLength) {
                        self.textObj.text = self.textObj.text.slice(0, self.cursorIndex) + event.key + self.textObj.text.slice(self.cursorIndex);
                        self.cursorIndex++;
                    }
                }
            }

            // Aktualisierung der Cursorposition und Auswahlrechteck
            if (!self.shiftPressed) {
                self.selectionStart = -1;
                self.selectionEnd = -1;
                self.selectionRect.graphics.clear();
				self.drawCursor();
				self.updateCursor();
            } else {
				self.updateSelectionRect();
			}

            // Aktualisierung der Stage
            stage.update();
        });
    }

    /**
     * Zeichnet den initialen Text mit den angegebenen Parametern.
     */
    drawText() {
        this.textObj = new createjs.Text(this.numericValue, this.styles, this.color);
        this.textObj.x = 0;
        this.textObj.y = 0;
        this.addChild(this.textObj);
    }

    /**
     * Zeichnet den Cursor als vertikales Rechteck.
     */
    drawCursor() {
		const backgroundRect = this.backgroundRect;
		
		this.removeAllChildren();
		
		this.addChild(backgroundRect);
		this.addChild(this.increaseButton);
        this.addChild(this.decreaseButton);
		
		this.addChild(this.textObj);
        this.cursorObj = new createjs.Shape();
        this.cursorObj.graphics.beginFill("#000").drawRect(0, 0, 1, this.textObj.getMeasuredHeight());
        this.updateCursor();
        this.addChild(this.cursorObj);
    }

    /**
     * Aktualisiert die Cursorposition basierend auf dem aktuellen Cursorindex.
     */
    updateCursor() {
        const cursorPositionText = this.textObj.text.slice(0, self.cursorIndex);
        const cursorWidth = new createjs.Text(cursorPositionText, this.styles, this.color).getMeasuredWidth();
        this.cursorObj.x = cursorWidth;
    }

    /**
     * Aktualisiert das Auswahlrechteck.
     */
    updateSelectionRect() {
        // Entfernen Sie den vorherigen weißen Text und Rechtecke, um doppelte Zeichnungen zu vermeiden
        this.removeAllChildren();
        this.addChild(this.backgroundRect);
        this.addChild(this.textObj);
        this.addChild(this.selectionRect);
		this.addChild(this.increaseButton);
        this.addChild(this.decreaseButton);
		
        // Überprüfen Sie, ob eine gültige Markierung vorliegt
        if (this.selectionStart !== -1 && this.selectionEnd !== -1 && this.selectionStart !== this.selectionEnd) {
            // Bestimmen Sie die Start- und Endpositionen der Markierung
            const start = Math.min(this.selectionStart, this.selectionEnd);
            const end = Math.max(this.selectionStart, this.selectionEnd);

            const startX = this.getWidthUpToIndex(start);
            const endX = this.getWidthUpToIndex(end);
            const rectWidth = endX - startX;

            // Zeichnen Sie das blaue Rechteck mit einer Füllfarbe
            this.selectionRect.graphics.clear();
            this.selectionRect.graphics.beginFill("#0000FF"); // Blaue Füllfarbe
            this.selectionRect.graphics.drawRect(startX, 0, rectWidth, this.textObj.getMeasuredHeight());

            // Setzen Sie den markierten Text in Weiß
            const selectedText = this.textObj.text.slice(start, end);
            const whiteText = new createjs.Text(selectedText, this.styles, "#FFFFFF"); // Weißer Text
            whiteText.x = startX;
            whiteText.y = 0;

            // Fügen Sie den weißen Text dem Container hinzu
            this.addChild(whiteText);
        }
    }

    drawBackgroundAndBorder() {
        // Erstellt eine Shape-Instanz für den Hintergrund und den Rahmen
        this.backgroundRect = new createjs.Shape();

        // Zeichnet den dunkelgrauen dünnen Rahmen
        this.backgroundRect.graphics.setStrokeStyle(0);
        this.backgroundRect.graphics.beginStroke("#A9A9A9"); // Dunkelgraue Farbe
        this.backgroundRect.graphics.drawRect(-this.padding / 2, -this.padding / 2, this.width, this.textObj.getMeasuredHeight() + this.padding);

        // Fügt die Shape-Instanz zum Container hinzu
        this.addChild(this.backgroundRect);
    }

    // Methode, um Buttons hinzuzufügen
addButtons() {
    // Erstellen des Erhöhungsbuttons
// Erhöhungstaste
this.increaseButton.graphics.clear();
this.increaseButton.graphics.setStrokeStyle(1);
this.increaseButton.graphics.beginStroke("#A9A9A9"); // Dunkelgraue Kontur
this.increaseButton.graphics.beginLinearGradientFill(["rgba(250, 250, 250, 0.5)", "rgba(204, 204, 204, 0.3)"], [0, 1], 0, 0, 0, (this.textObj.getMeasuredHeight() + this.padding) / 2)
this.increaseButton.graphics.drawRect(0, 0, 24, (this.textObj.getMeasuredHeight() + this.padding) / 2);
this.increaseButton.graphics.endStroke();

// Zeichne ein Dreieck auf der Erhöhungstaste
this.increaseButton.graphics.beginFill("#000"); // Schwarze Farbe für das Dreieck
const midXIncrease = 12;
const baseYIncrease = this.padding/4; // Basisposition des Dreiecks
const triangleHeight = 6; // Höhe des Dreiecks
this.increaseButton.graphics.moveTo(midXIncrease, baseYIncrease);
this.increaseButton.graphics.lineTo(midXIncrease + 4, baseYIncrease + triangleHeight);
this.increaseButton.graphics.lineTo(midXIncrease - 4, baseYIncrease + triangleHeight);
this.increaseButton.graphics.closePath();

// Erniedrigungstaste
this.decreaseButton.graphics.clear();
this.decreaseButton.graphics.setStrokeStyle(1);
this.decreaseButton.graphics.beginStroke("#A9A9A9"); // Dunkelgraue Kontur
this.decreaseButton.graphics.beginLinearGradientFill(["rgba(250, 250, 250, 0.5)", "rgba(204, 204, 204, 0.3)"], [0, 1], 0, 0, 0, (this.textObj.getMeasuredHeight() + this.padding) / 2)
this.decreaseButton.graphics.drawRect(0, 0, 24, (this.textObj.getMeasuredHeight() + this.padding) / 2);
this.decreaseButton.graphics.endStroke();

// Zeichne ein Dreieck auf der Erniedrigungstaste
this.decreaseButton.graphics.beginFill("#000"); // Schwarze Farbe für das Dreieck
const midXDecrease = 12;
const baseYDecrease = (this.textObj.getMeasuredHeight()+this.padding)/2-this.padding/4; // Basisposition des Dreiecks
this.decreaseButton.graphics.moveTo(midXDecrease, baseYDecrease);
this.decreaseButton.graphics.lineTo(midXDecrease + 4, baseYDecrease - triangleHeight);
this.decreaseButton.graphics.lineTo(midXDecrease - 4, baseYDecrease - triangleHeight);
this.decreaseButton.graphics.closePath();

// Positioniere die Schaltflächen
const buttonX = this.width - this.padding / 2;
const increaseButtonY = -this.padding / 2;
const decreaseButtonY = (this.textObj.getMeasuredHeight() + this.padding) / 2 - this.padding / 2;

this.increaseButton.x = buttonX;
this.increaseButton.y = increaseButtonY;
this.decreaseButton.x = buttonX;
this.decreaseButton.y = decreaseButtonY;

}

	
	// Methode, um Button-Listener hinzuzufügen
    addButtonListeners() {
        const self = this;

        // Listener für Erhöhungsbutton
        self.increaseButton.addEventListener("click", function() {
            self.increaseValue();
        });

        // Listener für Erniedrigungsbutton
        self.decreaseButton.addEventListener("click", function() {
            self.decreaseValue();
        });
    }

// Methode, um den Wert zu erhöhen
increaseValue() {
    let currentValue = parseFloat(this.textObj.text);
    if (!isNaN(currentValue)) {
        currentValue += this.stepValue;
        this.textObj.text = currentValue.toFixed(this.decimalPlaces);
        this.updateCursor();
    }
}

// Methode, um den Wert zu verringern
decreaseValue() {
    let currentValue = parseFloat(this.textObj.text);
    if (!isNaN(currentValue)) {
        currentValue -= this.stepValue;
        this.textObj.text = currentValue.toFixed(this.decimalPlaces);
        this.updateCursor();
    }
}

// Methode, um die Anzahl der Dezimalstellen einer Eingabezahl zu ermitteln
getDecimalPlaces(numericString) {
    const pointIndex = numericString.indexOf('.');
    if (pointIndex === -1) {
        return 0;
    } else {
        return numericString.length - pointIndex - 1;
    }
}

    /**
     * Gibt die Breite des Texts bis zu einem bestimmten Index zurück.
     */
    getWidthUpToIndex(index) {
        const textUpToIndex = this.textObj.text.slice(0, index);
        const tempText = new createjs.Text(textUpToIndex, this.styles, this.color);
        return tempText.getMeasuredWidth();
    }
}
