const radioButtonGroups = {};

/**
 * Creates a radio button group and associates radio buttons with a group.
 * 
 * @example
 * // Creating a radio button
 * const radioButton1 = new RadioButton(true, 20, "Option 1", "Arial", 14, "group1");
 * 
 * // Creating another radio button in the same group
 * const radioButton2 = new RadioButton(false, 20, "Option 2", "Arial", 14, "group1");
 */
export class RadioButton extends createjs.Container {
    /**
     * Constructs a new RadioButton object.
     * 
     * @param {boolean} checked - Initial checked status of the radio button.
     * @param {number} size - Diameter of the radio button.
     * @param {string} label - Text label associated with the radio button.
     * @param {string} font - Font name for the label text.
     * @param {number} fontSize - Font size for the label text.
     * @param {string} groupName - Name of the radio button group.
     */
    constructor(checked = false, size = 15, label = "", font = "Arial", fontSize = 12, groupName = "") {
        super();
        this.checked = checked;
        this.size = size;
        this.label = label;
        this.font = font;
        this.fontSize = fontSize;
        this.groupName = groupName;

        this.background = new createjs.Shape();
        this.drawBackground();

        this.dot = new createjs.Shape();
        this.drawDot();

        this.labelText = new createjs.Text(this.label, this.fontSize + "px " + this.font, "#000000");
        this.labelText.textAlign = "left"; // Align text to the left
        this.labelText.textBaseline = "top";
        this.labelText.x = this.size * 1.5; // Position text to the right of the circle
        this.labelText.y = (this.size - this.labelText.getMeasuredHeight()) / 2; // Vertically center the text

        this.labelText.mouseEnabled = true;

        this.labelBackground = new createjs.Shape();
        this.drawLabelBackground();

        this.container = new createjs.Container();
        this.container.addChild(this.labelBackground, this.background, this.dot, this.labelText);

        this.container.addEventListener("mouseover", this.handleMouseOver.bind(this));
        this.container.addEventListener("mouseout", this.handleMouseOut.bind(this));
        this.container.addEventListener("click", this.handleClick.bind(this));

        this.updateRadioButton();
        this.addToGroup(this.groupName, this);

        this.addChild(this.container);
        stage.addChild(this);
        stage.enableMouseOver();
    }

    /**
     * Draws the radio button background.
     */
    drawBackground() {
        this.background.graphics.clear();
        this.background.graphics.setStrokeStyle(0.5).beginStroke("#CCCCC");
        this.background.graphics.beginFill("#FFFFFF");
        this.background.graphics.drawCircle(this.size / 2, this.size / 2, this.size / 2);
        this.background.graphics.endFill();
    }

    /**
     * Draws the dot for the checked state of the radio button.
     */
    drawDot() {
        this.dot.graphics.clear();
        this.dot.graphics.beginFill("#228B22");
        this.dot.graphics.drawCircle(this.size / 2, this.size / 2, this.size / 6);
        this.dot.graphics.endFill();
    }

    /**
     * Draws the background for the label.
     * @param {string} [color="#FFFFFF"] - The background color for the label.
     */
    drawLabelBackground(color = "#FFFFFF") {
        this.labelBackground.graphics.clear();
        this.labelBackground.graphics.beginFill(color);
        this.labelBackground.graphics.drawRect(
            this.size - 20,
            (this.size - this.labelText.getMeasuredHeight()) / 2 - 5,
            this.labelText.getBounds().width + 40,
            this.labelText.getBounds().height + 10
        );
        this.labelBackground.graphics.endFill();
    }

    /**
     * Handles the mouse over event on the radio button.
     */
    handleMouseOver() {
        this.background.graphics.clear();
        this.background.graphics.setStrokeStyle(0.5).beginStroke("#228B22");
        this.background.graphics.beginFill("#FFFFFF");
        this.background.graphics.drawCircle(this.size / 2, this.size / 2, this.size / 2);
        this.background.graphics.endFill();
    }

    /**
     * Handles the mouse out event on the radio button.
     */
    handleMouseOut() {
        this.drawBackground();
    }

    /**
     * Handles the click event on the radio button and updates its checked state.
     */
    handleClick() {
        if (!this.checked) {
            this.checked = true;
            const group = radioButtonGroups[this.groupName];
            group.forEach(radioButton => {
                if (radioButton !== this && radioButton.checked) {
                    radioButton.checked = false;
                    radioButton.updateRadioButton();
                }
            });
            this.updateRadioButton();
        }
    }

    /**
     * Updates the radio button display based on its checked state.
     */
    updateRadioButton() {
        this.dot.visible = this.checked;
    }

    /**
     * Updates the label text of the radio button.
     * @param {string} label - The new label text.
     */
    updateLabel(label) {
        this.label = label;
        this.labelText.text = label;
        this.labelBackground.graphics.clear();
        this.labelBackground.graphics.beginFill("#FFFFFF");
        this.labelBackground.graphics.drawRect(
            this.size + 5,
            this.size / 2 - this.fontSize / 2,
            this.labelText.getMeasuredWidth(),
            this.labelText.getBounds().height
        );
        this.labelBackground.graphics.endFill();
    }

    /**
     * Sets the font of the radio button label.
     * @param {string} font - The new font.
     */
    setFont(font) {
        this.font = font;
        this.labelText.font = this.fontSize + "px " + font;
    }

    /**
     * Sets the font size of the radio button label.
     * @param {number} fontSize - The new font size.
     */
    setFontSize(fontSize) {
        this.fontSize = fontSize;
        this.labelText.font = fontSize + "px " + this.font;
        this.labelText.lineHeight = fontSize + 4;
        this.drawLabelBackground();
    }

    /**
     * Adds the radio button to a group.
     * @param {string} groupName - The name of the group.
     * @param {RadioButton} radioButton - The radio button to be added to the group.
     */
    addToGroup(groupName, radioButton) {
        if (!radioButtonGroups[groupName]) {
            radioButtonGroups[groupName] = [];
        }
        radioButtonGroups[groupName].push(radioButton);
    }
}
