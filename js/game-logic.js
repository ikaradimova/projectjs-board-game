function addFigure(player, figureType) {
    // console.log(player.id);
    let figuresCount = elementCounter('figure');
    // console.log(figuresCount);
    if (figuresCount === 12) {
        return;
    }
    // console.log(player);
    // console.log(figureType);
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

    // console.log(cellX + ', ' + cellY);

    let yStart, yEnd;
    if (player.id === 1) {
        yStart = 0;
        yEnd = 1;
    } else if (player.id === 2) {
        yStart = 5;
        yEnd = 6
    }

    // console.log(CanvasManager.field);
    for (let x = 0; x < 9; x++) {
        for (let y = yStart; y <= yEnd; y++) {
            if (cellX === x && cellY === y) {
                // this.field.forEach(function (cell) {
                // console.log(CanvasManager.field[9 * y + x]);
                if (CanvasManager.field[9 * y + x] === 0) {
                    let currentFigure = {
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
                        id: ++figuresCount,
                    };
                    CanvasManager.updateField(currentFigure);

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
                    player.numberOfFigures++;
                    player.figures.push(currentFigure);

                    // console.log(CanvasManager.players);
                    CanvasManager.drawFigure(player, cellText, x, y);
                    changeTurn();
                }
            }
        }
    }
    // console.log(CanvasManager.field);
}

function gameStart() {
    // return new Promise(function(resolve){
        generateFirstStep(CanvasManager.players[CanvasManager.turn]);
    // });
    // generateBattle();
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

function changeIsActionChosen(state) {
    CanvasManager.isActionChosen = state;
}

function elementCounter(typeOfElement) {
    // console.log(typeOfElement);
    let elementCount = 0;
    CanvasManager.field.forEach(function (cell) {
        if (cell.type === typeOfElement) {
            // console.log(cell.type);
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

function generateFirstStep(player) {
    return new Promise(function(resolve){
        console.log('first step');
        // console.log(player);
        let figuresCount = elementCounter('figure');
        // console.log(figuresCount);
        if (figuresCount < 12) {
            // console.log(CanvasManager.turn);
            let questionBox = document.querySelector(`#questionBoxPlayer${CanvasManager.turn + 1}`);
            // console.log(questionBox);
            questionBox.innerHTML = `<p>${CanvasManager.players[CanvasManager.turn].name}</p>`;
            questionBox.innerHTML += `<p>Choose figure:</p>`;

            let buttonHolder = document.createElement('div');
            buttonHolder.id = `buttonHolderPlayer${CanvasManager.turn + 1}`;
            // console.log(buttonHolder);
            questionBox.appendChild(buttonHolder);
            CanvasManager.typeOfFigures.forEach(function (type) {
                switch (type) {
                    case 'knight':
                        if (player.knights < player.maxNumberOfKnights) {
                            let button = document.createElement('button');
                            button.appendChild(document.createTextNode(type));
                            buttonHolder.appendChild(button);
                        }
                        break;
                    case 'elf':
                        if (player.elves < player.maxNumberOfElves) {
                            let button = document.createElement('button');
                            button.appendChild(document.createTextNode(type));
                            buttonHolder.appendChild(button);
                        }
                        break;
                    case 'dwarf':
                        if (player.dwarfs < player.maxNumberOfDwarfs) {
                            let button = document.createElement('button');
                            button.appendChild(document.createTextNode(type));
                            buttonHolder.appendChild(button);
                        }
                        break;
                    default:
                        break;
                }
            });
            return new Promise(function(resolve){
                buttonHolder.addEventListener('click', function (e) {
                    // console.log(e.target.innerText);

                    CanvasManager.chosenFigure = e.target.innerText;
                    changeIsFigureChosen(true);
                    buttonHolder.className = 'hide';

                    CanvasManager.drawPossibleFirstMoves(CanvasManager.players[CanvasManager.turn]);

                    resolve(CanvasManager.canvas.addEventListener('click', function () {
                        if (CanvasManager.isFigureChosen === true) {
                            CanvasManager.draw();
                            // console.log(CanvasManager.chosenFigure);

                            let coordinates = addFigure(CanvasManager.players[CanvasManager.turn], CanvasManager.chosenFigure);

                            generateFirstStep(CanvasManager.players[CanvasManager.turn]);
                            changeIsFigureChosen(false);
                        }
                    }));
                });
            })

            // console.log(CanvasManager.isFigureChosen);

        }
        resolve(generateBattle());
    })

}


function generateBattle() {
    console.log('battle');
    // if (CanvasManager.players[0].numberOfFigures > 0 || CanvasManager.players[1].numberOfFigures > 0) {
    console.log(CanvasManager.turn);
    let questionBox = document.querySelector(`#questionBoxPlayer${CanvasManager.turn + 1}`);
    // console.log(questionBox);
    questionBox.innerHTML = `<p>${CanvasManager.players[CanvasManager.turn].name}</p>`;
    questionBox.innerHTML += `<p>Choose action:</p>`;

    let buttonHolder = document.createElement('div');
    buttonHolder.id = `buttonHolderPlayer${CanvasManager.turn + 1}`;
    console.log(buttonHolder);
    questionBox.appendChild(buttonHolder);
    CanvasManager.typeOfActions.forEach(function (type) {
        let button = document.createElement('button');
        button.appendChild(document.createTextNode(type));
        buttonHolder.appendChild(button);
    });

    /** choose action */
    buttonHolder.addEventListener('click', function (e) {
        // console.log(e.target.innerText);

        CanvasManager.chosenAction = e.target.innerText;
        // console.log(CanvasManager.chosenAction);
        changeIsActionChosen(true);
        console.log(CanvasManager.isActionChosen);
        buttonHolder.className = 'hide';
        // switch (CanvasManager.chosenAction) {
        //     case 'move':
        //         console.log('move is chosen');
        //         moveFigure(figureClicked);
        //         // changeTurn();
        //
        //         // generateBattle();
        //         break;
        //     case 'attack':
        //         console.log('attack is chosen');
        //         attackFigure(figureClicked);
        //         // changeTurn();
        //
        //         // generateBattle();
        //         break;
        //     case 'heal':
        //         console.log('heal is chosen');
        //         healFigure(figureClicked);
        //         // changeTurn();
        //         //
        //         // generateBattle();
        //         break;
        //     default:
        //         break;
        // }
        // }
        // CanvasManager.drawPossibleFirstMoves(CanvasManager.players[CanvasManager.turn]);

    });

    CanvasManager.canvas.addEventListener('click', function (e) {
        console.log(CanvasManager.players[CanvasManager.turn]);
        console.log('chooseFigure event listener');
        let cellCoordinates = CanvasManager.getClickedCell();
        let cellX = cellCoordinates.x;
        let cellY = cellCoordinates.y;
        console.log(cellX);
        console.log(cellY);
        console.log(CanvasManager.players[CanvasManager.turn]);
        console.log(checkIfFigureBelongsToPlayer(cellX, cellY, CanvasManager.players[CanvasManager.turn]));
        if (CanvasManager.isActionChosen === true &&
            checkIfFigureBelongsToPlayer(cellX, cellY, CanvasManager.players[CanvasManager.turn]) === true

        ) {
            console.log('x: ' + cellX + ', y: ' + cellY);
            CanvasManager.chosenFigure = CanvasManager.field[9 * cellY + cellX];
            changeIsFigureChosen(true);
            let possibleMoves = CanvasManager.drawPossibleMoves(CanvasManager.chosenFigure);


            CanvasManager.canvas.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                switch (CanvasManager.chosenAction) {
                    case 'move':
                        console.log('move is chosen');
                        changeIsActionChosen(false);
                        moveFigure(CanvasManager.chosenFigure);

                        // changeTurn();

                        // generateBattle();
                        return;
                    // break;
                    case 'attack':
                        console.log('attack is chosen');
                        attackFigure(CanvasManager.chosenFigure);
                        // changeTurn();

                        // generateBattle();
                        break;
                    case 'heal':
                        console.log('heal is chosen');
                        healFigure(CanvasManager.chosenFigure);
                        // changeTurn();
                        //
                        // generateBattle();
                        break;
                    default:
                        break;
                }
            });

            // switch (CanvasManager.chosenAction) {
            //     case 'move':
            //         console.log('move is chosen');
            //         changeIsActionChosen(false);
            //         CanvasManager.drawPossibleMoves(CanvasManager.chosenFigure);
            //         if (CanvasManager.isFigureChosen === true) {
            //             moveFigure(CanvasManager.chosenFigure);
            //         }
            //         // changeTurn();
            //
            //         // generateBattle();
            //         break;
            //     case 'attack':
            //         console.log('attack is chosen');
            //         attackFigure(CanvasManager.chosenFigure);
            //         // changeTurn();
            //
            //         // generateBattle();
            //         break;
            //     case 'heal':
            //         console.log('heal is chosen');
            //         healFigure(CanvasManager.chosenFigure);
            //         // changeTurn();
            //         //
            //         // generateBattle();
            //         break;
            //     default:
            //         break;
            // }



            console.log('test');
        }
    });

    // CanvasManager.canvas.addEventListener('contextmenu', function (e) {
    //     if(CanvasManager.isFigureChosen === true){
    //         switch (CanvasManager.chosenAction) {
    //             case 'move':
    //                 console.log('move is chosen');
    //                 moveFigure(CanvasManager.chosenFigure);
    //                 changeIsActionChosen(false);
    //                 // changeTurn();
    //
    //                 // generateBattle();
    //                 break;
    //             case 'attack':
    //                 console.log('attack is chosen');
    //                 attackFigure(CanvasManager.chosenFigure);
    //                 // changeTurn();
    //
    //                 // generateBattle();
    //                 break;
    //             case 'heal':
    //                 console.log('heal is chosen');
    //                 healFigure(CanvasManager.chosenFigure);
    //                 // changeTurn();
    //                 //
    //                 // generateBattle();
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // });


    // CanvasManager.canvas.addEventListener('click', function(){
    //     if (CanvasManager.isFigureChosen === true) {
    //         switch (CanvasManager.chosenAction) {
    //             case 'move':
    //                 console.log('move is chosen');
    //                 changeIsActionChosen(false);
    //                 if (CanvasManager.isFigureChosen === true) {
    //                     moveFigure(CanvasManager.chosenFigure);
    //                 }
    //                 // changeTurn();
    //
    //                 // generateBattle();
    //                 break;
    //             case 'attack':
    //                 console.log('attack is chosen');
    //                 attackFigure(CanvasManager.chosenFigure);
    //                 // changeTurn();
    //
    //                 // generateBattle();
    //                 break;
    //             case 'heal':
    //                 console.log('heal is chosen');
    //                 healFigure(CanvasManager.chosenFigure);
    //                 // changeTurn();
    //                 //
    //                 // generateBattle();
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // });



    // if (CanvasManager.isActionChosen === true) {
    //     console.log('action chosen');
    //     chooseFigure();
    //     switch (CanvasManager.chosenAction) {
    //         case 'move':
    //             console.log('move is chosen');
    //             changeIsActionChosen(false);
    //             CanvasManager.drawPossibleMoves(CanvasManager.chosenFigure);
    //             if (CanvasManager.isFigureChosen === true) {
    //                 moveFigure(CanvasManager.chosenFigure);
    //             }
    //             // changeTurn();
    //
    //             // generateBattle();
    //             break;
    //         case 'attack':
    //             console.log('attack is chosen');
    //             attackFigure(CanvasManager.chosenFigure);
    //             // changeTurn();
    //
    //             // generateBattle();
    //             break;
    //         case 'heal':
    //             console.log('heal is chosen');
    //             healFigure(CanvasManager.chosenFigure);
    //             // changeTurn();
    //             //
    //             // generateBattle();
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // console.log(CanvasManager.isActionChosen);

    // if(CanvasManager.isActionChosen === true){
    //     CanvasManager.canvas.addEventListener('click', function () {
    //         // CanvasManager.draw();
    //         // CanvasManager.getMouseCoordinates();
    //         // console.log(CanvasManager.chosenAction);
    //         // console.log(CanvasManager.getMouseCoordinates());
    //         let cellCoordinates = CanvasManager.getClickedCell();
    //         let cellX = cellCoordinates.x;
    //         let cellY = cellCoordinates.y;
    //         let figureClicked = CanvasManager.field[9 * cellY + cellX];
    //         // console.log(figureClicked);
    //
    //         switch (CanvasManager.chosenAction) {
    //             case 'move':
    //                 console.log('move is chosen');
    //                 moveFigure(figureClicked);
    //                 // changeTurn();
    //
    //                 // generateBattle();
    //                 break;
    //             case 'attack':
    //                 console.log('attack is chosen');
    //                 attackFigure(figureClicked);
    //                 // changeTurn();
    //
    //                 // generateBattle();
    //                 break;
    //             case 'heal':
    //                 console.log('heal is chosen');
    //                 healFigure(figureClicked);
    //                 // changeTurn();
    //                 //
    //                 // generateBattle();
    //                 break;
    //             default:
    //                 break;
    //         }
    //
    //         console.log('test');
    //         // generateBattle();
    //
    //         // if (CanvasManager.isFigureChosen === true) {
    //         //     CanvasManager.draw();
    //         //     console.log(CanvasManager.chosenFigure);
    //         //
    //         //     let coordinates = addFigure(CanvasManager.players[CanvasManager.turn], CanvasManager.chosenFigure);
    //
    //         // generateFirstStep(CanvasManager.players[CanvasManager.turn]);
    //         //     changeIsFigureChosen(false);
    //         // }
    //     });
    // }


    // } else {
    //     endOfGame();
    // }
}

function chooseFigure() {
    if (CanvasManager.isActionChosen === true) {
        CanvasManager.canvas.addEventListener('click', function () {
            console.log('chooseFigure event listener');
            let cellCoordinates = CanvasManager.getClickedCell();
            let cellX = cellCoordinates.x;
            let cellY = cellCoordinates.y;
            console.log('x: ' + cellX + ', y: ' + cellY);
            CanvasManager.chosenFigure = CanvasManager.field[9 * cellY + cellX];
            changeIsFigureChosen(true);

            // switch (CanvasManager.chosenAction) {
            //     case 'move':
            //         console.log('move is chosen');
            //         changeIsActionChosen(false);
            //         CanvasManager.drawPossibleMoves(CanvasManager.chosenFigure);
            //         if (CanvasManager.isFigureChosen === true) {
            //             moveFigure(CanvasManager.chosenFigure);
            //         }
            //         // changeTurn();
            //
            //         // generateBattle();
            //         break;
            //     case 'attack':
            //         console.log('attack is chosen');
            //         attackFigure(CanvasManager.chosenFigure);
            //         // changeTurn();
            //
            //         // generateBattle();
            //         break;
            //     case 'heal':
            //         console.log('heal is chosen');
            //         healFigure(CanvasManager.chosenFigure);
            //         // changeTurn();
            //         //
            //         // generateBattle();
            //         break;
            //     default:
            //         break;
            // }

            console.log('test');
        });
    }
}

function moveFigure(figure) {

    // CanvasManager.drawPossibleMoves(figure);
    // if (CanvasManager.isFigureChosen === true) {
        console.log(figure);
        // console.log('move');
        let emptyCellX = figure.x;
        let emptyCellY = figure.y;
        // CanvasManager.canvas.addEventListener('contextmenu', function (e) {
        //     e.stopPropagation();
            console.log('moveFigure event listener');
            let cellCoordinates = CanvasManager.getClickedCell();
            let cellX = cellCoordinates.x;
            let cellY = cellCoordinates.y;
            CanvasManager.updateField({
                type: 'figure',
                figure: figure.figure,
                x: cellX,
                y: cellY,
                playerId: figure.playerId,
                attack: figure.attack,
                armour: figure.armour,
                health: figure.health,
                attackSpan: figure.attackSpan,
                speed: figure.speed,
                points: figure.points,
                id: figure.id,
            });
            CanvasManager.emptyCell(emptyCellX, emptyCellY);
            console.log(CanvasManager.field);
            CanvasManager.draw();
            changeTurn();
            changeIsFigureChosen(false);
            changeIsActionChosen(false);
            CanvasManager.chosenAction = '';
            CanvasManager.chosenFigure = '';

            generateBattle();
        // });
    // }


}

function attackFigure(figure) {
    console.log(figure);
    // console.log('attack');
    changeTurn();

    generateBattle();
}

function healFigure(figure) {
    console.log(figure);
    console.log('heal');
    changeTurn();

    generateBattle();
}

function endOfGame() {
    console.log('end');

}

function checkIfPositionIsEmpty(x, y) {
    return CanvasManager.field[9 * y + x] === 0;
}

function getPossiblePositions(figure) {
    let possiblePositions = [];
    switch (figure.figure) {
        case 'knight':
            if (checkIfPositionIsEmpty(figure.x, figure.y - 1)) {
                possiblePositions.push({x: figure.x, y: figure.y - 1});
            }
            if (checkIfPositionIsEmpty(figure.x, figure.y + 1)) {
                possiblePositions.push({x: figure.x, y: figure.y + 1});
            }
            if (checkIfPositionIsEmpty(figure.x - 1, figure.y)) {
                possiblePositions.push({x: figure.x - 1, y: figure.y});
            }
            if (checkIfPositionIsEmpty(figure.x + 1, figure.y)) {
                possiblePositions.push({x: figure.x + 1, y: figure.y});
            }
            break;
        case 'dwarf':
            if (checkIfPositionIsEmpty(figure.x, figure.y - 1)) {
                possiblePositions.push({x: figure.x, y: figure.y - 1});
                if (checkIfPositionIsEmpty(figure.x, figure.y - 2)) {
                    possiblePositions.push({x: figure.x, y: figure.y - 2});
                }
            }
            if (checkIfPositionIsEmpty(figure.x, figure.y + 1)) {
                possiblePositions.push({x: figure.x, y: figure.y + 1});
                if (checkIfPositionIsEmpty(figure.x, figure.y + 2)) {
                    possiblePositions.push({x: figure.x, y: figure.y + 2});
                }
            }
            if (checkIfPositionIsEmpty(figure.x - 1, figure.y)) {
                possiblePositions.push({x: figure.x - 1, y: figure.y});
                if (checkIfPositionIsEmpty(figure.x - 2, figure.y)) {
                    possiblePositions.push({x: figure.x - 2, y: figure.y});
                }
            }
            if (checkIfPositionIsEmpty(figure.x + 1, figure.y)) {
                possiblePositions.push({x: figure.x + 1, y: figure.y});
                if (checkIfPositionIsEmpty(figure.x + 2, figure.y)) {
                    possiblePositions.push({x: figure.x + 2, y: figure.y});
                }
            }
            break;
        case 'elf':
            if (checkIfPositionIsEmpty(figure.x, figure.y - 1)) {
                possiblePositions.push({x: figure.x, y: figure.y - 1});
                if (checkIfPositionIsEmpty(figure.x, figure.y - 2)) {
                    possiblePositions.push({x: figure.x, y: figure.y - 2});
                    if (checkIfPositionIsEmpty(figure.x, figure.y - 3)) {
                        possiblePositions.push({x: figure.x, y: figure.y - 3});
                    }
                    if (checkIfPositionIsEmpty(figure.x - 1, figure.y - 2)) {
                        possiblePositions.push({x: figure.x - 1, y: figure.y - 2});
                    }
                    if (checkIfPositionIsEmpty(figure.x + 1, figure.y - 2)) {
                        possiblePositions.push({x: figure.x + 1, y: figure.y - 2});
                    }
                }
                if (checkIfPositionIsEmpty(figure.x + 1, figure.y - 1)) {
                    possiblePositions.push({x: figure.x + 1, y: figure.y - 1});
                    if (checkIfPositionIsEmpty(figure.x + 2, figure.y - 1)) {
                        possiblePositions.push({x: figure.x + 2, y: figure.y - 1});
                    }
                }
                if (checkIfPositionIsEmpty(figure.x - 1, figure.y - 1)) {
                    possiblePositions.push({x: figure.x - 1, y: figure.y - 1});
                    if (checkIfPositionIsEmpty(figure.x - 2, figure.y - 1)) {
                        possiblePositions.push({x: figure.x - 2, y: figure.y - 1});
                    }
                }
            }
            if (checkIfPositionIsEmpty(figure.x, figure.y + 1)) {
                possiblePositions.push({x: figure.x, y: figure.y + 1});
                if (checkIfPositionIsEmpty(figure.x, figure.y + 2)) {
                    possiblePositions.push({x: figure.x, y: figure.y + 2});
                    if (checkIfPositionIsEmpty(figure.x, figure.y + 3)) {
                        possiblePositions.push({x: figure.x, y: figure.y + 3});
                    }
                    if (checkIfPositionIsEmpty(figure.x - 1, figure.y + 2)) {
                        possiblePositions.push({x: figure.x - 1, y: figure.y + 2});
                    }
                    if (checkIfPositionIsEmpty(figure.x + 1, figure.y + 2)) {
                        possiblePositions.push({x: figure.x + 1, y: figure.y + 2});
                    }
                }
                if (checkIfPositionIsEmpty(figure.x + 1, figure.y + 1)) {
                    possiblePositions.push({x: figure.x + 1, y: figure.y + 1});
                    if (checkIfPositionIsEmpty(figure.x + 2, figure.y + 1)) {
                        possiblePositions.push({x: figure.x + 2, y: figure.y + 1});
                    }
                }
                if (checkIfPositionIsEmpty(figure.x - 1, figure.y + 1)) {
                    possiblePositions.push({x: figure.x - 1, y: figure.y + 1});
                    if (checkIfPositionIsEmpty(figure.x - 2, figure.y + 1)) {
                        possiblePositions.push({x: figure.x - 2, y: figure.y + 1});
                    }
                }
            }
            if (checkIfPositionIsEmpty(figure.x - 1, figure.y)) {
                possiblePositions.push({x: figure.x - 1, y: figure.y});
                if (checkIfPositionIsEmpty(figure.x - 2, figure.y)) {
                    possiblePositions.push({x: figure.x - 2, y: figure.y});
                    if (checkIfPositionIsEmpty(figure.x - 3, figure.y)) {
                        possiblePositions.push({x: figure.x - 3, y: figure.y});
                    }
                    if (checkIfPositionIsEmpty(figure.x - 2, figure.y - 1)) {
                        possiblePositions.push({x: figure.x - 2, y: figure.y - 1});
                    }
                    if (checkIfPositionIsEmpty(figure.x - 2, figure.y + 1)) {
                        possiblePositions.push({x: figure.x - 2, y: figure.y + 1});
                    }
                }
                if (checkIfPositionIsEmpty(figure.x - 1, figure.y + 1)) {
                    possiblePositions.push({x: figure.x - 1, y: figure.y + 1});
                    if (checkIfPositionIsEmpty(figure.x - 1, figure.y + 2)) {
                        possiblePositions.push({x: figure.x - 1, y: figure.y + 2});
                    }
                }
                if (checkIfPositionIsEmpty(figure.x - 1, figure.y - 1)) {
                    possiblePositions.push({x: figure.x - 1, y: figure.y - 1});
                    if (checkIfPositionIsEmpty(figure.x - 1, figure.y - 2)) {
                        possiblePositions.push({x: figure.x - 1, y: figure.y - 2});
                    }
                }
            }
            if (checkIfPositionIsEmpty(figure.x + 1, figure.y)) {
                possiblePositions.push({x: figure.x + 1, y: figure.y});
                if (checkIfPositionIsEmpty(figure.x + 2, figure.y)) {
                    possiblePositions.push({x: figure.x + 2, y: figure.y});
                    if (checkIfPositionIsEmpty(figure.x + 3, figure.y)) {
                        possiblePositions.push({x: figure.x + 3, y: figure.y});
                    }
                    if (checkIfPositionIsEmpty(figure.x + 2, figure.y - 1)) {
                        possiblePositions.push({x: figure.x + 2, y: figure.y - 1});
                    }
                    if (checkIfPositionIsEmpty(figure.x + 2, figure.y + 1)) {
                        possiblePositions.push({x: figure.x + 2, y: figure.y + 1});
                    }
                }
                if (checkIfPositionIsEmpty(figure.x + 1, figure.y + 1)) {
                    possiblePositions.push({x: figure.x + 1, y: figure.y + 1});
                    if (checkIfPositionIsEmpty(figure.x + 1, figure.y + 2)) {
                        possiblePositions.push({x: figure.x + 1, y: figure.y + 2});
                    }
                }
                if (checkIfPositionIsEmpty(figure.x + 1, figure.y - 1)) {
                    possiblePositions.push({x: figure.x + 1, y: figure.y - 1});
                    if (checkIfPositionIsEmpty(figure.x + 1, figure.y - 2)) {
                        possiblePositions.push({x: figure.x + 1, y: figure.y - 2});
                    }
                }
            }
            break;
    }
    return possiblePositions;
}

function checkIfFigureBelongsToPlayer(x, y, player){
    let result = false;
    player.figures.forEach(function(figure){
        if(figure.x === x && figure.y === y){
            console.log(figure.x + ', ' + figure.y);
            console.log('true');
            result = true;
        // } else {
        //     return false;
        }
    });
    return result;
}