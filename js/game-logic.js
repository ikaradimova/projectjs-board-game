/**
 * Functionality for adding figures in field
 * @param player
 * @param figureType
 */
function addFigure(player, figureType) {
    let figuresCount = elementCounter('figure');
    /** No more than 12 figures are permitted */
    if (figuresCount === 12) {
        return;
    }
    /** New figure coordinates */
    let cellCoordinates = CanvasManager.getClickedCell();
    let cellX = cellCoordinates.x;
    let cellY = cellCoordinates.y;

    let cellText;
    let figure;
    /** New figures and cell text */
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

    /** field span depending on the player */
    let yStart, yEnd;
    if (player.id === 1) {
        yStart = 0;
        yEnd = 1;
    } else if (player.id === 2) {
        yStart = 5;
        yEnd = 6
    }

    /** adding figures */
    for (let x = 0; x < 9; x++) {
        for (let y = yStart; y <= yEnd; y++) {
            if (cellX === x && cellY === y) {
                /** check if cell is empty */
                if (CanvasManager.field[9 * y + x] === 0) {
                    /** creating figure */
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
                    /** field update */
                    CanvasManager.updateField(currentFigure);

                    /** player update */
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

                    /** drawing figure */
                    CanvasManager.drawFigure(player, cellText, x, y);
                    /** changing turn */
                    changeTurn();
                }
            }
        }
    }
}

/**
 * Game start
 */
function gameStart() {
    generateFirstStep(CanvasManager.players[CanvasManager.turn]);
}

/**
 * Function for changing turns
 */
function changeTurn() {
    if (CanvasManager.turn === 0) {
        CanvasManager.turn = 1;
    } else if (CanvasManager.turn === 1) {
        CanvasManager.turn = 0;
    }
}

/**
 * Function for changing isFigureChosen state
 * @param state
 */
function changeIsFigureChosen(state) {
    CanvasManager.isFigureChosen = state;
}

/**
 * Function for changing isActionChosen state
 * @param state
 */
function changeIsActionChosen(state) {
    CanvasManager.isActionChosen = state;
}

/**
 * Function for counting elements on field
 * @param typeOfElement - (obstacle/figure)
 * @returns {number}
 */
function elementCounter(typeOfElement) {
    let elementCount = 0;
    CanvasManager.field.forEach(function (cell) {
        if (cell.type === typeOfElement) {
            elementCount++;
        }
    });
    return elementCount;
}

/**
 * Random generator
 * @param min - included
 * @param max - included
 * @returns {number}
 */
function randomGenerator(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(min + Math.random() * (max + 1 - min));
}

/**
 * Function generating game's first step - placing figures on canvas
 * @param player
 * @returns
 */
function generateFirstStep(player) {
    let figuresCount = elementCounter('figure');
    /** checks if first step has finished */
    if (CanvasManager.isFirstStepFinished === false) {
        let questionBox = document.querySelector(`#questionBoxPlayer${CanvasManager.turn + 1}`);
        questionBox.innerHTML = `<p>${CanvasManager.players[CanvasManager.turn].name}</p>`;
        questionBox.innerHTML += `<p>Choose figure:</p>`;

        let buttonHolder = document.createElement('div');
        buttonHolder.id = `buttonHolderPlayer${CanvasManager.turn + 1}`;
        questionBox.appendChild(buttonHolder);
        /** generating buttons with figures, if figure is used up no button for this figure will show */
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
            /** checks what type of figure has been clicked */
            buttonHolder.addEventListener('click', function (e) {

                /** gets chosen figure type */
                CanvasManager.chosenFigure = e.target.innerText;
                changeIsFigureChosen(true);
                buttonHolder.className = 'hide';

                /** drawing all possible moves for selected figure */
                CanvasManager.drawPossibleFirstMoves(CanvasManager.players[CanvasManager.turn]);

                resolve(CanvasManager.canvas.addEventListener('click', function () {
                    if (CanvasManager.isFigureChosen === true) {
                        CanvasManager.draw();

                        /** adding figure */
                        let coordinates = addFigure(CanvasManager.players[CanvasManager.turn], CanvasManager.chosenFigure);

                        /** check if step one is finished depending on figures count */
                        let figuresCount = elementCounter('figure');
                        if (figuresCount === 12) {
                            CanvasManager.isFirstStepFinished = true;
                        }
                        /** first step again */
                        generateFirstStep(CanvasManager.players[CanvasManager.turn]);

                        changeIsFigureChosen(false);
                    }
                }));
            });
        })

    } else {
        /** if step one has finished generate step two - battle */
        generateBattle();
    }
}

/**
 * Function generating game's second step - battle between players
 */
function generateBattle() {
    CanvasManager.isMovementFinished = false;
    CanvasManager.isAttackFinished = false;
    CanvasManager.isHealingFinished = false;

    let activePlayer = null;
    let inactivePlayer = null;
    /** check which player's turn is */
    if (CanvasManager.turn === 0) {
        activePlayer = CanvasManager.players[0];
        inactivePlayer = CanvasManager.players[1];
    } else if (CanvasManager.turn === 1) {
        activePlayer = CanvasManager.players[1];
        inactivePlayer = CanvasManager.players[0];
    }
    if (activePlayer.figures.length !== 0) {
        let questionBoxActive = document.querySelector(`#questionBoxPlayer${activePlayer.id}`);
        questionBoxActive.innerHTML = `<p>${activePlayer.name}</p>`;
        questionBoxActive.innerHTML += `<p>Points: ${activePlayer.points}</p>`;
        questionBoxActive.innerHTML += `<p>Choose action:</p>`;

        let questionBoxInactive = document.querySelector(`#questionBoxPlayer${inactivePlayer.id}`);
        questionBoxInactive.innerHTML = `<p>${inactivePlayer.name}</p>`;
        questionBoxInactive.innerHTML += `<p>Points: ${inactivePlayer.points}</p>`;

        let buttonHolder = document.createElement('div');
        buttonHolder.id = `buttonHolderPlayer${CanvasManager.turn + 1}`;
        questionBoxActive.appendChild(buttonHolder);

        /** generating buttons for actions */
        CanvasManager.typeOfActions.forEach(function (type) {
            let button = document.createElement('button');
            button.appendChild(document.createTextNode(type));
            buttonHolder.appendChild(button);
        });

        /** choose action */
        buttonHolder.addEventListener('click', function (e) {

            CanvasManager.chosenAction = e.target.innerText;
            changeIsActionChosen(true);
            buttonHolder.className = 'hide';
        });

        /** choose figure */
        CanvasManager.canvas.addEventListener('click', function (e) {
            let cellCoordinates = CanvasManager.getClickedCell();
            let cellX = cellCoordinates.x;
            let cellY = cellCoordinates.y;

            /** check if action is chosen and if figure chosen is in possesion of the active player */
            if (CanvasManager.isActionChosen === true &&
                checkIfFigureBelongsToPlayer(cellX, cellY, CanvasManager.players[CanvasManager.turn]) === true

            ) {
                CanvasManager.chosenFigure = CanvasManager.field[9 * cellY + cellX];
                changeIsFigureChosen(true);

                /** if action is 'move' show possible moves */
                if (CanvasManager.chosenAction === 'move') {
                    let possibleMoves = CanvasManager.drawPossibleMoves(CanvasManager.chosenFigure);
                }

                switch (CanvasManager.chosenAction) {
                    case 'move':
                    case 'attack':
                        /** if 'move' action, right click on field, chosen figure goes to the field
                         *  if 'attack' action, right click on another figure, then first figure attacks the second one
                         **/
                        CanvasManager.canvas.addEventListener('contextmenu', function (e) {
                            e.preventDefault();
                            let cellCoordinates = CanvasManager.getClickedCell();
                            let rightClickedCellX = cellCoordinates.x;
                            let rightClickedCellY = cellCoordinates.y;
                            switch (CanvasManager.chosenAction) {
                                case 'move':
                                    /** gets possible positions */
                                    let possiblePositions = getPossiblePositions(CanvasManager.chosenFigure);
                                    possiblePositions.forEach(function (possiblePosition) {
                                        /** move only permitted when field is in possible positions */
                                        if (possiblePosition.x === rightClickedCellX && possiblePosition.y === rightClickedCellY) {
                                            changeIsActionChosen(false);
                                            /** triggers figure movement */
                                            moveFigure(CanvasManager.chosenFigure, rightClickedCellX, rightClickedCellY);
                                        }
                                    });
                                    return;
                                case 'attack':
                                    if (CanvasManager.chosenFigure.x === cellX && CanvasManager.chosenFigure.y === cellY) {
                                        changeIsActionChosen(false);
                                        /** triggers attack */
                                        attackFigure(cellX, cellY, rightClickedCellX, rightClickedCellY);
                                    }
                                    return;
                                default:
                                    break;
                            }
                        });
                        break;
                    case 'heal':
                        changeIsActionChosen(false);
                        /** triggers healing functionality */
                        healFigure(CanvasManager.chosenFigure);
                        break;
                    default:
                        break;
                }
            }
        });
    } else {
        endOfGame();
    }
}

/**
 * Function for moving figures
 * @param figure
 * @param x
 * @param y
 */
function moveFigure(figure, x, y) {
    /** check if no other movements running */
    if (CanvasManager.isMovementFinished === false) {
        let emptyCellX = figure.x;
        let emptyCellY = figure.y;
        /** update field with new coordinates */
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
        /** update player with new coordinates */
        CanvasManager.players[CanvasManager.turn].figures.forEach(function (playerFigure) {
            if (playerFigure.x === figure.x && playerFigure.y === figure.y) {
                playerFigure.x = x;
                playerFigure.y = y;
            }
        });
        /** empty old cell */
        CanvasManager.emptyCell(emptyCellX, emptyCellY);
        /** redraw updated canvas */
        CanvasManager.draw();
        /** change turn */
        changeTurn();
        changeIsFigureChosen(false);
        changeIsActionChosen(false);
        CanvasManager.chosenAction = '';
        CanvasManager.chosenFigure = '';

        CanvasManager.isMovementFinished = true;
        /** generate new battle */
        generateBattle();
    }
}

/**
 * Attack functionality
 * @param attackingX
 * @param attackingY
 * @param attackedX
 * @param attackedY
 */
function attackFigure(attackingX, attackingY, attackedX, attackedY) {
    /** check if no other attacks are running */
    if (CanvasManager.isAttackFinished === false) {
        /** gets attacking and attacked figures by their coordinates */
        let attackingFigure = getFigureByCoordinates(attackingX, attackingY);
        let attackedFigure = getFigureByCoordinates(attackedX, attackedY);
        /** check if attack is possible */
        if (checkIfAttackIsPossible(attackingX, attackingY, attackedX, attackedY) === true) {
            /** check what object is being attacked */
            switch (attackedFigure.type) {
                /** if obstacle is being attack it is destroyed and stop existing on field */
                case 'obstacle':
                    CanvasManager.emptyCell(attackedX, attackedY);
                    CanvasManager.draw();
                    break;
                /** if figure is being attacked it checks the state of the attack */
                case 'figure':
                    let questionBox = document.querySelector(`#questionBoxPlayer${CanvasManager.turn + 1}`);
                    questionBox.innerHTML += `<p>Attack possible</p>`;
                    /** generating attack state (unsuccessful/half successful/successful) */
                    let attackState = generateDiceSituation(attackedFigure);

                    switch (attackState) {
                        /** unsuccessful attack */
                        case 0:
                            questionBox.innerHTML += `<p>Attack unsuccessful</p>`;
                            break;
                        /** half successful attack */
                        case 1:
                            questionBox.innerHTML += `<p>Attack half successful</p>`;
                            /** generating points */
                            generatePoints(attackingFigure, attackedFigure, 1);
                            break;
                        /** successful attack */
                        case 2:
                            questionBox.innerHTML += `<p>Attack successful</p>`;
                            /** generating points */
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
                /** change turn */
                changeTurn();
                /** increase round */
                CanvasManager.round++;
                /** generate battle */
                generateBattle();
            }, 2000);
        } else {
            /** if attack is not possible */
            let questionBox = document.querySelector(`#questionBoxPlayer${CanvasManager.turn + 1}`);
            questionBox.innerHTML += `<p>Attack not possible</p>`;
            CanvasManager.isAttackFinished = true;
            setTimeout(function () {
                questionBox.innerHTML += '';
                changeIsFigureChosen(false);
                changeIsActionChosen(false);
                CanvasManager.chosenAction = '';
                CanvasManager.chosenFigure = '';
                /** generate battle without changing the turn */
                generateBattle();
            }, 2000);
        }
    }
}

/**
 * Function for healing figures
 * @param figure
 */
function healFigure(figure) {
    /** check if no other healing are running */
    if (CanvasManager.isHealingFinished === false) {
        /** generate first dice result */
        let firstDiceResult = randomGenerator(1, 6);
        /** update health */
        let newHealth = figure.health + firstDiceResult;
        if (newHealth > figure.maxHealth) {
            figure.health = figure.maxHealth;
        } else {
            figure.health = newHealth;
        }
        CanvasManager.players[CanvasManager.turn].figures.forEach(function (playerFigure) {
            if (playerFigure.id === figure.id) {
                playerFigure.health = newHealth;
            }
        });

        /** generate second dice result, responsible for player receiving bonus turn */
        let secondDiceResult = randomGenerator(1, 6);
        /** if result is even, no bonus turn */
        if (secondDiceResult % 2 === 0) {
            CanvasManager.isHealingFinished = true;
            /** increase round */
            CanvasManager.round++;
            /** change turn */
            changeTurn();
            changeIsFigureChosen(false);
            changeIsActionChosen(false);
            CanvasManager.chosenAction = '';
            CanvasManager.chosenFigure = '';
            /** generate battle */
            generateBattle();
        } else {
            /** if result is odd, player wins bonus turn */
            CanvasManager.isHealingFinished = true;
            changeIsFigureChosen(false);
            // changeIsActionChosen(false);
            CanvasManager.chosenAction = '';
            CanvasManager.chosenFigure = '';
            /** generate battle without changing the turn */
            generateBattle();
        }
    }
}


function endOfGame() {
    let activePlayer = null;
    let inactivePlayer = null;
    /** check which player's turn is */
    if (CanvasManager.turn === 0) {
        activePlayer = CanvasManager.players[0];
        inactivePlayer = CanvasManager.players[1];
    } else if (CanvasManager.turn === 1) {
        activePlayer = CanvasManager.players[1];
        inactivePlayer = CanvasManager.players[0];
    }
    let questionBoxActive = document.querySelector(`#questionBoxPlayer${activePlayer.id}`);
    questionBoxActive.innerHTML = `<p>${activePlayer.name}</p>`;
    questionBoxActive.innerHTML += `<p>Points: ${activePlayer.points}</p>`;
    questionBoxActive.innerHTML += `<p>Rounds: ${CanvasManager.round}</p>`;
    questionBoxActive.innerHTML += `<p>Lost figures: </p>`;
    activePlayer.lostFigures.forEach(function (lostFigure) {
        questionBoxActive.innerHTML += `<p>${lostFigure.figure}, id: ${lostFigure.id}</p>`;
    });

    let questionBoxInactive = document.querySelector(`#questionBoxPlayer${inactivePlayer.id}`);
    questionBoxInactive.innerHTML = `<p>${inactivePlayer.name}</p>`;
    questionBoxInactive.innerHTML += `<p>Points: ${inactivePlayer.points}</p>`;
    questionBoxInactive.innerHTML += `<p>Rounds: ${CanvasManager.round}</p>`;
    questionBoxInactive.innerHTML += `<p>Lost figures: </p>`;
    inactivePlayer.lostFigures.forEach(function (lostFigure) {
        questionBoxInactive.innerHTML += `<p>${lostFigure.figure}, id: ${lostFigure.id}</p>`;
    });

    let infoMessage = document.getElementById('infoBox');
    infoMessage.className = 'hide';

    let endOfGameMessageHolder = document.getElementById('endOfGameMessage');
    endOfGameMessageHolder.className = '';
    endOfGameMessageHolder.innerHTML += `<p>Winner: ${inactivePlayer.name}</p>`;

    let startNewGameButton = document.getElementById('startNewGame');
    startNewGameButton.className = '';
    startNewGameButton.addEventListener('click', function (e) {
        window.location.reload();
    });

    CanvasManager.canvas.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
}

/**
 * Function for getting player from its coordinates
 * @param x
 * @param y
 * @returns {object} - figure
 */
function getFigureByCoordinates(x, y) {
    let figure = {};
    CanvasManager.field.forEach(function (cell) {
        if (cell.x === x && cell.y === y) {
            figure = cell;
        }
    });
    return figure;
}

/**
 * Function that checks if cell is empty
 * @param x
 * @param y
 * @returns {boolean}
 */
function checkIfPositionIsEmpty(x, y) {
    return CanvasManager.field[9 * y + x] === 0;
}

/**
 * Function for getting possible positions for figure
 * @param figure
 * @returns {Array}
 */
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

/**
 * Function for checking if figure belongs to player
 * @param x
 * @param y
 * @param player
 * @returns {boolean}
 */
function checkIfFigureBelongsToPlayer(x, y, player) {
    let result = false;
    player.figures.forEach(function (figure) {
        if (figure.x === x && figure.y === y) {
            result = true;
        }
    });
    return result;
}

/**
 * Function for checking if attack is possible depending of attacking figures attack span
 * @param attackingX
 * @param attackingY
 * @param attackedX
 * @param attackedY
 * @returns {boolean}
 */
function checkIfAttackIsPossible(attackingX, attackingY, attackedX, attackedY) {
    let possibility = false;
    /** gets attacking and attacked figure by their coordinates */
    let attackingFigure = getFigureByCoordinates(attackingX, attackingY);
    let attackedFigure = getFigureByCoordinates(attackedX, attackedY);
    switch (attackingFigure.figure) {
        case 'knight':
        case 'elf':
            /** no check for obstacles as knights have attack span equal to 1 and elves can attack through obstacles */
            if (Math.abs(attackingX - attackedX) === attackingFigure.attackSpan ||
                Math.abs(attackingY - attackedY) === attackingFigure.attackSpan
            ) {
                possibility = true;
            }
            break;
        case 'dwarf':
            /** check for attack span*/
            if (Math.abs(attackingX - attackedX) === attackingFigure.attackSpan) {
                if (CanvasManager.field[attackingY * 9 + (attackingX + attackedX) / 2] === 0) {
                    possibility = true;
                }
            }
            /** check for obstacles on the way */
            if (Math.abs(attackingY - attackedY) === attackingFigure.attackSpan) {
                if (CanvasManager.field[((attackingY + attackedY) / 2) * 9 + attackingX] === 0) {
                    possibility = true;
                }
            }
            break;
        default:
            break;
    }
    return possibility;
}

/**
 * Function for calculating attack's state depending on dice result
 * @param attackedFigure
 * @returns {number}
 */
function generateDiceSituation(attackedFigure) {
    let battleState = 0;
    let diceSum = 0;
    /** generates three dice results and gets their sum */
    for (let i = 0; i < 3; i++) {
        diceSum = randomGenerator(1, 6);
    }
    /** check conditions */
    if (diceSum === attackedFigure.health) {
        battleState = 0;
    } else if (diceSum === 3) {
        battleState = 1;
    } else {
        battleState = 2;
    }
    return battleState;
}

/**
 * Function for generating points to attacking player and getting health from attacked player's figure
 * @param attackingFigure
 * @param attackedFigure
 * @param state
 */
function generatePoints(attackingFigure, attackedFigure, state) {
    let wreck = 0;

    let losingPlayer = null;
    /** check which player's turn is, so the other one is the one losing figures */
    if (CanvasManager.turn === 0) {
        losingPlayer = CanvasManager.players[1];
    } else if (CanvasManager.turn === 1) {
        losingPlayer = CanvasManager.players[0];
    }

    /** figure health update */
    switch (state) {
        /** half success*/
        case 1:
            wreck = attackingFigure.attack - attackedFigure.armour;
            attackedFigure.health = attackedFigure.health - (wreck / 2);
            CanvasManager.players[CanvasManager.turn].points += (wreck / 2);
            break;
        /** full success */
        case 2:
            wreck = attackingFigure.attack - attackedFigure.armour;
            attackedFigure.health = attackedFigure.health - wreck;
            CanvasManager.players[CanvasManager.turn].points += wreck;
            break;
        default:
            break;
    }

    /** player's figure health update */
    losingPlayer.figures.forEach(function (playerFigure) {
        if (playerFigure.id === attackedFigure.id) {
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