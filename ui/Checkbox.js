import { Text } from '../text/Text.js';

export class Checkbox extends createjs.Container {
    constructor(checked, size, label, font, fontSize) {
        super();
        this.checked = checked;
        this.size = size;
        this.label = label;
        this.font = font;
        this.fontSize = fontSize;
        this.active = false;

        // Create the checkbox background with a corner radius
        this.background = new createjs.Shape();
        this.background.graphics.setStrokeStyle(0.5).beginStroke("#555555");
        this.background.graphics.beginFill("#FFFFFF");
        this.background.graphics.drawRoundRect(0, 0, this.size, this.size, 2); 
        this.background.graphics.endFill();

        this.checkmark = new createjs.Shape();
        this.drawCheckmark();

        this.labelText = new Text(this.label, this.fontSize + "px " + this.font, "#000000");
        this.labelText.x = this.size + 5;
        this.labelText.y = this.size / 2;

        this.labelBackground = new createjs.Shape();
        this.drawLabelBackground();

        this.container = new createjs.Container();
        this.container.addChild(this.labelBackground, this.background, this.checkmark, this.labelText);

        this.addHoverEffect();
        this.updateCheckbox();

        this.container.addEventListener("click", () => {
            this.checked = !this.checked;
            this.updateCheckbox();
            this.dispatchEvent(new createjs.Event("change"));
        });

        this.addChild(this.container);
        stage.addChild(this);
        stage.enableMouseOver();
    }

    drawCheckmark() {
        this.checkmark.graphics.clear();
        this.checkmark.graphics.setStrokeStyle(2).beginStroke("#228B22");
        this.checkmark.graphics.moveTo(this.size * 0.25, this.size * 0.5);
        this.checkmark.graphics.lineTo(this.size * 0.45, this.size * 0.7);
        this.checkmark.graphics.lineTo(this.size * 0.75, this.size * 0.3);
        this.checkmark.graphics.endStroke();
    }

    updateCheckbox() {
        this.checkmark.visible = this.checked;
        stage.update();
    }

    updateLabel(label) {
        this.label = label;
        this.labelText.text = label;
    }

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

    setFont(font) {
        this.font = font;
        this.labelText.font = this.fontSize + "px " + font;
    }

    setFontSize(fontSize) {
        this.fontSize = fontSize;
        this.labelText.font = fontSize + "px " + this.font;
        this.labelText.lineHeight = fontSize + 4;
    }

    addHoverEffect() {
        this.container.addEventListener("mouseover", () => {
            this.background.graphics.clear();
            this.background.graphics.setStrokeStyle(0.5).beginStroke("#228B22");
            this.background.graphics.beginFill("#FFFFFF");
            this.background.graphics.drawRoundRect(0, 0, this.size, this.size, 2); 
            this.background.graphics.endFill();
            stage.update();
        });

        this.container.addEventListener("mouseout", () => {
            this.background.graphics.clear();
            this.background.graphics.setStrokeStyle(0.5).beginStroke("#555555");
            this.background.graphics.beginFill("#FFFFFF");
            this.background.graphics.drawRoundRect(0, 0, this.size, this.size, 2); 
            this.background.graphics.endFill();
            stage.update();
        });
    }
}
