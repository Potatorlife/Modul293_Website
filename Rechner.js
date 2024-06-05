/* Diese Zeile sorgt dafür, dass der gesamte Code innerhalb der Funktion erst ausgeführt wird, 
nachdem das gesamte DOM geladen wurde. Das ist wichtig, um sicherzustellen, dass alle Elemente, 
auf die zugegriffen wird, bereits geladen und im DOM vorhanden sind. */
document.addEventListener('DOMContentLoaded', () => {

    /* Hier werden drei wichtige Elemente aus dem DOM ausgewählt und Variablen zugewiesen: 
    Ein input-Element für die Eingabe des zu berechnenden Ausdrucks, 
    ein Element für die Darstellung des Ergebnisbalkens (resultBar) und 
    ein Element für die Skala neben dem Ergebnisbalken (resultScale). */
    const display = document.querySelector('input[name="display"]');
    const resultBar = document.getElementById('resultBar');
    const resultScale = document.getElementById('resultScale');
  
    /* Diese Zeile fügt einen Klick-Event-Listener zu einem Element mit der Klasse .equal hinzu. 
    Wenn dieses Element geklickt wird, wird der eingegebene mathematische Ausdruck ausgewertet und 
    das Ergebnis wird in einem Balkendiagramm dargestellt. */
    document.querySelector('.equal').addEventListener('click', () => {
      
        // Berechnen Sie das Ergebnis
        /* Diese Zeile wertet den im display-Element eingegebenen Ausdruck aus und speichert das Ergebnis in der Variablen result. 
        Die Verwendung von eval() ermöglicht die Ausführung von String-Ausdrücken als JavaScript-Code, birgt jedoch Sicherheitsrisiken, 
        wenn der String von Benutzereingaben stammt. */
      const result = eval(display.value);


      // Zeichnen Sie das Balkendiagramm
      /* Diese Zeile ruft die Funktion drawBarChart mit dem berechneten Ergebnis als Argument auf. 
      Diese Funktion ist verantwortlich für die Visualisierung des Ergebnisses als Balkendiagramm. */
      drawBarChart(result);
    });
  

    function drawBarChart(value) {
        /* Innerhalb dieser Funktion wird der übergebene Wert zuerst gerundet. 
        Dann werden die obere und untere Grenze für die Skala berechnet, 
        indem vom gerundeten Wert 100 subtrahiert bzw. 100 addiert und dann auf das nächste Vielfache von 100 gerundet wird. */
        const roundedValue = Math.round(value);
        const upperBound = Math.ceil((roundedValue + 100) / 100) * 100;
        const lowerBound = Math.floor((roundedValue - 100) / 100) * 100;
        
        // Setzen Sie die resultBar Breite und Farbe abhängig vom Wert
        /* Die Breite der resultBar wird basierend auf dem Verhältnis des Ergebniswertes zur oberen Grenze festgelegt, 
        wobei eine Basisbreite von 50% angenommen wird. Die Hintergrundfarbe wird abhängig davon, 
        ob der Wert positiv oder negativ ist, auf Grün oder Rot gesetzt. 
        Der gerundete Wert wird als Textinhalt der resultBar festgelegt. */
        resultBar.style.width = `${(50 + (roundedValue / upperBound) * 50)}%`;
        resultBar.style.backgroundColor = roundedValue >= 0 ? 'green' : 'red';
        resultBar.textContent = roundedValue;
    

        // Erstellen Sie die Skala
        /* Die Skala wird neu erstellt, indem zuerst alle vorherigen Skalenmarkierungen gelöscht werden. 
        Anschließend wird für jeden Wert zwischen der unteren und oberen Grenze, 
        in 100er Schritten, eine neue Markierung erstellt, positioniert und zum resultScale-Element hinzugefügt */
        resultScale.innerHTML = ''; // Löschen Sie zuerst die vorherige Skala
        for (let i = lowerBound; i <= upperBound; i += 100) {
            const scaleMark = document.createElement('div');
            scaleMark.textContent = i;
            scaleMark.style.position = 'absolute';
            scaleMark.style.left = `${(50 + (i / upperBound) * 50)}%`;
            resultScale.appendChild(scaleMark);
        }
    }
});