window.onload = function () {
    // let canvas = document.getElementById('gameCanvas');
    // let context = canvas.getContext('2d');
    // let tileWidth = 50;
    // let tileHeight = 50;
    CanvasManager.init("canvas");
    // CanvasManager.draw();
    //report the mouse position on click
    gameStart();
    // canvas.addEventListener("click", function () {
    //     let coordinates = CanvasManager.addFigure(2, 'dwarf');
    //     // let cellX = coordinates.x;
    //     // let cellY = coordinates.y;
    //     //
    //     // console.log(cellX + ', ' + cellY);
    // });
    // CanvasManager.generateObstacles();
    // function relMouseCoords(event){
    //     let totalOffsetX = 0;
    //     let totalOffsetY = 0;
    //     let canvasX = 0;
    //     let canvasY = 0;
    //     let currentElement = this;
    //     console.log(this);
    //
    //     do{
    //         totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
    //         totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    //     }
    //     while(currentElement = currentElement.offsetParent);
    //
    //     canvasX = event.pageX - totalOffsetX;
    //     canvasY = event.pageY - totalOffsetY;
    //
    //     return {x:canvasX, y:canvasY}
    // }
    // HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
    // let coords = canvas.relMouseCoords(event);
    // let canvasX = coords.x;
    // let canvasY = coords.y;
    //
    // console.log(canvasX);
    // console.log(canvasY);
    // draw(context, tileHeight, tileWidth);
//     // canvas.addEventListener('click', handleClick);
//
//     // function getMousePosition(context, e) {
//     //     let rect = context.getBoundingClientRect();
//     //     return {
//     //         x: e.clientX - rect.left,
//     //         y: e.clientY - rect.right
//     //     };
//     // }
//     //
//     // function handleClick (e){
//     //     let position = getMousePosition(canvas, e);
//     //     let posX = pos.x;
//     //     let posY = pos.y;
//     //
//     //     console.log(posX + ' ' + posY)
//     // }
//

//
//     for (let x = 0; x < 9; x++) {
//         for (let y = 0; y < 7; y++) {
//             context.moveTo(0, (tileHeight * y) - 0.5);
//             context.lineTo(450, (tileHeight * y) - 0.5);
//             context.stroke();
//
//             context.moveTo((tileWidth * x) - 0.5, 0);
//             context.lineTo((tileWidth * x) - 0.5, 350);
//             context.stroke();
//
//             if (y <= 1 || y >= 5) {
//                 if (x % 2 === y % 2) {
//                     context.fillStyle = 'black';
//                     context.fillRect(50 * x, 50 * y, 50, 50);
//                 } else {
//                     context.fillStyle = 'white';
//                     context.fillRect(50 * x, 50 * y, 50, 50);
//                 }
//             } else {
//                 context.fillStyle = 'white';
//                 context.fillRect(50 * x, 50 * y, 50, 50);
//             }
//
//         }
//     }
};

// import Canvas from 'js/Canvas.js';

// let mycanvas = document.createElement("canvas");
// mycanvas.id = "mycanvas";
// document.body.appendChild(mycanvas);