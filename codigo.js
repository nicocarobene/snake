"use strict"

//HTML ELEMENT
const board=document.getElementById("board");
const scroeBoard=document.getElementById("scoreBoard");
const startButton=document.getElementById("start");
const gameOverSign=document.getElementById("gameOver");

// GAME SETTING
const boardSize=10;
const gameSpeed=150;
const squareTypes={
    emptySquare:0,
    snakeSquare:1,
    foodSquare:2
}

const directions={
    ArrowUp:-10,
    ArrowDown:10,
    ArrowRight:1,
    ArrowLeft:-1
}

//Game Variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;


const drawSnake=()=>{
    snake.forEach(square=>drawSquare(square,'snakeSquare'))
}


//Rellena cada cuadrado del tablero
//@params
//square:posicion del cuadrado,
//type: tipo de cuadrado (emptySquare, snajeSquare, foodSquare);
const  drawSquare=(square, type)=>{
    // square= '00' y type = 'EmptySquare'
    //square llega como un string "row column" con split los separamos en un array.
    const [row, column] = square.split("");
    boardSquares[row][column]=squareTypes[type];
// boardSquare contiene el arreglo bidimensional, en la coordenada colocara el valor de squareType dependiendo el tipo que se le indique
    const squareElement = document.getElementById(square);
    squareElement.setAttribute("class",`square ${type}`);

    if(type === 'emptySquare'){
        emptySquares.push(square);
        //push agregaba un elemento al final del array
    }else{
        if(emptySquares.indexOf(square) !== -1){
            emptySquares.splice(emptySquares.indexOf(square),1)
    // slice devuelve una copia del array
    // splice reemplaza el contenido de un array por otro
        }
    }
}

const gameOver=()=>{
    gameOverSign.style.display ="block";
    clearInterval(moveInterval);
    startButton.disabled=false;
}   

const moveSnake=()=>{
    const newSquare = String( 
        Number(snake[snake.length-1]) + directions[direction] )
        .padStart(2,"0");
    
    const [row,column]= newSquare.split("");


    if(newSquare < 0 ||
        //esto indica si se choco con la pared superior ya que no puede haber un row -1
       newSquare > boardSize * boardSize ||
       //indica si choco con el borde inferior ya que no puede haber un new square mayor a 99;
       (direction === 'ArrowRight' && column == 0) ||
       //si se pasa de la column 9 pasa a 0
       (direction === 'ArrowLeft' && column == 9 ||
       //si se pasa de la column 0 pasa a 9
       boardSquares[row][column] === squareTypes.snakeSquare) ){
    //esto nos indica si se come a si misma 
        gameOver();

       }else{
            snake.push(newSquare);
            if(boardSquares[row][column] === squareTypes.foodSquare){
                addFood();
    //con esto creamos un nuevo alimento si la nueva celda agregada a snake es un food
            }else{
                const emptySquare =snake.shift();
                drawSquare(emptySquare, 'emptySquare')
            }
            drawSnake();
       }
    
}

const addFood =()=>{
    score++;
    updateScore();
    createRandomFood();
}


const setDirection = newDirection =>{
    direction =newDirection;
} 

const directionEvent= key =>{
    switch(key.code){
        case 'ArrowUp': 
            setDirection != 'ArrowDown' && setDirection(key.code)
            break;

        case 'ArrowDown':
            setDirection != 'ArrowUp' && setDirection(key.code)
            break;

        case 'ArrowRight': 
            setDirection != 'ArrowLeft' && setDirection(key.code)
            break;

        case 'ArrowLeft':
            setDirection != 'ArrowRight' && setDirection(key.code)
            break;

    }

}




const updateScore=()=>{
    scroeBoard.innerText=score
}

const createRandomFood=()=>{

    const randomEmptySquare= emptySquares[Math.floor(Math.random()* emptySquares.length)];
   
        
    drawSquare(randomEmptySquare,'foodSquare')
    
}

const createBoard=()=>{
    boardSquares.forEach((row,rowIndex) => {
            row.forEach((column,columnIndex)=>{
                const squareValue= `${rowIndex}${columnIndex}`;
                const squareElement= document.createElement("div");
                squareElement.setAttribute("class","square emptySquare");
                squareElement.setAttribute("id",squareValue)
                board.appendChild(squareElement);
                emptySquares.push(squareValue)
            })
    });
}

const setGame=()=>{
    snake=['00','01','02','03'];
    score=snake.length;
    direction='ArrowRight';
    boardSquares= Array.from(Array(boardSize),()=>new Array(boardSize).fill(squareTypes.emptySquare))
    board.innerHTML="";
    emptySquares=[];
    createBoard();
}

const startGame=()=>{
    setGame();  
    gameOverSign.style.display="none";
    startButton.disabled= true; 
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener("keydown",directionEvent);
    moveInterval= setInterval( () => moveSnake() ,gameSpeed)
}

startButton.addEventListener("click",startGame)