import { Text } from '../text/Text.js';

export class Button extends createjs.Container {
  
    constructor(text, width, height, font, fontSize) {
        super();
        
        this.text = text;
        this.width = width;
        this.height = height;
        this.font = font;
        this.fontSize = fontSize;
        this.active = false;
        this.toggleMode = false;

        stage.enableMouseOver(500);

        this.background = new createjs.Shape();
        this.drawBackground("#AAAAAA", ["#FAFAFA", "#EFEFEF"]);
		
		console.log(fontSize)

        this.label = new createjs.Text(text, fontSize + "px " + font, "#000000");
        this.label.textAlign = "center";
        this.label.textBaseline = "middle";
        this.label.x = this.width / 2;
        this.label.y = this.height / 2;

        this.container = new createjs.Container();
        this.container.addChild(this.background, this.label);

        this.container.addEventListener("mouseover", () => {
            this.drawBackground("#228B22", ["#FFFFFF", "#EFEFEF"]);
        });

        this.container.addEventListener("mouseout", () => {
            if (!this.toggleMode) {
                this.drawBackground("#AAAAAA", ["#FAFAFA", "#EFEFEF"]);
            }
            if (this.toggleMode && this.active) {
                this.drawBackground("#AAAAAA", ["#FFFFFF", "#EFEFEF"]);
            }
            if (this.toggleMode && !this.active) {
                this.drawBackground("#AAAAAA", ["#FAFAFA", "#EFEFEF"]);
            }
        });

        this.container.addEventListener("click", () => {
            if (this.toggleMode) {
                this.active = !this.active;
                if (this.active) {
                    this.drawBackground("#228B22", ["#FFFFFF", "#EFEFEF"]);
                } else {
                    this.drawBackground("#AAAAAA", ["#FAFAFA", "#EFEFEF"]);
                }
            }
            console.log("Button Zustand: " + (this.active ? "geklickt" : "nicht geklickt"));
        });

        this.addChild(this.container);
        stage.addChild(this);
        stage.update();
    }

    setText(text) {
        this.text = text;
        this.label.text = text;
    }

    setWidth(width) {
        this.width = width;
        this.drawBackground("#AAAAAA", ["#FAFAFA", "#CCCCCC"]);
        this.label.x = this.width / 2;
    }

    setHeight(height) {
        this.height = height;
        this.drawBackground("#AAAAAA", ["#FAFAFA", "#CCCCCC"]);
        this.label.y = this.height / 2;
    }

    setFont(font) {
        this.font = font;
        this.label.font = this.fontSize + "px " + font;
    }

    setFontSize(fontSize) {
        this.fontSize = fontSize;
        this.label.font = fontSize + "px " + this.font;
        this.label.lineHeight = fontSize + 4;
    }

    setToggleMode(toggleMode, active) {
        this.toggleMode = toggleMode;
        this.active = active || false;

        if (toggleMode) {
            if (this.active) {
                this.drawBackground("#228B22", ["#FFFFFF", "#EFEFEF"]);
            } else {
                this.drawBackground("#AAAAAA", ["#FAFAFA", "#EFEFEF"]);
            }
        }
    }

    drawBackground(strokeColor, fillColors) {
        this.background.graphics.clear();
        this.background.graphics.setStrokeStyle(0.5).beginStroke(strokeColor);
        this.background.graphics.beginLinearGradientFill(fillColors, [0, 1], 0, 0, 0, this.height);
        this.background.graphics.drawRoundRect(0, 0, this.width, this.height, 10);
        this.background.graphics.endFill();
    }
}
