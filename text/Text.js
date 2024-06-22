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
     * @param {string} [bgColor=null] The background color.
     */
    constructor(text, styles, color, align, bgColor) {
        super();

        this.text = text;
        this.color = color;
        this.styles = styles;
        this.align = align || 'left';
        this.bgColor = bgColor || null;

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
    // Split text into lines
    const lines = this.text.split('\n');

    // Current y-position to place text objects one below the other
    let currentY = 0;

    lines.forEach(line => {
        // Regex zum Parsen von hoch- und tiefgestellten Text
        const parts = line.split(/([_^])/);

        // Berechne die gesamte Breite der aktuellen Zeile
        let totalWidth = 0;
        let subscriptMode = false;
        let superscriptMode = false;
        let currentStyles = this.styles;

        parts.forEach(part => {
            if (part === '_' || part === '^') {
                subscriptMode = (part === '_') ? !subscriptMode : false;
                superscriptMode = (part === '^') ? !superscriptMode : false;
                return;
            }

            // Passe die Schriftgröße an
            if (subscriptMode || superscriptMode) {
                const styleComponents = currentStyles.split(' ');
                let fontSizeIndex = styleComponents.findIndex(component => component.endsWith('px'));
                if (fontSizeIndex > -1) {
                    let fontSize = parseInt(styleComponents[fontSizeIndex]);
                    fontSize -= 2;
                    styleComponents[fontSizeIndex] = `${fontSize}px`;
                    currentStyles = styleComponents.join(' ');
                }
            } else {
                currentStyles = this.styles;
            }

            const tempTextObj = new createjs.Text(part, currentStyles, this.color);
            totalWidth += tempTextObj.getMeasuredWidth();
        });

        // Aktuelle x-Position zum Platzieren der Textobjekte nebeneinander
        let currentX = this.align === 'center' ? -totalWidth / 2 : 0;
        subscriptMode = false;
        superscriptMode = false;
        currentStyles = this.styles;

        parts.forEach(part => {
            if (part === '_') {
                subscriptMode = !subscriptMode;
                superscriptMode = false;
                return;
            }
            if (part === '^') {
                superscriptMode = !superscriptMode;
                subscriptMode = false;
                return;
            }

            // Passe die Schriftgröße an
            if (subscriptMode || superscriptMode) {
                const styleComponents = currentStyles.split(' ');
                let fontSizeIndex = styleComponents.findIndex(component => component.endsWith('px'));
                if (fontSizeIndex > -1) {
                    let fontSize = parseInt(styleComponents[fontSizeIndex]);
                    fontSize -= 2;
                    styleComponents[fontSizeIndex] = `${fontSize}px`;
                    currentStyles = styleComponents.join(' ');
                }
            } else {
                currentStyles = this.styles;
            }

            // Erstelle ein neues Textobjekt mit den angegebenen Parametern
            this.textObj = new createjs.Text(part, currentStyles, this.color);

            this.textObj.textAlign = "left";
            this.textObj.textBaseline = "middle";

            // Setze die Position des Textobjekts
            this.textObj.x = currentX;

            // Passe die y-Position an, abhängig davon, ob subscript oder superscript Modus aktiviert ist
            if (subscriptMode) {
                this.textObj.y = currentY + 7; // Anpassen des y-Werts für tiefgestellten Text
            } else if (superscriptMode) {
                this.textObj.y = currentY - 7; // Anpassen des y-Werts für hochgestellten Text
            } else {
                this.textObj.y = currentY; // Standard y-Wert für normalen Text
            }

            // Füge das Textobjekt zur Containerklasse hinzu
            this.addChild(this.textObj);

            // Erstelle ein Rechteck hinter dem Text, falls eine Hintergrundfarbe definiert ist
            if (this.bgColor) {
                const bg = new createjs.Shape();
                bg.graphics.beginFill(this.bgColor).drawRect(0, 0, this.textObj.getMeasuredWidth(), this.textObj.getMeasuredHeight());
                bg.x = this.textObj.x - (this.align === "center" ? this.textObj.getMeasuredWidth() / 2 : 0);
                bg.y = this.textObj.y - this.textObj.getMeasuredHeight() / 2;
                this.addChildAt(bg, 0); // Füge das Rechteck hinter dem Text hinzu
            }

            // Aktualisiere die aktuelle x-Position für das nächste Textobjekt
            currentX += this.textObj.getMeasuredWidth();
        });

        // Erhöhe die y-Position für die nächste Zeile
        currentY += this.textObj.getMeasuredHeight();
    });
}
}
