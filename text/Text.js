export class Text extends createjs.Container {
    constructor(text, styles, color) {
        super();
        
        this.text = text;
        this.color = color;
        this.styles = styles;

        this.drawText();
        stage.addChild(this);
    }

    drawText() {
        // Erstelle ein neues Textobjekt mit den angegebenen Parametern
        let textObj = new createjs.Text(this.text, this.styles, this.color);

        // Setze die Position des Textobjekts
        textObj.x = 0;
        textObj.y = 0;

        // Füge das Textobjekt zur Containerklasse hinzu
        this.addChild(textObj);
    }
}