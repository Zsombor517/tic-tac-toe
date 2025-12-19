import promptSync from 'prompt-sync';
const prompt = promptSync({ sigint: true });

let board = getEmptyBoard();
let playerTurn = 'x';
let aiEnabled;
let aiVsAi = false;

while (true) {
    console.log('1. Two player mode\n2.Play against ai\n3. ai vs ai')
    const input = prompt();
    if (input == 1) {
        break;
    }
    else if (input == 2) {
        aiEnabled = true;
        break;
    }
    else if (input == 3) {
        aiVsAi = true;
        aiEnabled = true;
        break;
    }
    console.log("Enter either 1, 2 or 3");
}
while (true) {
    let coords;

    if (isBoardFull(board)) {
        break;
    }

    if (aiEnabled) {
        if (!aiVsAi && playerTurn == 'o') {
            coords = getUnbeatableAiCoords(board);
            board[coords[0]][coords[1]] = playerTurn;
            console.log("Ai turn: ")
            playerTurn = 'x';
        }

        if (aiVsAi) {
            coords = getUnbeatableAiCoords(board);
            board[coords[0]][coords[1]] = playerTurn;
            playerTurn = (playerTurn == 'x') ? 'o' : 'x';
        }
    }
    displayBoard(board);
    if (playerTurn == 'x' && !aiVsAi) {
        coords = getHumanCoordinates(board, playerTurn);
        if (!coords) { break; }
        board[coords[0]][coords[1]] = playerTurn;
        playerTurn = 'o';
    }
    else if (!aiEnabled && playerTurn == 'o') {
        coords = getHumanCoordinates(board, playerTurn);
        if (!coords) { break; }
        board[coords[0]][coords[1]] = playerTurn;
        playerTurn = 'x';
    }
    displayBoard(board);
    if (getWinner(board)) {
        console.log(`The winners is ${getWinner(board)}`);
        break;
    }
    if (isBoardFull(board)) {
        console.log('Tie!');
        break;
    }
}

function getEmptyBoard() {
    return [['.', '.', '.'], ['.', '.', '.'], ['.', '.', '.']];
}

function displayBoard(board) {
    console.log('  1 2 3');
    let row = 'A ';
    for (const column of board[0]) {
        row += `${column}|`
    }
    console.log(row);

    row = 'B ';
    for (const column of board[1]) {
        row += `${column}|`
    }
    console.log('---+---+---\n' + row);

    row = 'C ';
    for (const column of board[2]) {
        row += `${column}|`
    }
    console.log('---+---+---\n' + row);
}

function getHumanCoordinates(board, playerTurn) {
    const rows = {
        a: 1,
        b: 2,
        c: 3
    }
    while (true) {
        let coords = prompt(`Player ${playerTurn} (Eg. a1): `);
        if (coords.toLowerCase() == 'quit') {
            return false;
        }
        else if (!/^[a-cA-C][1-3]$/.test(coords)) {
            console.log('Invalid move!');
        }
        else {
            coords = [rows[coords[0].toLowerCase()] - 1, parseInt(coords[1]) - 1];
            if (board[coords[0]][coords[1]] != '.') {
                console.log('Space already occupied!');
            }
            else { return coords; }
        }
    }
}

function isBoardFull(board) {
    let fullRowCounter = 0;
    for (const row of board) {
        if (!row.includes('.')) {
            fullRowCounter++;
        }
    }
    if (fullRowCounter == 3) {
        //console.log('Tie!')
        return true;
    }
    return false;
}

function getWinner(board) {
    //three in a row
    for (const row of board) {
        if (!row.includes('.') && !row.includes('o')) {
            return 'x';
        }
        else if (!row.includes('.') && !row.includes('x')) {
            return 'o';
        }
    }
    //three in a column
    let xCount = 0;
    let oCount = 0;
    for (let i = 0; i <= board.length; i++) {
        for (const row of board) {
            if (row[i] == 'x') {
                xCount++;
            }
            else if (row[i] == 'o') {
                oCount++;
            }
        }

        if (xCount == 3) {
            return 'x';
        }
        else if (oCount == 3) {
            return 'o';
        }
        oCount = 0;
        xCount = 0;
    }
    //diagonal
    const topLeft = board[0][0];
    if (board[1][1] == topLeft && board[2][2] == topLeft && topLeft != '.') {
        return topLeft;
    }
    const topRight = board[0][2];
    if (board[1][1] == topRight && board[2][0] == topRight && topRight != '.') {
        return topRight;
    }
    return undefined;
}
function getRandomAiCoords(board) {

    const emptyCoords = [];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '.') {
                emptyCoords.push([i, j]);
            }
        }
    }

    if (emptyCoords.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * emptyCoords.length);
    return emptyCoords[randomIndex];
}

function minimax(board, depth, isMaximizing) {
    let winner = getWinner(board);

    if (winner === 'o') return 10 - depth; // AI wins
    if (winner === 'x') return depth - 10; // Human wins
    if (isBoardFull(board)) return 0;      // Draw

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '.') {
                    board[i][j] = 'o';
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = '.';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }

        return bestScore;
    } else {
        let bestScore = Infinity;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '.') {
                    board[i][j] = 'x';
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = '.';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }

        return bestScore;
    }
}

function getUnbeatableAiCoords(board) {

    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == '.') {
                board[i][j] = 'o';
                let score = minimax(board, 0, false);
                board[i][j] = '.';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = [i, j];
                }
            }
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == ".") {
                board[i][j] = 'x';
                if (getWinner(board) == 'x') {
                    board[i][j] = '.';
                    return [i, j];
                }
                board[i][j] = '.';
            }
        }
    }
    return getRandomAiCoords(board);
}

