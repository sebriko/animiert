const radioButtonGroups = {};

/**
 * Creates a Radio Button 
 * @extends createjs.Container
 */

export class RadioButton extends createjs.Container {
	    /**
     * Constructs a new RadioButton object.
     * @param {boolean} checked - Status of the radio button
     * @param {number} size - Size of the circle
     * @param {string} label - Text of the radio button
     * @param {string} font - Font name
     * @param {string} fontSize - Font size
	* @param {string} groupName - Name of the group of other radio buttons
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
        this.labelText.textAlign = "left";
        this.labelText.textBaseline = "middle";
        this.labelText.x = this.size + 5;
        this.labelText.y = this.size / 2;

        this.labelText.mouseEnabled = true;

        this.labelBackground = new createjs.Shape();
        this.drawLabelBackground();

        this.container = new createjs.Container();
        this.container.addChild(this.background, this.dot, this.labelBackground, this.labelText);

        this.container.addEventListener("mouseover", this.handleMouseOver.bind(this));
        this.container.addEventListener("mouseout", this.handleMouseOut.bind(this));
        this.container.addEventListener("click", this.handleClick.bind(this));

        this.updateRadioButton();
        this.addToGroup(this.groupName, this);
    }

    drawBackground() {
        this.background.graphics.clear();
        this.background.graphics.setStrokeStyle(0.5).beginStroke("#CCCCC");
        this.background.graphics.beginFill("#FFFFFF");
        this.background.graphics.drawCircle(this.size / 2, this.size / 2, this.size / 2);
        this.background.graphics.endFill();
    }

    drawDot() {
        this.dot.graphics.clear();
        this.dot.graphics.beginFill("#228B22");
        this.dot.graphics.drawCircle(this.size / 2, this.size / 2, this.size / 6);
        this.dot.graphics.endFill();
    }

    drawLabelBackground() {
        this.labelBackground.graphics.clear();
        this.labelBackground.graphics.beginFill("#FFFFFF");
        this.labelBackground.graphics.drawRect(
            this.size + 5,
            this.size / 2 - this.fontSize / 2,
            this.labelText.getBounds().width,
            this.labelText.getBounds().height
        );
        this.labelBackground.graphics.endFill();
    }

    handleMouseOver() {
        this.background.graphics.clear();
        this.background.graphics.setStrokeStyle(0.5).beginStroke("#228B22");
        this.background.graphics.beginFill("#FFFFFF");
        this.background.graphics.drawCircle(this.size / 2, this.size / 2, this.size / 2);
        this.background.graphics.endFill();
    }

    handleMouseOut() {
        this.drawBackground();
    }

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

    updateRadioButton() {

        this.dot.visible = this.checked;
    }

    updateLabel() {
        this.labelText.text = this.label;
    }

    setFont(font) {
        this.font = font;
        this.labelText.font = this.fontSize + "px " + font;
    }

    setFontSize(fontSize) {
        this.fontSize = fontSize;
        this.labelText.font = fontSize + "px " + this.font;
        this.labelText.lineHeight = fontSize + 4;
        this.drawLabelBackground();
    }

    addToGroup(groupName, radioButton) {
        if (!radioButtonGroups[groupName]) {
            radioButtonGroups[groupName] = [];
        }
        radioButtonGroups[groupName].push(radioButton);
    }
}
