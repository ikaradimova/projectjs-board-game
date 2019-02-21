function addFigure(player, figureType) {
    console.log(player.id);
    let figuresCount = elementCounter('figure');
    console.log(figuresCount);
    if (figuresCount === 12) {
        return;
    }
    console.log(player);
    console.log(figureType);
    let cellCoordinates = CanvasManager.getClickedCell();
    let cellX = cellCoordinates.x;
    let cellY = cellCoordinates.y;

    let cellText;
    let figure;
    switch (figureType) {
        case 'knight':
            figure = new Knight(cellX, cellY, player.id);
            cellText = 'K';
            break;
        case 'elf':
            figure = new Elf(cellX, cellY, player.id);
            cellText = 'E';
            break;
        case 'dwarf':
            figure = new Dwarf(cellX, cellY, player.id);
            cellText = 'D';
            break;
        default:
            break;
    }

    console.log(cellX + ', ' + cellY);

    let yStart, yEnd;
    if (player.id === 1) {
        yStart = 0;
        yEnd = 1;
    } else if (player.id === 2) {
        yStart = 5;
        yEnd = 6
    }

    console.log(this.field);
    for (let x = 0; x < 9; x++) {
        for (let y = yStart; y <= yEnd; y++) {
            if (cellX === x && cellY === y) {
                // this.field.forEach(function (cell) {
                console.log(CanvasManager.field[9 * y + x]);
                if (CanvasManager.field[9 * y + x] === 0) {
                    CanvasManager.updateField({
                        type: 'figure',
                        figure: figureType,
                        x: figure.x,
                        y: figure.y,
                        playerId: figure.playerId,
                        attack: figure.attack,
                        armour: figure.armour,
                        health: figure.health,
                        attackSpan: figure.attackSpan,
                        speed: figure.speed,
                        points: figure.points,
                        id: ++figuresCount
                    });

                    switch (figureType) {
                        case 'knight':
                            player.knights++;
                            break;
                        case 'elf':
                            player.elves++;
                            break;
                        case 'dwarf':
                            player.dwarfs++;
                            break;
                        default:
                            break;
                    }

                    console.log(CanvasManager.players);
                    CanvasManager.drawFigure(player, cellText, x, y);
                    changeTurn();
                }
            }
        }
    }
    console.log(CanvasManager.field);
}

function gameStart() {
    let questionBox = document.querySelector('#questionBox');
    CanvasManager.generateFirstStep(CanvasManager.players[CanvasManager.turn]);
    let buttons = document.querySelectorAll('button');
    let chosenFigure;
    questionBox.addEventListener('click', function (e) {
        console.log(e.target.innerText);
        chosenFigure = e.target.innerText;
        changeIsFigureChosen(true);
    });
    console.log(CanvasManager.isFigureChosen);

    CanvasManager.canvas.addEventListener('click', function () {
        if (CanvasManager.isFigureChosen === true) {
            let coordinates = addFigure(CanvasManager.players[CanvasManager.turn], chosenFigure);
            CanvasManager.generateFirstStep(CanvasManager.players[CanvasManager.turn]);
            changeIsFigureChosen(false);
        }
    });
}


function changeTurn() {
    if (CanvasManager.turn === 0) {
        CanvasManager.turn = 1;
    } else if (CanvasManager.turn === 1) {
        CanvasManager.turn = 0;
    }
}

function changeIsFigureChosen(state) {
    CanvasManager.isFigureChosen = state;
}

function elementCounter(typeOfElement) {
    let elementCount = 0;
    // let figureCount = 0;
    CanvasManager.field.forEach(function (cell) {
        if (cell.type === typeOfElement) {
            elementCount++;
        }
    });
    return elementCount;
}

function randomGenerator(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
