// Definiere die MathCurve-Klasse
class MathCurve extends createjs.Shape {
    // Konstruktor mit Kurvenfunktion und Farbe als Parameter
    constructor(equation, color) {
        super();
        this.graphics.setStrokeStyle(2); // Setze die Strichstärke auf 2

        // Übergebe die Funktion und Farbe an die drawCurve-Methode
        this.drawCurve(equation, color);
    }

    // Methode zum Zeichnen einer mathematischen Kurve
    drawCurve(equation, color) {
        this.graphics.clear(); // Lösche vorherige Grafiken
        this.graphics.beginStroke(color); // Setze die Strichfarbe

        // Zeichne die Kurve basierend auf der Gleichung
        for (let x = 0; x <= stage.canvas.width; x += 1) {
            const y = equation(x);
            if (x === 0) {
                this.graphics.moveTo(x, y);
            } else {
                this.graphics.lineTo(x, y);
            }
        }

        this.graphics.endStroke(); // Beende den Strich

        // Füge die Kurve zur Bühne hinzu
        stage.addChild(this);
        stage.update(); // Aktualisiere die Bühne, um die Änderungen zu sehen
    }
}