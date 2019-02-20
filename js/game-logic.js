






function gameStart() {
    // console.log(CanvasManager.players);
    // let questionBox = document.querySelector('#questionBox');
    // let turn = 0;
    // let player1 = new Player('Player 1');
    // let player2 = new Player('Player 2');
    // let activePlayer = player1;

    // console.log(questionBox);
    // console.log(player1);
    // console.log(player2);
    // while(CanvasManager.figures < 6){
    // if (turn % 2 === 0) {
    //     activePlayer = player1;
    // } else {
    //     activePlayer = player2;
    // }
    // console.log(activePlayer);

    // do {
    //     if (turn % 2 === 0) {
    //         activePlayer = player1;
    //     } else {
    //         activePlayer = player2;
    //     }
    //

    // if (CanvasManager.figures.length === 12) {
    //     return;
    // }
    let questionBox = document.querySelector('#questionBox');
    // questionBox.innerHTML = `<p>${CanvasManager.players[CanvasManager.turn].name}, choose figure:</p>`;
    CanvasManager.generateFirstStep(CanvasManager.players[CanvasManager.turn]);
    // let par = document.createElement('p');
    // par.appendChild(document.createTextNode(`${CanvasManager.players[CanvasManager.turn].name}, choose figure:`));
    // questionBox.appendChild(par);
    // let questionBox = document.querySelector('#questionBox');
    let buttons = document.querySelectorAll('button');
    // // console.log(buttons);
    let chosenFigure;
    // buttons.forEach(function (button) {
    questionBox.addEventListener('click', function (e) {
        console.log(e.target.innerText);
        // console.log(button.innerText);
        chosenFigure = e.target.innerText;
        changeIsFigureChosen(true);
        // CanvasManager.canvas.addEventListener('click', function () {
        //     let coordinates = CanvasManager.addFigure(CanvasManager.players[CanvasManager.turn], chosenFigure);
        //     CanvasManager.generateFirstStep(CanvasManager.players[CanvasManager.turn]);
        //     CanvasManager.changeIsFigureChosen();
        //     // let cellX = coordinates.x;
        //     // let cellY = coordinates.y;
        //     //
        //     // console.log(cellX + ', ' + cellY);
        //     // CanvasManager.changeTurn();
        // });
        // console.log(chosenFigure);
        // CanvasManager.isFigureChosen = true;

        // CanvasManager.canvas.addEventListener('click', function () {
        //     let coordinates = CanvasManager.addFigure(CanvasManager.players[CanvasManager.turn],  chosenFigure);
        //     // let cellX = coordinates.x;
        //     // let cellY = coordinates.y;
        //     //
        //     // console.log(cellX + ', ' + cellY);
        //     CanvasManager.changeTurn();
        // });
        // return chosenFigure;
    });
    // });

    // console.log(isFigureChosen);
    // if(CanvasManager.isFigureChosen){

    console.log(CanvasManager.isFigureChosen);
    //test

    CanvasManager.canvas.addEventListener('click', function () {
        if(CanvasManager.isFigureChosen === true){
            let coordinates = CanvasManager.addFigure(CanvasManager.players[CanvasManager.turn], chosenFigure);
            CanvasManager.generateFirstStep(CanvasManager.players[CanvasManager.turn]);
            changeIsFigureChosen(false);
            // let cellX = coordinates.x;
            // let cellY = coordinates.y;
            //
            // console.log(cellX + ', ' + cellY);
            // CanvasManager.changeTurn();
        }

    });


    // }

    //
    //     // console.log(chosenFigure);
    //
    //     console.log(turn);
    //     console.log(activePlayer);
    //     console.log(CanvasManager.figures.length);
    //     // return turn++;
    //     return;
    // } while (CanvasManager.figures.length < 6);

    // questionBox.innerHTML = `<p>${activePlayer.name}, choose figure:</p>`;
    // let formItem = document.createElement('form');
    // questionBox.appendChild(formItem);
    // if (activePlayer.dwarfs.length < activePlayer.numberOfDwarfs) {
    //
    //     let optionElement = document.createElement('input');
    //     optionElement.setAttribute("type", "radio");
    //     optionElement.setAttribute("name", "figure");
    //     optionElement.setAttribute("value", "dwarf");
    //     optionElement.innerHTML = 'dwarf';
    //     // let label = document.createElement('label');
    //     // label.appendChild(document.createTextNode('dwarf'));
    //     // optionElement.appendChild(label);
    //     // optionElement.appendChild(document.createTextNode('dwarf'));
    //     formItem.appendChild(optionElement);
    //     // selectItem.appendChild(document.create('option'));
    // }
    // }
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
