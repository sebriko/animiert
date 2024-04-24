/**
 * Creates a Checkbox
 
 * @example
 * // Erzeugt eine Checkbox mit dem Standardzustand "unchecked", Größe 20, Label "Option 1",
 * // Schriftart "Arial", und Schriftgröße 12.
 * const checkbox = new Checkbox(false, 20, "Option 1", "Arial", 12);
 * stage.addChild(checkbox);
 * 
 * // Aktualisiert die Schriftgröße der Checkbox auf 16 und ändert das Label in "Neue Option".
 * checkbox.setFontSize(16);
 * checkbox.updateLabel("Neue Option");
 */
  
export class Checkbox extends createjs.Container {
    /**
     * Creates a Checkbox instance.
     * @param {boolean} checked - The initial state of the checkbox (checked or unchecked).
     * @param {number} size - The size of the checkbox.
     * @param {string} label - The label of the checkbox.
     * @param {string} font - The font of the label.
     * @param {number} fontSize - The font size of the label.
     */
    constructor(checked, size, label, font, fontSize) {
        super();
        this.checked = checked;
        this.size = size;
        this.label = label;
        this.font = font;
        this.fontSize = fontSize;
        this.active = false;

        // Create the checkbox background as a Shape object
        this.background = new createjs.Shape();
        this.background.graphics.setStrokeStyle(0.5).beginStroke("#CCCCC");
        this.background.graphics.beginFill("#FFFFFF");
        this.background.graphics.drawRect(0, 0, this.size, this.size);
        this.background.graphics.endFill();

        // Create the checkmark of the checkbox as a Shape object
        this.checkmark = new createjs.Shape();
        this.drawCheckmark();

        // Create the label of the checkbox as a Text object
        this.labelText = new createjs.Text(this.label, this.fontSize + "px " + this.font, "#000000");
        this.labelText.textAlign = "left";
        this.labelText.textBaseline = "middle";
        this.labelText.x = this.size + 5;
        this.labelText.y = this.size / 2;

        // Create the rectangle around the text (needed for hover effect)
        this.labelBackground = new createjs.Shape();
		this.drawLabelBackground();

        this.labelBackground.graphics.beginFill("#FFFFFF");
        this.labelBackground.graphics.drawRect(
            this.size + 5,
            this.size / 2 - this.fontSize / 2,
            this.labelText.getBounds().width,
            this.labelText.getBounds().height
        );
        this.labelBackground.graphics.endFill();

        // Create the checkbox container and add elements
        this.container = new createjs.Container();
        this.container.addChild(this.labelBackground, this.background, this.checkmark, this.labelText);

        // Hover effect for checkbox
        this.container.addEventListener("mouseover", () => {
            this.background.graphics.clear();
            this.background.graphics.setStrokeStyle(0.5).beginStroke("#228B22");
            this.background.graphics.beginFill("#FFFFFF");
            this.background.graphics.drawRect(0, 0, this.size, this.size);
            this.background.graphics.endFill();
        });

        this.container.addEventListener("mouseout", () => {
            this.background.graphics.clear();
            this.background.graphics.setStrokeStyle(0.5).beginStroke("#CCCCC");
            this.background.graphics.beginFill("#FFFFFF");
            this.background.graphics.drawRect(0, 0, this.size, this.size);
            this.background.graphics.endFill();
        });

        // Update checkbox state
        this.updateCheckbox();

        // Click event
        this.container.addEventListener("click", () => {
            this.checked = !this.checked;
            this.updateCheckbox();
            console.log("Checkbox state: " + (this.checked ? "checked" : "unchecked"));
        });
		
		this.addChild(this.container);
		stage.addChild(this);
		stage.enableMouseOver();
    }

    /**
     * Draws the checkmark inside the checkbox.
     * @private
     */
    drawCheckmark() {
        this.checkmark.graphics.clear();
        this.checkmark.graphics.setStrokeStyle(2).beginStroke("#228B22");
        this.checkmark.graphics.moveTo(this.size * 0.25, this.size * 0.5);
        this.checkmark.graphics.lineTo(this.size * 0.45, this.size * 0.7);
        this.checkmark.graphics.lineTo(this.size * 0.75, this.size * 0.3);
        this.checkmark.graphics.endStroke();
    }

    /**
     * Updates the visual state of the checkbox according to the current 'checked' value.
     * @private
     */
    updateCheckbox() {
        this.checkmark.visible = this.checked;
    }

    /**
     * Updates the label of the checkbox.
     * @param {string} label - The new label of the checkbox.
     * @private
     */
    updateLabel(label) {
        this.label = label;
        this.labelText.text = label;
    
    }
	
	
	drawLabelBackground(color = "#FFFFFF") {
    this.labelBackground.graphics.clear();
    this.labelBackground.graphics.beginFill(color);
    this.labelBackground.graphics.drawRect(
        this.size - 20,
        (this.size - this.labelText.getMeasuredHeight()) / 2 -5,
        this.labelText.getBounds().width+40,
        this.labelText.getBounds().height+10
    );
    this.labelBackground.graphics.endFill();
}

    /**
     * Sets the font for the label of the checkbox.
     * @param {string} font - The new font.
     */
    setFont(font) {
        this.font = font;
        this.labelText.font = this.fontSize + "px " + font;
    }

    /**
     * Sets the font size for the label of the checkbox.
     * @param {number} fontSize - The new font size.
     */
    setFontSize(fontSize) {
        this.fontSize = fontSize;
        this.labelText.font = fontSize + "px " + this.font;
        this.labelText.lineHeight = fontSize + 4;

    }
}
