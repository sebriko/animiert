export class EditText extends createjs.Container {
    /**
     * Creates a new instance of the `EditText` class.
     *
     * @param {string} text - The initial text to be displayed in the text field.
     * @param {string} styles - The styles to be applied to the text (e.g., font size, font family).
     * @param {string} color - The color of the text.
     * @param {number} maxLength - The maximum number of characters that can be entered.
     */
    constructor(text, styles, color, maxLength = Infinity) {
        super();

        this.textValue = text;
        this.color = color;
        this.styles = styles;
        this.maxLength = maxLength;
        this.cursorIndex = text.length; // Initialize cursor index to the end of the text

        this.drawText();
        this.drawCursor();

        stage.addChild(this);

        let self = this;

        // Event listener for keydown events to handle text input and cursor movement
        document.addEventListener("keydown", function(event) {
            // Handle arrow keys for cursor movement
            if (event.keyCode === 37) { // Left arrow key
                if (self.cursorIndex > 0) {
                    self.cursorIndex--;
                }
            } else if (event.keyCode === 39) { // Right arrow key
                if (self.cursorIndex < self.textObj.text.length) {
                    self.cursorIndex++;
                }
            } else if ((event.keyCode >= 48 && event.keyCode <= 57) || // Numbers (0-9)
                event.keyCode === 190 || event.keyCode === 188 || // Period (.) and comma (,)
                event.keyCode === 8) { // Backspace
                // Handle backspace key
                if (event.keyCode === 8) {
                    if (self.cursorIndex > 0) {
                        self.textObj.text = self.textObj.text.slice(0, self.cursorIndex - 1) + self.textObj.text.slice(self.cursorIndex);
                        self.cursorIndex--;
                    }
                } else {
                    // Handle adding other keys if within max length
                    if (self.textObj.text.length < self.maxLength) {
                        self.textObj.text = self.textObj.text.slice(0, self.cursorIndex) + event.key + self.textObj.text.slice(self.cursorIndex);
                        self.cursorIndex++;
                    }
                }
            }

            // Update the cursor position after handling the key event
            self.updateCursor();

            stage.update();
        });
    }

    /**
     * Draws the initial text with the specified parameters.
     */
    drawText() {
        this.textObj = new createjs.Text(this.textValue, this.styles, this.color);
        this.textObj.x = 0;
        this.textObj.y = 0;
        this.addChild(this.textObj);
    }

    /**
     * Draws the cursor as a vertical rectangle.
     */
    drawCursor() {
        this.cursorObj = new createjs.Shape();
        this.cursorObj.graphics.beginFill("#000").drawRect(0, 0, 1, this.textObj.getMeasuredHeight());
        this.updateCursor();
        this.addChild(this.cursorObj);
    }

    /**
     * Updates the cursor position based on the current cursor index.
     */
    updateCursor() {
        // Calculate the width of the text up to the current cursor index
        const cursorPositionText = this.textObj.text.slice(0, this.cursorIndex);
        const cursorWidth = new createjs.Text(cursorPositionText, this.styles, this.color).getMeasuredWidth();

        // Set the cursor's x position based on the calculated width
        this.cursorObj.x = cursorWidth;
    }
}
