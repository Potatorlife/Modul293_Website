$(document).ready(function() {
    /* Dom Elemente von JQuery */
    const boardContainer = $('.board-container') /* Contianer vom Spielbrett */;
    const board = $('.board') /* Spielbrett selbst */;
    const moves = $('.moves') /* Züge Anzeige */;
    const timer = $('.timer') /* Timer-Anzeige */;
    const startButton = $('button') /* Startknopf, der eigentlich nutzlos ist, weil spiel auch startet, wenn man eine karte Aufdeckt */;
    const restartButton = $('#restartButton'); /* Restart button */
    const win = $('.win') /* Gewinnmeldung */;

    /* Spielstatus Variabeln */
    let gameStarted = false;
    let flippedCards = 0;
    let totalFlips = 0;
    let totalTime = 0;
    let loop;

    /* Mischen der Karten */
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /* Auswahl  zufällige Karten*/
    function pickRandom(array, items) {
        const picks = [];
        while (picks.length < items) {
            const index = Math.floor(Math.random() * array.length);
            picks.push(...array.splice(index, 1));
        }
        return picks;
    }

    /* Spielintialisierung */
    function generateGame() {
        const dimensions = parseInt(board.data('dimension'));
        if (dimensions % 2 !== 0) {
            throw new Error("The dimension of the board must be an even number");
        }

        /* Auswahl + Verdopplung Emojis */
        const emojis = ['🍔', '🍟', '🍕', '🌭', '🍺', '🥙', '🍦', '🍩', '🧁', '🍪'];
        const picks = pickRandom(emojis, (dimensions * dimensions) / 2);
        const items = shuffle([...picks, ...picks]);
        board.empty().css('grid-template-columns', `repeat(${dimensions}, auto)`);

        /* Platzierung Karten */
        items.forEach(item => {
            $(`<div class="card">
                <div class="card-front"></div>
                <div class="card-back">${item}</div>
            </div>`).appendTo(board);
        });
    }

    /* Update the game statistics, including the timer and its color */
    function getMovesColor(moves) {
        if (moves <= 10) {
            return 'green'; // Grün für 1-10 Züge
        } else if (moves <= 16) {
            return 'yellow'; // Gelb für 11-14 Züge
        } else {
            return 'red'; // Rot für 15+ Züge
        }
    }

    function updateTimerText() {
        timer.attr('data-text', `Time: ${totalTime} sec`);
        $('.timer-seconds').attr('data-text', `${totalTime} sec`);
    }

    function updateStats() {
        moves.html(`<span style="color: ${getMovesColor(totalFlips)};">${totalFlips} moves</span>`);
        // Remove the lines that dynamically set the gradient
        timer.html(`Time: <span class="timer-seconds">${totalTime} sec</span>`);

        updateTimerText();
    }

    updateStats();
    
    function startGame() {
        gameStarted = true;
        startButton.addClass('disabled');
    
        // Set the initial color to green for both timer and timer-seconds without delay
        $('.timer').css('color', 'green');
    
        // Start a loop that updates the game stats every second
        loop = setInterval(() => {
            totalTime++; // Increment time
            updateStats(); // Update game statistics
        }, 1000);
    
        // Apply the gradient animation to the timer and timer-seconds elements
        $('.timer').css({
            animation: 'timerGradient 120s linear infinite'
        });
    }

    function restartGame() {
        location.reload();
    }

    /* Überprüft für spiel ende/gewinn */
    function checkWin() {
        if ($('.card:not(.flipped)').length === 0) {
            boardContainer.addClass('all-matched'); // Fügt die Klasse hinzu, die die Animation auslöst
            
            setTimeout(() => {
                boardContainer.addClass('flipped'); // Fügt die Klasse für die Gewinnanzeige hinzu
                win.html(`<span class="win-text">You won!<br />With <span class="highlight">${totalFlips}</span> moves<br />Under <span class="highlight">${totalTime}</span> seconds</span>`);
                clearInterval(loop);
            }, 1000); // Lässt die goldene Farbe und Drehung für 1 Sekunde sichtbar
        }
    }

    /* Karten zurück drehen, wenn es kein paar ist */
    function flipBackCards() {
        $('.card').not('.matched').removeClass('flipped');
        flippedCards = 0;
    }

    /* Aufdecken einer Karte */
    function flipCard(card) {
        if (flippedCards < 2 && !$(card).hasClass('flipped')) {
            flippedCards++;
            $(card).addClass('flipped');
    
            if (!gameStarted) {
                startGame();
            }
    
            if (flippedCards === 2) {
                totalFlips++; // Move this line here so it only counts once per two flips
                const flipped = $('.flipped:not(.matched)');
                if (flipped.eq(0).find('.card-back').text() === flipped.eq(1).find('.card-back').text()) {
                    flipped.addClass('matched');
                }
    
                setTimeout(() => {
                    flipBackCards();
                    checkWin();
                }, 1000);
            }
        }
    }
    
    /* Event-Handler für klicks auf karten + Startknopf */
    board.on('click', '.card', function() {
        flipCard(this);
    });

    startButton.on('click', function() {
        if (!gameStarted) {
            generateGame(); /* Speil Vorbereiten */
            startGame(); /* Spiel starten */
        }
    });

    restartButton.on('click', function() {
        restartGame();
    });
    generateGame(); /* Generiert das Spiel */
});