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
		
		this.align = align || "left"; // Default alignment is left

        this.drawText();
        stage.addChild(this);
    }

    /**
     * Draws the text.
     */
    drawText() {
        // Create a new text object with the specified parameters
        let textObj = new createjs.Text(this.text, this.styles, this.color);

        // Set the position of the text object
        textObj.x = 0;
        textObj.y = 0;
		
		textObj.textAlign = this.align;

        // Add the text object to the container class
        this.addChild(textObj);
    }
}
