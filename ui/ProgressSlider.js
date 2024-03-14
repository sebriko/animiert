export class ProgressSlider extends createjs.Container {
    constructor(width, height, minValue, maxValue, defaultValue, font, fontSize, orientation) {
        super();
        this.width = width;
        this.height = height;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.value = defaultValue;
        this.font = font;
        this.fontSize = fontSize;
        this.orientation = orientation || "horizontal";

        this.background = new createjs.Shape();
        this.drawBackground("#CCCCCC");

        this.thumb = new createjs.Shape();
        this.drawThumb(0);

        this.setValue(defaultValue);

        this.container = new createjs.Container();
        this.container.addChild(this.background, this.thumb);

        this.thumb.addEventListener("mouseover", this.handleThumbMouseOver.bind(this));
        this.thumb.addEventListener("mouseout", this.handleThumbMouseOut.bind(this));
        this.thumb.addEventListener("mousedown", this.handleThumbMouseDown.bind(this));
        this.thumb.addEventListener("pressmove", this.handleThumbPressMove.bind(this));

        stage.addChild(this.container);
    }

    drawBackground(fillColor) {
        this.background.graphics.clear();
        if (this.orientation === "horizontal") {
            this.background.graphics.setStrokeStyle(1, "round").beginStroke(fillColor);
            this.background.graphics.moveTo(0, 0);
            this.background.graphics.lineTo(this.width, 0);
        } else if (this.orientation === "vertical") {
            this.background.graphics.setStrokeStyle(1, "round").beginStroke(fillColor);
            this.background.graphics.moveTo(0, 0);
            this.background.graphics.lineTo(0, this.height);
        }
        this.background.graphics.endFill();
    }

    drawThumb(state) {
        this.thumb.graphics.clear();
        if (state === 0) {
            this.thumb.graphics.setStrokeStyle(0.5).beginStroke("#AAAAAA");
            this.thumb.graphics.beginLinearGradientFill(["#EFEFEF ", "#DDDDDD"], [0, 1], 0, 0, 0, this.height);
        } else if (state === 1) {
            this.thumb.graphics.setStrokeStyle(0.5).beginStroke("#228B22");
            this.thumb.graphics.beginLinearGradientFill(["#EFEFEF", "#EEEEEE"], [0, 1], 0, 0, 0, this.height);
        }

        const radius = this.height / 2;
        const triangleSize = this.height;
        let x1, y1, x2, y2, x3, y3;

        if (this.orientation === "horizontal") {
            x1 = radius - 7.5;
            y1 = 0;
            x2 = -7.5;
            y2 = triangleSize;
            x3 = triangleSize - 7.5;
            y3 = triangleSize;
        } else if (this.orientation === "vertical") {
            x1 = 0;
            y1 = radius - 7.5;
            x2 = -triangleSize;
            y2 = -7.5;
            x3 = -triangleSize;
            y3 = radius * 2 - 7.5;
        }

        this.thumb.graphics.moveTo(x1, y1);
        this.thumb.graphics.lineTo(x2, y2);
        this.thumb.graphics.lineTo(x3, y3);
        this.thumb.graphics.lineTo(x1, y1);

        this.thumb.graphics.endFill();
        this.thumb.setBounds(0, 0, triangleSize, triangleSize);
        this.thumb.x = (this.orientation === "horizontal") ? this.getThumbPositionX() : 0;
        this.thumb.y = (this.orientation === "vertical") ? this.getThumbPositionY() : 0;
    }

    setValue(value) {
        this.value = Math.max(this.minValue, Math.min(value, this.maxValue));
        if (this.orientation === "horizontal") {
            this.thumb.x = this.getThumbPositionX();
        } else if (this.orientation === "vertical") {
            this.thumb.y = this.getThumbPositionY();
        }
    }

    getThumbPositionX() {
        const percentage = (this.value - this.minValue) / (this.maxValue - this.minValue);
        return percentage * (this.width);
    }

    getThumbPositionY() {
        const percentage = (this.value - this.minValue) / (this.maxValue - this.minValue);
        return percentage * (this.height);
    }

    handleThumbMouseOver(event) {
        this.drawThumb(1);
    }

    handleThumbMouseOut(event) {
        this.drawThumb(0);
    }

    handleThumbMouseDown(event) {
        const point = this.container.globalToLocal(event.stageX, event.stageY);
        this.offset = { x: this.thumb.x - point.x, y: this.thumb.y - point.y };
    }

    handleThumbPressMove(event) {
        const point = this.container.globalToLocal(event.stageX, event.stageY);
        let newX, newY, percentage, currentAngle;

        if (this.orientation === "horizontal") {
            newX = point.x + this.offset.x;
            newX = Math.max(0, Math.min(newX, this.width));
            percentage = newX / this.width;
            this.setValue(this.minValue + percentage * (this.maxValue - this.minValue));
        } else if (this.orientation === "vertical") {
            newY = point.y + this.offset.y;
            newY = Math.max(0, Math.min(newY, this.height));
            percentage = newY / this.height;
            this.setValue(this.minValue + percentage * (this.maxValue - this.minValue));
        }

        currentAngle = percentage * 720;
        drawDynamicElements(currentAngle); // Assuming this function exists elsewhere
    }
}

