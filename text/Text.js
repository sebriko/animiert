/**
 * Represents a text element.
 * @extends {createjs.Container}
 */
export class Text extends createjs.Container {
    /**
     * Creates an instance of Text.
     * @param {string} text The text content.
     * @param {string} styles The text styles.
     * @param {string} color The text color.
     * @param {string} [align='left'] The text alignment.
     */
    constructor(text, styles, color, align) {
        super();

        this.text = text;
        this.color = color;
        this.styles = styles;
        this.align = align || 'left';

        this.drawText();
        stage.addChild(this);
    }
    
    getMeasuredHeight() {
        return this.textObj.getMeasuredHeight();
    }

    /**
     * Sets new text content and redraws the text.
     * @param {string} newText The new text content.
     */
    setText(newText) {
        this.text = newText;
        this.removeAllChildren(); // Remove existing text objects
        this.drawText(); // Redraw text
	
    }

    /**
     * Parses the input text and creates text elements with proper subscript and superscript formatting.
     * @private
     */
    drawText() {
        // Regex zum Parsen von hoch- und tiefgestellten Text
        const parts = this.text.split(/([_^])/);

        // Aktuelle x-Position zum Platzieren der Textobjekte nebeneinander
        let currentX = 0;

        // Flags für hoch- und tiefgestellte Modi
        let subscriptMode = false;
        let superscriptMode = false;

        // Durchlaufe die Teile
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            // Überprüfe auf Unterstrich (tiefgestellt) oder Caret (hochgestellt)
            if (part === '_') {
                subscriptMode = !subscriptMode;
                superscriptMode = false;
                continue;
            }
            if (part === '^') {
                superscriptMode = !superscriptMode;
                subscriptMode = false;
                continue;
            }

            // Passe die Schriftgröße an
            let currentStyles = this.styles;
            if (subscriptMode || superscriptMode) {
                // Extrahiere die Schriftgröße aus den Stilen und reduziere sie um zwei Schriftgrade
                const styleComponents = currentStyles.split(' ');
                let fontSizeIndex = styleComponents.findIndex(component => component.endsWith('px'));
                if (fontSizeIndex > -1) {
                    let fontSize = parseInt(styleComponents[fontSizeIndex]);
                    fontSize -= 2;
                    styleComponents[fontSizeIndex] = `${fontSize}px`;
                    currentStyles = styleComponents.join(' ');
                }
            }

            // Erstelle ein neues Textobjekt mit den angegebenen Parametern
            this.textObj = new createjs.Text(part, currentStyles, this.color);

            this.textObj.textAlign = "left";
            this.textObj.textBaseline = "middle";

            // Setze den Textausrichtungswert
            this.textObj.textAlign = this.align;

            // Setze die Position des Textobjekts
            this.textObj.x = currentX;

            // Passe die y-Position an, abhängig davon, ob subscript oder superscript Modus aktiviert ist
            if (subscriptMode) {
                this.textObj.y = 7; // Anpassen des y-Werts für tiefgestellten Text
            } else if (superscriptMode) {
                this.textObj.y = -7; // Anpassen des y-Werts für hochgestellten Text
            } else {
                this.textObj.y = 0; // Standard y-Wert für normalen Text
            }

            // Füge das Textobjekt zur Containerklasse hinzu
            this.addChild(this.textObj);

            // Aktualisiere die aktuelle x-Position für das nächste Textobjekt
            currentX += this.textObj.getMeasuredWidth();
        }
    }
}
