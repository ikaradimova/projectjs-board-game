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
    console.log('first step');
    // console.log(player);
    let figuresCount = elementCounter('figure');
    if (CanvasManager.isFirstStepFinished === false) {
        // return new Promise(function (resolve) {
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
        return new Promise(function (resolve) {
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

                        let figuresCount = elementCounter('figure');
                        if (figuresCount === 12) {
                            CanvasManager.isFirstStepFinished = true;
                        }
                        generateFirstStep(CanvasManager.players[CanvasManager.turn]);

                        changeIsFigureChosen(false);
                    }
                }));
            });
        })

        // console.log(CanvasManager.isFigureChosen);

    } else {
        generateBattle();
    }
    // resolve(generateBattle());
    // })

}


function generateBattle() {
    // CanvasManager.chosenAction = '';
    // CanvasManager.chosenFigure = '';
    CanvasManager.isMovementFinished = false;
    CanvasManager.isAttackFinished = false;

    console.log('battle');
    console.log('round: ' + CanvasManager.round);
    console.log(CanvasManager.players);
    console.log(CanvasManager.field);
    // if (CanvasManager.players[0].numberOfFigures > 0 || CanvasManager.players[1].numberOfFigures > 0) {
    console.log(CanvasManager.turn);
    let questionBox = document.querySelector(`#questionBoxPlayer${CanvasManager.turn + 1}`);
    // console.log(questionBox);
    questionBox.innerHTML = `<p>${CanvasManager.players[CanvasManager.turn].name}</p>`;
    questionBox.innerHTML += `<p>Points: ${CanvasManager.players[CanvasManager.turn].points}</p>`;
    questionBox.innerHTML += `<p>Choose action:</p>`;

    let buttonHolder = document.createElement('div');
    buttonHolder.id = `buttonHolderPlayer${CanvasManager.turn + 1}`;
    // console.log(buttonHolder);
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
        console.log(CanvasManager.chosenAction);
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
        // console.log(CanvasManager.players[CanvasManager.turn]);
        console.log('choose event listener');
        let cellCoordinates = CanvasManager.getClickedCell();
        let cellX = cellCoordinates.x;
        let cellY = cellCoordinates.y;
        console.log(`${cellX}, ${cellY}`);
        // console.log(cellX);
        // console.log(cellY);
        // console.log(CanvasManager.players[CanvasManager.turn]);
        // console.log(checkIfFigureBelongsToPlayer(cellX, cellY, CanvasManager.players[CanvasManager.turn]));

        console.log(CanvasManager.isActionChosen);
        console.log(checkIfFigureBelongsToPlayer(cellX, cellY, CanvasManager.players[CanvasManager.turn]));
        if (CanvasManager.isActionChosen === true &&
            checkIfFigureBelongsToPlayer(cellX, cellY, CanvasManager.players[CanvasManager.turn]) === true

        ) {
            console.log('x: ' + cellX + ', y: ' + cellY);
            CanvasManager.chosenFigure = CanvasManager.field[9 * cellY + cellX];
            console.log(CanvasManager.chosenFigure);
            changeIsFigureChosen(true);
            if (CanvasManager.chosenAction === 'move') {
                let possibleMoves = CanvasManager.drawPossibleMoves(CanvasManager.chosenFigure);
            }

            switch(CanvasManager.chosenAction){
                case 'move':
                case 'attack':
                    CanvasManager.canvas.addEventListener('contextmenu', function (e) {
                        e.preventDefault();
                        let cellCoordinates = CanvasManager.getClickedCell();
                        let rightClickedCellX = cellCoordinates.x;
                        let rightClickedCellY = cellCoordinates.y;
                        switch (CanvasManager.chosenAction) {
                            case 'move':
                                let possiblePositions = getPossiblePositions(CanvasManager.chosenFigure);
                                possiblePositions.forEach(function (possiblePosition) {
                                    if (possiblePosition.x === rightClickedCellX && possiblePosition.y === rightClickedCellY) {
                                        console.log('move is chosen');
                                        changeIsActionChosen(false);
                                        moveFigure(CanvasManager.chosenFigure, rightClickedCellX, rightClickedCellY);
                                    }
                                });


                                // changeTurn();

                                // generateBattle();
                                return;
                            // break;
                            case 'attack':
                                if (CanvasManager.chosenFigure.x === cellX && CanvasManager.chosenFigure.y === cellY) {
                                    console.log('attack is chosen');
                                    changeIsActionChosen(false);
                                    // console.log(`first click - ${cellX}, ${cellY}`);
                                    // console.log(`second click - ${rightClickedCellX}, ${rightClickedCellY}`);
                                    attackFigure(cellX, cellY, rightClickedCellX, rightClickedCellY);
                                }
                                // changeTurn();

                                // generateBattle();
                                return;
                            // case 'heal':
                            //     console.log('heal is chosen');
                            //     healFigure(CanvasManager.chosenFigure);
                            //     // changeTurn();
                            //     //
                            //     // generateBattle();
                            //     break;
                            default:
                                break;
                        }
                    });
                    break;
                case 'heal':
                    console.log('heal is chosen');
                    healFigure(CanvasManager.chosenFigure);
                    break;
                default:
                    break;
            }




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

function moveFigure(figure, x, y) {
    if (CanvasManager.isMovementFinished === false) {
        // CanvasManager.drawPossibleMoves(figure);
        // if (CanvasManager.isFigureChosen === true) {
        console.log(figure);
        // console.log('move');
        let emptyCellX = figure.x;
        let emptyCellY = figure.y;
        // CanvasManager.canvas.addEventListener('contextmenu', function (e) {
        //     e.stopPropagation();
        // console.log('moveFigure event listener');
        // let cellCoordinates = CanvasManager.getClickedCell();
        // let cellX = cellCoordinates.x;
        // let cellY = cellCoordinates.y;
        CanvasManager.updateField({
            type: 'figure',
            figure: figure.figure,
            x: x,
            y: y,
            playerId: figure.playerId,
            attack: figure.attack,
            armour: figure.armour,
            health: figure.health,
            attackSpan: figure.attackSpan,
            speed: figure.speed,
            id: figure.id,
        });
        CanvasManager.players[CanvasManager.turn].figures.forEach(function (playerFigure) {
            if (playerFigure.x === figure.x && playerFigure.y === figure.y) {
                playerFigure.x = x;
                playerFigure.y = y;
            }
        });
        CanvasManager.emptyCell(emptyCellX, emptyCellY);
        console.log(CanvasManager.field);
        CanvasManager.draw();
        changeTurn();
        changeIsFigureChosen(false);
        changeIsActionChosen(false);
        CanvasManager.chosenAction = '';
        CanvasManager.chosenFigure = '';

        CanvasManager.isMovementFinished = true;
        generateBattle();
        // });
        // }
    }

}

function attackFigure(attackingX, attackingY, attackedX, attackedY) {
    if (CanvasManager.isAttackFinished === false) {
        console.log('attack figure');
        let attackingFigure = getFigureByCoordinates(attackingX, attackingY);
        let attackedFigure = getFigureByCoordinates(attackedX, attackedY);
        if (checkIfAttackIsPossible(attackingX, attackingY, attackedX, attackedY) === true) {
            switch (attackedFigure.type) {
                case 'obstacle':
                    CanvasManager.emptyCell(attackedX, attackedY);
                    CanvasManager.draw();
                    break;
                case 'figure':
                    let questionBox = document.querySelector(`#questionBoxPlayer${CanvasManager.turn + 1}`);
                    questionBox.innerHTML += `<p>Attack possible</p>`;
                    let attackState = generateDiceSituation(attackedFigure);

                    switch (attackState) {
                        /** unsuccessful attack */
                        case 0:
                            questionBox.innerHTML += `<p>Attack unsuccessful</p>`;
                            break;
                        /** half successful attack */
                        case 1:
                            questionBox.innerHTML += `<p>Attack half successful</p>`;
                            generatePoints(attackingFigure, attackedFigure, 1);
                            break;
                        /** successful attack */
                        case 2:
                            questionBox.innerHTML += `<p>Attack successful</p>`;
                            generatePoints(attackingFigure, attackedFigure, 2);
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
            CanvasManager.isAttackFinished = true;
            setTimeout(function () {
                changeIsFigureChosen(false);
                changeIsActionChosen(false);
                CanvasManager.chosenAction = '';
                CanvasManager.chosenFigure = '';
                console.log('attack finished');
                changeTurn();
                CanvasManager.round++;
                generateBattle();
            }, 2000);


        } else {
            let questionBox = document.querySelector(`#questionBoxPlayer${CanvasManager.turn + 1}`);
            // console.log(questionBox);
            questionBox.innerHTML += `<p>Attack not possible</p>`;
            CanvasManager.isAttackFinished = true;
            setTimeout(function () {
                changeIsFigureChosen(false);
                changeIsActionChosen(false);
                CanvasManager.chosenAction = '';
                CanvasManager.chosenFigure = '';
                console.log('attack finished');
                generateBattle();
            }, 2000);
        }

    }
}

function healFigure(figure) {
    console.log(figure);
    console.log('heal');
    let firstDiceResult = randomGenerator(1, 6);
    console.log('first dice: ' + firstDiceResult);
    figure.health = (figure.health + firstDiceResult) > figure.maxHealth ? figure.maxHealth : figure.health + firstDiceResult;
    CanvasManager.players[CanvasManager.turn].figures.forEach(function(playerFigure){
       if(playerFigure.id === figure.id){
           playerFigure.health = figure.health;
       }
    });

    let secondDiceResult = randomGenerator(1, 6);
    console.log('second dice: ' + secondDiceResult);
    if(secondDiceResult % 2 === 0){
        changeTurn();
        CanvasManager.round++;
        generateBattle();
    } else {
        generateBattle();
    }



}

function endOfGame() {
    console.log('end');
}

function getFigureByCoordinates(x, y) {
    let figure = {};
    CanvasManager.field.forEach(function (cell) {
        if (cell.x === x && cell.y === y) {
            figure = cell;
        }
    });
    return figure;
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

function checkIfFigureBelongsToPlayer(x, y, player) {
    let result = false;
    player.figures.forEach(function (figure) {
        // console.log(figure);
        if (figure.x === x && figure.y === y) {
            result = true;
        }
    });
    return result;
}

function checkIfAttackIsPossible(attackingX, attackingY, attackedX, attackedY) {
    let posibility = false;
    let attackingFigure = getFigureByCoordinates(attackingX, attackingY);
    let attackedFigure = getFigureByCoordinates(attackedX, attackedY);
    switch (attackingFigure.figure) {
        case 'knight':
        case 'elf':
            if (Math.abs(attackingX - attackedX) === attackingFigure.attackSpan ||
                Math.abs(attackingY - attackedY) === attackingFigure.attackSpan
            ) {
                posibility = true;
            }
            break;
        case 'dwarf':
            if (Math.abs(attackingX - attackedX) === attackingFigure.attackSpan) {
                if (CanvasManager.field[attackingY * 9 + (attackingX + attackedX) / 2] === 0) {
                    posibility = true;
                }
            }
            if (Math.abs(attackingY - attackedY) === attackingFigure.attackSpan) {
                if (CanvasManager.field[((attackingY + attackedY) / 2) * 9 + attackingX] === 0) {
                    posibility = true;
                }
            }
            break;
        // case 'elf':
        //     break;
        default:
            break;
    }
    return posibility;
}

function generateDiceSituation(attackedFigure) {
    let battleState = 0;
    let diceSum = 0;
    for (let i = 0; i < 3; i++) {
        diceSum = randomGenerator(1, 6);
    }
    if (diceSum === attackedFigure.health) {
        battleState = 0;
    } else if (diceSum === 3) {
        battleState = 1;
    } else {
        battleState = 2;
    }
    console.log(diceSum);
    return battleState;
}

function generatePoints(attackingFigure, attackedFigure, state) {
    let wreck = 0;

    let losingPlayer = null;
    /** check which player's turn is, so the other one is the one losing figures */
    if (CanvasManager.turn === 0) {
        losingPlayer = CanvasManager.players[1];
    } else if (CanvasManager.turn === 1) {
        losingPlayer = CanvasManager.players[0];
    }

    switch (state) {
        case 1:
            wreck = attackingFigure.attack - attackedFigure.armour;
            attackedFigure.health = attackedFigure.health - (wreck / 2);
            CanvasManager.players[CanvasManager.turn].points += (wreck / 2);
            break;
        case 2:
            wreck = attackingFigure.attack - attackedFigure.armour;
            attackedFigure.health = attackedFigure.health - wreck;
            CanvasManager.players[CanvasManager.turn].points += wreck;
            break;
        default:
            break;
    }

    losingPlayer.figures.forEach(function(playerFigure){
        if(playerFigure.id === attackedFigure.id){
            playerFigure.health = attackedFigure.health;
        }
    });

    /** if health is below 0, figure is removed from the game */
    if (attackedFigure.health <= 0) {

        losingPlayer.figures.forEach(function (playerFigure, key) {
            if (playerFigure.id === attackedFigure.id) {
                losingPlayer.figures.splice(key, 1);
            }
        });
        losingPlayer.lostFigures.push(attackedFigure);
        CanvasManager.emptyCell(attackedFigure.x, attackedFigure.y);
        CanvasManager.draw();
    }
}