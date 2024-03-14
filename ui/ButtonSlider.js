export class ButtonSlider extends createjs.Container {
    constructor(size, width, height, minValue, maxValue, defaultValue, font, fontSize, orientation) {
        super();
        this.size = size;
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
        this.drawThumb("#AAAAAA");

        this.container = new createjs.Container();
        this.container.addChild(this.background, this.thumb);

        this.thumb.addEventListener("mousedown", this.onThumbMouseDown.bind(this));
        this.thumb.addEventListener("pressmove", this.onThumbPressMove.bind(this));
        this.thumb.addEventListener("mouseover", this.onThumbMouseOver.bind(this));
        this.thumb.addEventListener("mouseout", this.onThumbMouseOut.bind(this));
    }

    onThumbMouseDown(event) {
        const point = this.container.globalToLocal(event.stageX, event.stageY);
        this.offset = { x: this.thumb.x - point.x, y: this.thumb.y - point.y };
    }

    onThumbPressMove(event) {
        const point = this.container.globalToLocal(event.stageX, event.stageY);
        let newX, newY;
        
        if (this.orientation === "horizontal") {
            newX = Math.max(0, Math.min(point.x + this.offset.x, this.size));
            this.setValue(this.minValue + (newX / this.size) * (this.maxValue - this.minValue));
        } else if (this.orientation === "vertical") {
            newY = Math.max(0, Math.min(point.y + this.offset.y, this.size));
            this.setValue(this.minValue + (newY / this.size) * (this.maxValue - this.minValue));
        }
    }

    onThumbMouseOver() {
        this.drawThumb("#228B22");
    }

    onThumbMouseOut() {
        this.drawThumb("#AAAAAA");
    }

    drawThumb(strokeColor) {
        if (this.orientation === "vertical") {
            this.drawThumbVertical(strokeColor);
        } else {
            this.drawThumbHorizontal(strokeColor);
        }
    }

    drawThumbHorizontal(strokeColor) {
        const thumbWidth = this.height;
        const thumbHeight = this.width;
        const borderRadius = 2;

        this.thumb.graphics.clear().beginLinearGradientFill(["rgba(250, 250, 250, 0.5)", "rgba(204, 204, 204, 0.3)"], [0, 1], 0, 0, thumbWidth, 0)
            .setStrokeStyle(0.5, "round").beginStroke(strokeColor)
            .drawRoundRect(-thumbWidth/2, -thumbHeight/2, thumbWidth, thumbHeight, borderRadius)
            .setStrokeStyle(0.5, "round").beginStroke("rgba(204, 204, 204, 0.7)")
            .moveTo(0, -thumbHeight/2).lineTo(0, thumbHeight/2).endFill();

        this.thumb.setBounds(0, 0, thumbWidth, thumbHeight);
        this.thumb.x = this.getThumbPositionX();
        this.thumb.y = 0;
    }

    drawThumbVertical(strokeColor) {
        const thumbWidth = this.width;
        const thumbHeight = this.height;
        const borderRadius = 2;

        this.thumb.graphics.clear().beginLinearGradientFill(["rgba(250, 250, 250, 0.5)", "rgba(204, 204, 204, 0.3)"], [0, 1], 0, 0, 0, thumbHeight)
            .setStrokeStyle(0.5, "round").beginStroke(strokeColor)
            .drawRoundRect(-thumbWidth/2, -thumbHeight/2, thumbWidth, thumbHeight, borderRadius)
            .setStrokeStyle(0.5, "round").beginStroke("rgba(204, 204, 204, 0.7)")
            .moveTo(-thumbWidth/2, 0).lineTo(thumbWidth/2, 0).endFill();

        this.thumb.setBounds(0, 0, thumbWidth, thumbHeight);
        this.thumb.x = 0;
        this.thumb.y = this.getThumbPositionY();
    }

    getThumbPositionX() {
        return (this.value - this.minValue) / (this.maxValue - this.minValue) * this.size;
    }

    getThumbPositionY() {
        return (this.value - this.minValue) / (this.maxValue - this.minValue) * this.size;
    }

    drawBackground(fillColor) {
        if (this.orientation === "vertical") {
            this.drawBackgroundVertical(fillColor);
        } else {
            this.drawBackgroundHorizontal(fillColor);
        }
    }

    drawBackgroundHorizontal(fillColor) {
        this.background.graphics.clear().beginFill(fillColor).drawRect(0,0, this.size, 1).endFill();
    }

    drawBackgroundVertical(fillColor) {
        this.background.graphics.clear().beginFill(fillColor).drawRect(0,0, 1, this.size).endFill();
    }

    setValue(value) {
        this.value = Math.max(this.minValue, Math.min(value, this.maxValue));
        if (this.orientation === "horizontal") {
            this.thumb.x = this.getThumbPositionX();
        } else if (this.orientation === "vertical") {
            this.thumb.y = this.getThumbPositionY();
        }
    }
}
