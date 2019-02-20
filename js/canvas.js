let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let CanvasManager = {};

CanvasManager.canvas = null;
CanvasManager.context = null;
CanvasManager.tileWidth = 50;
CanvasManager.tileHeight = 50;

CanvasManager.field = [];
// CanvasManager.obstacles = [];
// CanvasManager.figures = [];
CanvasManager.typeOfFigures = ['knight', 'elf', 'dwarf'];
CanvasManager.players = [];

// CanvasManager.player1 = new Player('Player 1');
// CanvasManager.player2 = new Player('');
// CanvasManager.activePlayer = null;
CanvasManager.turn = 0;
CanvasManager.isFigureChosen = false;

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
    let player1 = new Player(1, 'Player 1');
    CanvasManager.players.push(player1);
    let player2 = new Player(2, 'Player 2');
    CanvasManager.players.push(player2);
    CanvasManager.draw();
};

CanvasManager.generateObstacles = function () {
    /** generating number of obstacles */
    let numberOfObstacles = randomGenerator(1, 5);

    /** getting number of obstacles in field */
    let obstaclesCount = elementCounter('obstacle');
    // let obstaclesCount = 0;
    // CanvasManager.field.forEach(function (cell) {
    //     if (cell.type === 'obstacle') {
    //         obstaclesCount++;
    //     }
    // });

    // let obstacles = [];
    console.log(numberOfObstacles);
    let x, y;
    for (let i = 1; i <= numberOfObstacles; i++) {
        x = randomGenerator(0, 8);
        y = randomGenerator(2, 4);
        if (obstaclesCount > 0) {
            /** check if obstacle already exists*/
            this.obstacles.forEach(function (obstacle) {
                while (obstacle.x === x && obstacle.y === y) {
                    x = randomGenerator(0, 8);
                    y = randomGenerator(2, 4);
                }
            });
        }
        CanvasManager.updateField({type: 'obstacle', x: x, y: y});
    }
    // obstacles.forEach(function (obstacle) {
    //     CanvasManager.updateField(obstacle);
    //
    // });
    console.log(CanvasManager.field);
};

CanvasManager.updateField = function (object) {
    console.log(object);
    let index;
    // if(object.type === 'obstacle'){
    index = 9 * object.y + object.x;
    // } else if (object.type === 'figure'){
    //     index = 9 * object.figure.y + object.figure.x;
    // }
    // console.log(object.figure);
    CanvasManager.field.splice(index, 1, object);
    // CanvasManager.draw();
    // const ret = CanvasManager.field.slice(0);
    // console.log(ret);
    // ret[index] = object;
    // return ret;
    // for (let x = 0; x < 9; x++) {
    //     for (let y = 0; y < 7; y++) {
    //         if(object.x === x && object.y === y){
    //             index = x + y;
    //         }
    //     }
    // }
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
    CanvasManager.field.forEach(function (cell) {
            if (cell.type === 'obstacle') {
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


CanvasManager.addFigure = function (player, figureType) {
    console.log(player.id);
    let figuresCount = elementCounter('figure');
    // CanvasManager.field.forEach(function (cell) {
    //     if (cell.type === 'figure') {
    //         figuresCount++;
    //     }
    // });
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
    if(player.id === 1){
        yStart = 0;
        yEnd = 1;
    } else if (player.id === 2){
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
                        speed: figure.speed
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
                    changeTurn();
                    // CanvasManager.field.push({figure: figure});
                    // CanvasManager.players.forEach(function (pl) {
                    //     if(player.id === pl.id){
                    //
                    //         console.log(player);
                    //     }
                    // });

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
                        // this.context.strokeText("Canvas Rocks!", 5, 130);
                    } else if (player.id === 2) {
                        this.context.fillStyle = 'black';
                        this.context.fillRect(this.tileWidth * x, this.tileHeight * y, this.tileWidth, this.tileHeight);
                        this.context.fillStyle = 'red';
                        this.context.font = "20pt sans-serif";
                        this.context.fillText(cellText, this.tileWidth * x + 15, this.tileHeight * y + 35);

                    }
                }
                // });

                // this.context.fillRect(50 * x, 50 * y, 50, 50);
            }

        }
    }

    console.log(CanvasManager.field);

};

// CanvasManager.gameStart = function () {
//     // console.log(CanvasManager.players);
//     // let questionBox = document.querySelector('#questionBox');
//     // let turn = 0;
//     // let player1 = new Player('Player 1');
//     // let player2 = new Player('Player 2');
//     // let activePlayer = player1;
//
//     // console.log(questionBox);
//     // console.log(player1);
//     // console.log(player2);
//     // while(CanvasManager.figures < 6){
//     // if (turn % 2 === 0) {
//     //     activePlayer = player1;
//     // } else {
//     //     activePlayer = player2;
//     // }
//     // console.log(activePlayer);
//
//     // do {
//     //     if (turn % 2 === 0) {
//     //         activePlayer = player1;
//     //     } else {
//     //         activePlayer = player2;
//     //     }
//     //
//
//     // if (CanvasManager.figures.length === 12) {
//     //     return;
//     // }
//     let questionBox = document.querySelector('#questionBox');
//     // questionBox.innerHTML = `<p>${CanvasManager.players[CanvasManager.turn].name}, choose figure:</p>`;
//     CanvasManager.generateFirstStep(CanvasManager.players[CanvasManager.turn]);
//     // let par = document.createElement('p');
//     // par.appendChild(document.createTextNode(`${CanvasManager.players[CanvasManager.turn].name}, choose figure:`));
//     // questionBox.appendChild(par);
//     // let questionBox = document.querySelector('#questionBox');
//     let buttons = document.querySelectorAll('button');
//     // // console.log(buttons);
//     let chosenFigure;
//     // buttons.forEach(function (button) {
//         questionBox.addEventListener('click', function (e) {
//             console.log(e.target.innerText);
//             // console.log(button.innerText);
//             chosenFigure = e.target.innerText;
//             changeIsFigureChosen(true);
//             // CanvasManager.canvas.addEventListener('click', function () {
//             //     let coordinates = CanvasManager.addFigure(CanvasManager.players[CanvasManager.turn], chosenFigure);
//             //     CanvasManager.generateFirstStep(CanvasManager.players[CanvasManager.turn]);
//             //     CanvasManager.changeIsFigureChosen();
//             //     // let cellX = coordinates.x;
//             //     // let cellY = coordinates.y;
//             //     //
//             //     // console.log(cellX + ', ' + cellY);
//             //     // CanvasManager.changeTurn();
//             // });
//             // console.log(chosenFigure);
//             // CanvasManager.isFigureChosen = true;
//
//             // CanvasManager.canvas.addEventListener('click', function () {
//             //     let coordinates = CanvasManager.addFigure(CanvasManager.players[CanvasManager.turn],  chosenFigure);
//             //     // let cellX = coordinates.x;
//             //     // let cellY = coordinates.y;
//             //     //
//             //     // console.log(cellX + ', ' + cellY);
//             //     CanvasManager.changeTurn();
//             // });
//             // return chosenFigure;
//         });
//     // });
//
//     // console.log(isFigureChosen);
//     // if(CanvasManager.isFigureChosen){
//
//     console.log(CanvasManager.isFigureChosen);
//     //test
//
//         CanvasManager.canvas.addEventListener('click', function () {
//             if(CanvasManager.isFigureChosen === true){
//             let coordinates = CanvasManager.addFigure(CanvasManager.players[CanvasManager.turn], chosenFigure);
//             CanvasManager.generateFirstStep(CanvasManager.players[CanvasManager.turn]);
//             changeIsFigureChosen(false);
//             // let cellX = coordinates.x;
//             // let cellY = coordinates.y;
//             //
//             // console.log(cellX + ', ' + cellY);
//             // CanvasManager.changeTurn();
//             }
//
//         });
//
//
//     // }
//
//     //
//     //     // console.log(chosenFigure);
//     //
//     //     console.log(turn);
//     //     console.log(activePlayer);
//     //     console.log(CanvasManager.figures.length);
//     //     // return turn++;
//     //     return;
//     // } while (CanvasManager.figures.length < 6);
//
//     // questionBox.innerHTML = `<p>${activePlayer.name}, choose figure:</p>`;
//     // let formItem = document.createElement('form');
//     // questionBox.appendChild(formItem);
//     // if (activePlayer.dwarfs.length < activePlayer.numberOfDwarfs) {
//     //
//     //     let optionElement = document.createElement('input');
//     //     optionElement.setAttribute("type", "radio");
//     //     optionElement.setAttribute("name", "figure");
//     //     optionElement.setAttribute("value", "dwarf");
//     //     optionElement.innerHTML = 'dwarf';
//     //     // let label = document.createElement('label');
//     //     // label.appendChild(document.createTextNode('dwarf'));
//     //     // optionElement.appendChild(label);
//     //     // optionElement.appendChild(document.createTextNode('dwarf'));
//     //     formItem.appendChild(optionElement);
//     //     // selectItem.appendChild(document.create('option'));
//     // }
//     // }
// };

CanvasManager.generateFirstStep = function (player) {
    let figuresCount = elementCounter('figures');
    if(figuresCount === 12){
        console.log('BATTLE 1');
        CanvasManager.generateBattle();
    } else {
        console.log(player);
        let questionBox = document.querySelector('#questionBox');
        questionBox.innerHTML = `<p>${CanvasManager.players[CanvasManager.turn].name}, choose figure:</p>`;

        // let formItem = document.createElement('form');
        // questionBox.appendChild(formItem);
        this.typeOfFigures.forEach(function (type) {
            switch (type) {
                case 'knight':
                    if (player.knights < player.maxNumberOfKnights) {
                        let button = document.createElement('button');
                        button.appendChild(document.createTextNode(type));
                        questionBox.appendChild(button);
                    }
                    break;
                case 'elf':
                    if (player.elves < player.maxNumberOfElves) {
                        let button = document.createElement('button');
                        button.appendChild(document.createTextNode(type));
                        questionBox.appendChild(button);
                    }
                    break;
                case 'dwarf':
                    if (player.dwarfs < player.maxNumberOfDwarfs) {
                        let button = document.createElement('button');
                        button.appendChild(document.createTextNode(type));
                        questionBox.appendChild(button);
                    }
                    break;
                default:
                    break;
            }
            // if(CanvasManager.players[player.id].){
            //     let button = document.createElement('button');
            //     button.appendChild(document.createTextNode(type));
            //     questionBox.appendChild(button);
            // }

        });
        // let knightButton = document.createElement('button');
        // knightButton.appendChild(document.createTextNode('knight'));
        // questionBox.appendChild(knightButton);
        // if() {
        //
        // }
    }
};

CanvasManager.generateBattle = function () {
    console.log('BATTLE');
};

// CanvasManager.changeTurn = function () {
//     if (CanvasManager.turn === 0) {
//         CanvasManager.turn = 1;
//     } else if (CanvasManager.turn === 1) {
//         CanvasManager.turn = 0;
//     }
// };

// CanvasManager.changeIsFigureChosen = function (state) {
//     CanvasManager.isFigureChosen = state;
// };

// CanvasManager.elementCounter = function (typeOfElement) {
//     let elementCount = 0;
//     // let figureCount = 0;
//     CanvasManager.field.forEach(function (cell) {
//         if (cell.type === typeOfElement) {
//             elementCount++;
//         }
//     });
//     return elementCount;
// };

// function randomGenerator(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min)) + min;
// }

