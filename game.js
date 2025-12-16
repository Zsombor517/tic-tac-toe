import promptSync from 'prompt-sync';
const prompt = promptSync({sigint: true});

let board = getEmptyBoard();
let playerTurn = 'x';
let aiEnabled;
while (true){
    console.log('1. Two player mode\n2.Play against ai')
    const input = prompt(); 
    if (input == 1){
        break;
    }
    else if (input == 2){
        aiEnabled = true;
        break;
    }
    console.log("Enter either 1 or 2");
}
displayBoard(board);

while (true){
    let coords;
    if (aiEnabled && playerTurn == 'o'){
        coords = getRandomAiCoords(board);
        board[coords[0]][coords[1]] = 'o';
        playerTurn = 'x';
    }
    
    else if (playerTurn == 'x'){
        coords = getHumanCoordinates(board, playerTurn);
        if (!coords) {break;}
        board[coords[0]][coords[1]] = 'x';
        playerTurn = 'o';
    }
    else if (!aiEnabled && playerTurn == 'o'){
        coords = getHumanCoordinates(board, playerTurn);
        if (!coords) {break;}
        board[coords[0]][coords[1]] = 'o';
        playerTurn = 'x';
    }
    displayBoard(board);
    if (isBoardFull(board)){
        console.log('Tie!');
        break;
    }
    if (getWinner(board)){
        console.log(`The winners is ${getWinner(board)}`);
        break;
    }
}

function getEmptyBoard(){
    return [['.', '.', '.'], ['.', '.', '.'], ['.', '.', '.']];
}

function displayBoard(board){
    console.log('  1 2 3');
    let row = 'A ';
    for (const column of board[0]){
        row += `${column}|`
    }
    console.log(row);

    row = 'B ';
    for (const column of board[1]){
        row += `${column}|`
    }
    console.log('----+---+---\n' + row);

    row = 'C ';
    for (const column of board[2]){
        row += `${column}|`
    }
    console.log('----+---+---\n' + row);
}

function getHumanCoordinates(board, playerTurn){
    const rows = {
        a: 1,
        b: 2,
        c: 3
    }
    while (true){
        let coords = prompt(`Player ${playerTurn} (Eg. a1): `);
        if (coords.toLowerCase() == 'quit'){
            return false;
        }
        else if (!/^[a-cA-C1-3]+$/.test(coords)){
            console.log('Invalid move!');
        }
        else{
            coords = [rows[coords[0].toLowerCase()] - 1, parseInt(coords[1]) - 1];
            if (board[coords[0]][coords[1]] != '.'){
                console.log('Space already occupied!');
            }
            else{ return coords; }
        }    
    }   
}

function isBoardFull(board){
    let fullRowCounter = 0;
    for (const row of board){
        if (!row.includes('.')){
            fullRowCounter ++;
        }
    }
    if (fullRowCounter == 3){
        return true;
    }
    return false;
}

function getWinner(board){
    //three in a row
    for (const row of board){
        if (!row.includes('.') && !row.includes('o')){
            return 'x';
        }
        else if (!row.includes('.') && !row.includes('x')){
            return 'o';
        }
    }
    //three in a column

    let xCount = 0;
    let oCount = 0;
    for (let i = 0; i <= board.length; i++){
        for (const row of board){
            if (row[i] == 'x'){
                xCount ++;
            }
            else if (row[i] == 'o'){
                oCount ++;
            }
        }

        if (xCount == 3){
            return 'x';
        }
        else if (oCount == 3){
            return 'o';
        }
        oCount = 0;
        xCount = 0;
    }
    //diagonal
    const topLeft = board[0][0];
    if (board[1][1] == topLeft && board[2][2] == topLeft && topLeft != '.'){
        return topLeft;
    }
    const topRight = board[0][2];
    if (board[1][1] == topRight && board[2][0] == topRight && topRight != '.'){
        return topRight;
    }
    return undefined;
}
function getRandomAiCoords(board){

    while (true){
        let aiCoords = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
        console.log(aiCoords);
        if (board[aiCoords[0]][aiCoords[1]] == '.'){
            return aiCoords;
        }
    }
}

function getUnbeatableAiCoords(board){
   
}