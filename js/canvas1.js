let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let CanvasManager = {};

CanvasManager.canvas = null;
CanvasManager.context = null;
CanvasManager.tileWidth = 50;
CanvasManager.tileHeight = 50;

CanvasManager.field = [];
CanvasManager.obstacles = [];
CanvasManager.figures = [];
CanvasManager.typeOfFigures = ['knight', 'elf', 'dwarf'];
CanvasManager.players = [];

// CanvasManager.player1 = new Player('Player 1');
// CanvasManager.player2 = new Player('');
// CanvasManager.activePlayer = null;
CanvasManager.turn = 0;
CanvasManager.isFigureChosen = false;


CanvasManager.init = function (element) {
    this.canvas = document.getElementById(element);
    this.context = this.canvas.getContext('2d');
    let player1 = new Player(1, 'Player 1');
    CanvasManager.players.push(player1);
    let player2 = new Player(2, 'Player 2');
    CanvasManager.players.push(player2);
};

CanvasManager.generateObstacles = function () {
    /** generating number of obstacles */
    let numberOfObstacles = randomGenerator(1, 5);
    let x, y;
    for (let i = 1; i <= numberOfObstacles; i++) {
        x = randomGenerator(0, 8);
        y = randomGenerator(2, 4);
        if (this.obstacles.length > 0) {
            /** check if obstacle already exists*/
            this.obstacles.forEach(function (obstacle) {
                while (obstacle.x === x && obstacle.y === y) {
                    x = randomGenerator(0, 8);
                    y = randomGenerator(2, 4);
                }
            });
        }
        this.obstacles.push({x: x, y: y});
    }
};

CanvasManager.draw = function () {
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
    CanvasManager.generateObstacles();
    CanvasManager.obstacles.forEach(function (obstacle) {
            for (let x = 0; x < 9; x++) {
                for (let y = 0; y < 7; y++) {
                    CanvasManager.context.moveTo(0, (CanvasManager.tileHeight * y) - 0.5);
                    CanvasManager.context.lineTo(450, (CanvasManager.tileHeight * y) - 0.5);
                    CanvasManager.context.stroke();

                    CanvasManager.context.moveTo((CanvasManager.tileWidth * x) - 0.5, 0);
                    CanvasManager.context.lineTo((CanvasManager.tileWidth * x) - 0.5, 350);
                    CanvasManager.context.stroke();
                    if (x === obstacle.x && y === obstacle.y) {
                        CanvasManager.context.fillStyle = '#2B2B2B';
                        CanvasManager.context.fillRect(CanvasManager.tileWidth * x, CanvasManager.tileHeight * y, CanvasManager.tileWidth, CanvasManager.tileHeight);
                    }
                }
            }
        }
    );
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





function randomGenerator(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

