export class NumericStepper extends createjs.Container {
    constructor(numericValue, styles, color, width, maxLength = Infinity) {
        super();

        this.numericValue = numericValue;
        this.color = color;
		this.width = width;
        this.styles = styles;
		this.padding = 9;
        this.maxLength = maxLength;
        this.cursorIndex = numericValue.length;
        this.shiftPressed = false;
        this.selectionStart = -1;
        this.selectionEnd = -1;
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
// Verarbeiten von Tastatureingaben
if ((event.keyCode >= 48 && event.keyCode <= 57) || // Zahlen (0-9)
    event.keyCode === 190 || event.keyCode === 188 || // Punkt und Komma
    event.keyCode === 8) { // Rücktaste
    if (event.keyCode === 8) {
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

            

            if (!self.shiftPressed) {
                self.selectionStart = -1;
                self.selectionEnd = -1;
                self.selectionRect.graphics.clear();
				self.drawCursor();
				self.updateCursor();
            } else {
				self.updateSelectionRect();
			}

            // Aktualisierung der Cursorposition
            
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
        const cursorPositionText = this.textObj.text.slice(0, this.cursorIndex);
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

    // Definiert die maximale Breite basierend auf der maxLength-Eigenschaft
    //const maxWidth = this.getWidthUpToIndex(this.maxLength);

    // Zeichnet den dunkelgrauen dünnen Rahmen
    this.backgroundRect.graphics.setStrokeStyle(0);
    this.backgroundRect.graphics.beginStroke("#A9A9A9"); // Dunkelgraue Farbe
    this.backgroundRect.graphics.drawRect(-this.padding/2, -this.padding/2, this.width, this.textObj.getMeasuredHeight()+this.padding);

    // Fügt die Shape-Instanz zum Container hinzu
    this.addChild(this.backgroundRect);
}


    // Methode, um Buttons hinzuzufügen
    addButtons() {
        // Erstellen des Erhöhungsbuttons


		this.increaseButton.graphics.setStrokeStyle(0);
		this.increaseButton.graphics.beginStroke("#A9A9A9"); // Dunkelgraue Farbe
        this.increaseButton.graphics.beginFill("#CCCCFF").drawRect(0, 0, 24, (this.textObj.getMeasuredHeight()+this.padding) / 2);

        // Erstellen des Erniedrigungsbuttons
		this.decreaseButton.graphics.setStrokeStyle(0);
		this.decreaseButton.graphics.beginStroke("#A9A9A9"); // Dunkelgraue Farbe
        this.decreaseButton.graphics.beginFill("#CCCCCC").drawRect(0, 0, 24, (this.textObj.getMeasuredHeight()+this.padding) / 2);

        // Positionieren der Buttons rechts neben dem Textfeld
        this.increaseButton.x = this.width-this.padding/2;
        this.increaseButton.y = -this.padding/2;
        this.decreaseButton.x = this.width-this.padding/2;
        this.decreaseButton.y = (this.textObj.getMeasuredHeight()+this.padding) / 2-this.padding/2;

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
		console.log("clicked")
        if (!isNaN(currentValue)) {
            currentValue += 1;
            this.textObj.text = currentValue.toFixed(2);
            this.updateCursor();
        }
    }

    // Methode, um den Wert zu verringern
    decreaseValue() {
        let currentValue = parseFloat(this.textObj.text);
        if (!isNaN(currentValue)) {
            currentValue -= 1;
            this.textObj.text = currentValue.toFixed(2);
            this.updateCursor();
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