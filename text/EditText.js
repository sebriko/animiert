export class EditText extends createjs.Container {
    constructor(text, styles, color) {
        super();
        
        this.textValue = text; // Verwende eine Klassenvariable, um den Text zu speichern
        this.color = color;
        this.styles = styles;
        this.cursor = "text";

        this.drawText();
        stage.addChild(this);
		
		let self = this;
		
		document.addEventListener("keydown", function(event) {
            // Überprüfen, ob der eingegebene Schlüssel eine Zahl, ein Punkt, ein Komma oder die Backspace-Taste ist
            if ((event.keyCode >= 48 && event.keyCode <= 57) ||  // Zahlen (0-9)
                event.keyCode == 190 || event.keyCode == 188 || // Punkt (.) und Komma (,)
                event.keyCode == 8) {                           // Backspace

                if (event.keyCode == 8 && self.textObj.text.length > 0) {
                    self.textObj.text = self.textObj.text.slice(0, -1);
                } else {
                    // Ansonsten Text hinzufügen
					
					if (event.keyCode !== 8)
                    self.textObj.text += event.key;
				
				
				
                }

                stage.update();
            }
        });
		
    }

    drawText() {
        // Erstelle ein neues Textobjekt mit den angegebenen Parametern
        this.textObj = new createjs.Text(this.textValue, this.styles, this.color);

        // Setze die Position des Textobjekts
        this.textObj.x = 0;
        this.textObj.y = 0;

        // Füge das Textobjekt zur Containerklasse hinzu
        this.addChild(this.textObj);
    }
}

