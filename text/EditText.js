/**
 * The `EditText` class represents an editable text field in a CreateJS application.
 * It allows text editing and includes a cursor that indicates the current position.
 */
export class EditText extends createjs.Container {
    
    /**
     * Creates a new instance of the `EditText` class.
     * 
     * @param {string} text - The initial text to display in the text field.
     * @param {string} styles - The styles to apply to the text (e.g., font size, font family).
     * @param {string} color - The color of the text.
     */
    constructor(text, styles, color) {
        super();
        
        this.textValue = text; // Store the text value in a class variable
        this.color = color;
        this.styles = styles;
        this.cursor = "text";

        this.drawText();
        this.drawCursor(); // Draw the cursor

        stage.addChild(this);
        
        let self = this;
        
        // Listen for keydown events to handle text editing
        document.addEventListener("keydown", function(event) {
            // Check if the key is a number, period, comma, or backspace
            if ((event.keyCode >= 48 && event.keyCode <= 57) ||  // Numbers (0-9)
                event.keyCode == 190 || event.keyCode == 188 || // Period (.) and comma (,)
                event.keyCode == 8) {                           // Backspace

                if (event.keyCode == 8 && self.textObj.text.length > 0) {
                    // Handle backspace key to remove the last character
                    self.textObj.text = self.textObj.text.slice(0, -1);
                } else {
                    // Add text for other keys
                    if (event.keyCode !== 8) {
                        self.textObj.text += event.key;
                    }
                }

                // Update the cursor position
                self.updateCursor();

                stage.update();
            }
        });
    }

    /**
     * Draws the initial text using the specified parameters.
     */
    drawText() {
        // Create a new text object with the specified parameters
        this.textObj = new createjs.Text(this.textValue, this.styles, this.color);

        // Set the position of the text object
        this.textObj.x = 0;
        this.textObj.y = 0;

        // Add the text object to the container class
        this.addChild(this.textObj);
    }

    /**
     * Draws the cursor as a vertical rectangle.
     */
    drawCursor() {
        // Create the cursor as a shape and fill it with black color
        this.cursorObj = new createjs.Shape();
        this.cursorObj.graphics.beginFill("#000").drawRect(0, 0, 1, this.textObj.getMeasuredHeight());

        // Position the cursor next to the text
        this.cursorObj.x = this.textObj.getMeasuredWidth() + 2; // Position the cursor 2 pixels to the right of the text
        this.cursorObj.y = 0;

        // Add the cursor to the container class
        this.addChild(this.cursorObj);
    }

    /**
     * Updates the position of the cursor based on the current width of the text.
     */
    updateCursor() {
        // Update the position of the cursor based on the current width of the text
        this.cursorObj.x = this.textObj.getMeasuredWidth() + 2; // Position the cursor 2 pixels to the right of the text
    }
}
