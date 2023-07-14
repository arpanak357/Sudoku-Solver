let board = [];

const solveButton = document.querySelector('#solve-button');
const clearButton = document.querySelector('#clear-button');
const loadButton = document.querySelector('#load-button');


function insertValues() {
    const inputs = document.querySelectorAll('input');
    board = [];

    inputs.forEach((input) => {
        if (input.value) {
            board.push(parseInt(input.value));
            input.classList.add('input-el');
        } else {
            board.push(0);
            input.classList.add('empty-el');
        }
    });
}

function indexToRowCol(index) {
    return {
        row: Math.floor(index / 9),
        col: index % 9
    };
}

function rowColToIndex(row, col) {
    return row * 9 + col;
}

function acceptable(board, index, value) {
    const { row, col } = indexToRowCol(index);

    for (let r = 0; r < 9; r++) {
        if (board[rowColToIndex(r, col)] === value) {
            return false;
        }
    }

    for (let c = 0; c < 9; c++) {
        if (board[rowColToIndex(row, c)] === value) {
            return false;
        }
    }

    const r1 = Math.floor(row / 3) * 3;
    const c1 = Math.floor(col / 3) * 3;

    for (let r = r1; r < r1 + 3; r++) {
        for (let c = c1; c < c1 + 3; c++) {
            if (board[rowColToIndex(r, c)] === value) {
                return false;
            }
        }
    }

    return true;
}

function getChoices(board, index) {
    const choices = [];

    for (let value = 1; value <= 9; value++) {
        if (acceptable(board, index, value)) {
            choices.push(value);
        }
    }

    return choices;
}

function bestBet(board) {
    let index, moves, bestLen = 100;

    for (let i = 0; i < 81; i++) {
        if (!board[i]) {
            const m = getChoices(board, i);

            if (m.length < bestLen) {
                bestLen = m.length;
                moves = m;
                index = i;

                if (bestLen === 0) {
                    break;
                }
            }
        }
    }

    return { index, moves };
}

function solve() {
    let { index, moves } = bestBet(board);

    if (index === undefined) {
        return true;
    }

    for (let m of moves) {
        board[index] = m;

        if (solve()) {
            return true;
        }
    }

    board[index] = 0;
    return false;
}

function populateValues() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach((input, i) => {
        input.value = board[i];
    });
}

// ... previous code ...

function drawBoard() {
    const sudokuBoard = document.querySelector("#puzzle");
    const squares = 81;

    for (let i = 0; i < squares; i++) {
        const inputElement = document.createElement("input");
        inputElement.setAttribute('type', 'number');
        inputElement.setAttribute('min', '1');
        inputElement.setAttribute('max', '9');

        if (
            ((i % 9 === 0 || i % 9 === 1 || i % 9 === 2) && i < 27) ||
            ((i % 9 === 6 || i % 9 === 7 || i % 9 === 8) && i >= 54)
        ) {
            inputElement.classList.add('top-border');
        }

        if ((i + 1) % 9 === 0 && (i + 1) % 27 !== 0) {
            inputElement.classList.add('right-border');
        }

        if ((i + 1) % 27 === 0) {
            inputElement.classList.add('bottom-border');
        }

        if (i % 9 === 0) {
            inputElement.classList.add('left-border');
        }
        if (
            ((i % 9 == 0 || i % 9 == 1 || i % 9 == 2) && i < 21) ||
            ((i % 9 == 6 || i % 9 == 7 || i % 9 == 8) && i < 27) ||
            ((i % 9 == 3 || i % 9 == 4 || i % 9 == 5) && (i > 27 && i < 53)) ||
            ((i % 9 == 0 || i % 9 == 1 || i % 9 == 2) && i > 53) ||
            ((i % 9 == 6 || i % 9 == 7 || i % 9 == 8) && i > 53)
        ) {
            inputElement.classList.add('odd-section')
        }

        sudokuBoard.appendChild(inputElement);
    }
}

function loadRandomBoard() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach((input) => {
        input.value = '';
        input.classList.remove('input-el', 'empty-el');
    });

    const randomBoard = getRandomBoard();
    randomBoard.forEach((value, i) => {
        if(value == 0) {
            inputs[i].value = ""
       } else {
        inputs[i].value = value;
       }
        
    });

    board = randomBoard;
}

function getRandomBoard() {
    const puzzles = [
        "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
        "000000008800000000000030000000000006000020070000005000050700900000004000000003000",
        "100000805030000000000700000020000060000080400000010000000603070500200000104000000",
        // Add more puzzles here...
    ];

    const randomIndex = Math.floor(Math.random() * puzzles.length);
    const puzzle = puzzles[randomIndex];

    return puzzle.split('').map((char) => parseInt(char));
}

function main() {
    
    drawBoard();

    solveButton.addEventListener('click', () => {
        insertValues();

        if (solve()) {
            populateValues();
        } else {
            alert("Can't solve this puzzle!");
        }
    });

    clearButton.addEventListener('click', () => {
        window.location.reload(true);
    });

    loadButton.addEventListener('click', () => {
        loadRandomBoard();
    });
}

main();
