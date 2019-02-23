let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let CanvasManager = {};

CanvasManager.canvas = null;
CanvasManager.context = null;
CanvasManager.tileWidth = 50;
CanvasManager.tileHeight = 50;

CanvasManager.field = [];
CanvasManager.typeOfFigures = ['knight', 'elf', 'dwarf'];
CanvasManager.typeOfActions = ['move', 'attack', 'heal'];
CanvasManager.players = [];

CanvasManager.turn = 0;
CanvasManager.isFigureChosen = false;
CanvasManager.isActionChosen = false;
CanvasManager.chosenFigure = '';
CanvasManager.chosenAction = '';
CanvasManager.gamePhase = 1;

CanvasManager.initField = function () {
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 7; y++) {
            CanvasManager.field.push(0);
        }
    }
};

CanvasManager.init = function (element) {
    this.canvas = document.getElementById(element);
    this.context = this.canvas.getContext('2d');
    CanvasManager.initField();
    console.log(CanvasManager.field);
    let player1 = new Player(1, 'Player 1', 0);
    CanvasManager.players.push(player1);
    let player2 = new Player(2, 'Player 2', 0);
    CanvasManager.players.push(player2);
    CanvasManager.generateObstacles();
    CanvasManager.draw();
};

CanvasManager.generateObstacles = function () {
    /** generating number of obstacles */
    let numberOfObstacles = randomGenerator(1, 5);

    /** getting number of obstacles in field */
    let obstaclesCount = elementCounter('obstacle');
    console.log(numberOfObstacles);
    let x, y;
    for (let i = 1; i <= numberOfObstacles; i++) {
        x = randomGenerator(0, 8);
        y = randomGenerator(2, 4);
        if (obstaclesCount > 0) {
            CanvasManager.field.forEach(function (cell) {
                /** check if obstacle already exists*/
                while (cell.x === x && cell.y === y) {
                    x = randomGenerator(0, 8);
                    y = randomGenerator(2, 4);
                }
            });
        }
        CanvasManager.updateField({type: 'obstacle', x: x, y: y});
    }
    console.log(CanvasManager.field);
};

CanvasManager.updateField = function (object) {
    // console.log(object);
    let index;
    index = 9 * object.y + object.x;
    CanvasManager.field.splice(index, 1, object);
};

CanvasManager.emptyCell = function(x, y){
    let index = 9 * y + x;
    CanvasManager.field.splice(index, 1, 0);
};

CanvasManager.drawInitialField = function () {
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 7; y++) {
            CanvasManager.context.moveTo(0, (CanvasManager.tileHeight * y) - 0.5);
            CanvasManager.context.lineTo(450, (CanvasManager.tileHeight * y) - 0.5);
            CanvasManager.context.stroke();

            CanvasManager.context.moveTo((CanvasManager.tileWidth * x) - 0.5, 0);
            CanvasManager.context.lineTo((CanvasManager.tileWidth * x) - 0.5, 350);
            CanvasManager.context.stroke();

            if (y <= 1 || y >= 5) {
                if (x % 2 === y % 2) {
                    CanvasManager.context.fillStyle = '#838383';
                    CanvasManager.context.fillRect(CanvasManager.tileWidth * x, CanvasManager.tileHeight * y, CanvasManager.tileWidth, CanvasManager.tileHeight);
                } else {
                    CanvasManager.context.fillStyle = '#A4A4A4';
                    CanvasManager.context.fillRect(CanvasManager.tileWidth * x, CanvasManager.tileHeight * y, CanvasManager.tileWidth, this.tileHeight);
                }
            } else {

                CanvasManager.context.fillStyle = '#CDCDCD';
                CanvasManager.context.fillRect(CanvasManager.tileWidth * x, CanvasManager.tileHeight * y, CanvasManager.tileWidth, CanvasManager.tileHeight);

            }
        }
    }
};
// CanvasManager.drawObstacles = function () {
//     // CanvasManager.generateObstacles();
//     CanvasManager.field.forEach(function (cell) {
//             if (cell.type === 'obstacle') {
//                 for (let x = 0; x < 9; x++) {
//                     for (let y = 0; y < 7; y++) {
//                         CanvasManager.context.moveTo(0, (CanvasManager.tileHeight * y) - 0.5);
//                         CanvasManager.context.lineTo(450, (CanvasManager.tileHeight * y) - 0.5);
//                         CanvasManager.context.stroke();
//
//                         CanvasManager.context.moveTo((CanvasManager.tileWidth * x) - 0.5, 0);
//                         CanvasManager.context.lineTo((CanvasManager.tileWidth * x) - 0.5, 350);
//                         CanvasManager.context.stroke();
//                         if (x === cell.x && y === cell.y) {
//                             CanvasManager.context.fillStyle = '#2B2B2B';
//                             CanvasManager.context.fillRect(CanvasManager.tileWidth * x, CanvasManager.tileHeight * y, CanvasManager.tileWidth, CanvasManager.tileHeight);
//                         }
//                     }
//                 }
//             }
//         }
//     );
// };

CanvasManager.drawFigures = function () {
    CanvasManager.field.forEach(function (cell) {
            if (cell.type === 'figure') {
                let cellText;
                switch (cell.figure) {
                    case 'knight':
                        cellText = 'K';
                        break;
                    case 'elf':
                        cellText = 'E';
                        break;
                    case 'dwarf':
                        cellText = 'D';
                        break;
                    default:
                        break;
                }
                CanvasManager.context.moveTo(0, (CanvasManager.tileHeight * cell.y) - 0.5);
                CanvasManager.context.lineTo(450, (CanvasManager.tileHeight * cell.y) - 0.5);
                CanvasManager.context.stroke();

                CanvasManager.context.moveTo((CanvasManager.tileWidth * cell.x) - 0.5, 0);
                CanvasManager.context.lineTo((CanvasManager.tileWidth * cell.x) - 0.5, 350);
                CanvasManager.context.stroke();

                if (cell.playerId === 1) {
                    CanvasManager.context.fillStyle = 'red';
                    CanvasManager.context.fillRect(CanvasManager.tileWidth * cell.x, CanvasManager.tileHeight * cell.y, CanvasManager.tileWidth, CanvasManager.tileHeight);
                    CanvasManager.context.fillStyle = 'black';
                    CanvasManager.context.font = "20pt sans-serif";
                    CanvasManager.context.fillText(cellText, CanvasManager.tileWidth * cell.x + 15, CanvasManager.tileHeight * cell.y + 35);
                } else if (cell.playerId === 2) {
                    CanvasManager.context.fillStyle = 'black';
                    CanvasManager.context.fillRect(CanvasManager.tileWidth * cell.x, CanvasManager.tileHeight * cell.y, CanvasManager.tileWidth, CanvasManager.tileHeight);
                    CanvasManager.context.fillStyle = 'red';
                    CanvasManager.context.font = "20pt sans-serif";
                    CanvasManager.context.fillText(cellText, CanvasManager.tileWidth * cell.x + 15, CanvasManager.tileHeight * cell.y + 35);
                }
            } else if (cell.type === 'obstacle') {
                for (let x = 0; x < 9; x++) {
                    for (let y = 0; y < 7; y++) {
                        CanvasManager.context.moveTo(0, (CanvasManager.tileHeight * y) - 0.5);
                        CanvasManager.context.lineTo(450, (CanvasManager.tileHeight * y) - 0.5);
                        CanvasManager.context.stroke();

                        CanvasManager.context.moveTo((CanvasManager.tileWidth * x) - 0.5, 0);
                        CanvasManager.context.lineTo((CanvasManager.tileWidth * x) - 0.5, 350);
                        CanvasManager.context.stroke();
                        if (x === cell.x && y === cell.y) {
                            CanvasManager.context.fillStyle = '#2B2B2B';
                            CanvasManager.context.fillRect(CanvasManager.tileWidth * x, CanvasManager.tileHeight * y, CanvasManager.tileWidth, CanvasManager.tileHeight);
                        }
                    }
                }
            }
        }
    );
};

CanvasManager.draw = function () {
    CanvasManager.drawInitialField();
    // CanvasManager.drawObstacles();
    CanvasManager.drawFigures();
};

CanvasManager.getMouseCoordinates = function (event) {
    let totalOffsetX = 0;
    let totalOffsetY = 0;
    let canvasX = 0;
    let canvasY = 0;
    let currentElement = canvas;

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while (currentElement = currentElement.offsetParent);

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x: canvasX, y: canvasY}
};
HTMLCanvasElement.prototype.getMouseCoordinates = CanvasManager.getMouseCoordinates;

CanvasManager.getClickedCell = function () {
    let coordinates = CanvasManager.getMouseCoordinates(event);
    let canvasX = coordinates.x;
    let canvasY = coordinates.y;
    let cellX = Math.floor(canvasX / this.tileWidth);
    let cellY = Math.floor(canvasY / this.tileHeight);
    return {x: cellX, y: cellY}
};

CanvasManager.drawFigure = function (player, cellText, x, y) {
    this.context.moveTo(0, (this.tileHeight * y) - 0.5);
    this.context.lineTo(450, (this.tileHeight * y) - 0.5);
    this.context.stroke();

    this.context.moveTo((this.tileWidth * x) - 0.5, 0);
    this.context.lineTo((this.tileWidth * x) - 0.5, 350);
    this.context.stroke();

    if (player.id === 1) {
        this.context.fillStyle = 'red';
        this.context.fillRect(this.tileWidth * x, this.tileHeight * y, this.tileWidth, this.tileHeight);
        this.context.fillStyle = 'black';
        this.context.font = "20pt sans-serif";
        this.context.fillText(cellText, this.tileWidth * x + 15, this.tileHeight * y + 35);
    } else if (player.id === 2) {
        this.context.fillStyle = 'black';
        this.context.fillRect(this.tileWidth * x, this.tileHeight * y, this.tileWidth, this.tileHeight);
        this.context.fillStyle = 'red';
        this.context.font = "20pt sans-serif";
        this.context.fillText(cellText, this.tileWidth * x + 15, this.tileHeight * y + 35);
    }
};

CanvasManager.drawPossibleFirstMoves = function (player) {
    let yStart, yEnd;
    if (player.id === 1) {
        yStart = 0;
        yEnd = 1;
    } else if (player.id === 2) {
        yStart = 5;
        yEnd = 6
    }

    for (let x = 0; x < 9; x++) {
        for (let y = yStart; y <= yEnd; y++) {
            // if (cellX === x && cellY === y) {
            // this.field.forEach(function (cell) {
            // console.log(CanvasManager.field[9 * y + x]);
            if (CanvasManager.field[9 * y + x] === 0) {

                this.context.moveTo(0, (this.tileHeight * y) - 0.5);
                this.context.lineTo(450, (this.tileHeight * y) - 0.5);
                this.context.stroke();

                this.context.moveTo((this.tileWidth * x) - 0.5, 0);
                this.context.lineTo((this.tileWidth * x) - 0.5, 350);
                this.context.stroke();

                CanvasManager.context.fillStyle = 'green';
                CanvasManager.context.fillRect(CanvasManager.tileWidth * x, CanvasManager.tileHeight * y, CanvasManager.tileWidth, CanvasManager.tileHeight);
                CanvasManager.context.fillStyle = 'black';
                CanvasManager.context.font = "20pt sans-serif";
                // CanvasManager.context.fillText(cellText, CanvasManager.tileWidth * x + 15, CanvasManager.tileHeight * y + 35);
            }
            // }
        }
    }
};

CanvasManager.drawPossibleMoves = function (figure) {

    // if(figure.figure === 'knight'){
    //     possiblePositions.push({x: figure.x, y: figure.y - 1});
    //     possiblePositions.push({x: figure.x, y: figure.y + 1});
    //     possiblePositions.push({x: figure.x - 1, y: figure.y});
    //     possiblePositions.push({x: figure.x + 1, y: figure.y});
    // }
    // let yStart, yEnd;
    // if (player.id === 1) {
    //     yStart = 0;
    //     yEnd = 1;
    // } else if (player.id === 2) {
    //     yStart = 5;
    //     yEnd = 6
    // }

    // for (let x = 0; x < 9; x++) {
    //     for (let y = yStart; y <= yEnd; y++) {
            // if (cellX === x && cellY === y) {
            // this.field.forEach(function (cell) {
    let possiblePositions = getPossiblePositions(figure);
    possiblePositions.forEach(function(position){
        // console.log(CanvasManager.field[9 * position.y + position.x]);
        // if (CanvasManager.field[9 * position.y + position.x] === 0) {

            CanvasManager.context.moveTo(0, (CanvasManager.tileHeight * position.y) - 0.5);
            CanvasManager.context.lineTo(450, (CanvasManager.tileHeight * position.y) - 0.5);
            CanvasManager.context.stroke();

            CanvasManager.context.moveTo((CanvasManager.tileWidth * position.x) - 0.5, 0);
            CanvasManager.context.lineTo((CanvasManager.tileWidth * position.x) - 0.5, 350);
            CanvasManager.context.stroke();

            CanvasManager.context.fillStyle = 'green';
            CanvasManager.context.fillRect(CanvasManager.tileWidth * position.x, CanvasManager.tileHeight * position.y, CanvasManager.tileWidth, CanvasManager.tileHeight);
            CanvasManager.context.fillStyle = 'black';
            CanvasManager.context.font = "20pt sans-serif";
            // CanvasManager.context.fillText(cellText, CanvasManager.tileWidth * x + 15, CanvasManager.tileHeight * y + 35);
        // }
    });
            // }
        // }
    // }

};