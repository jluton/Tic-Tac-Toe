/*
*** GAME STATE SETUP ***
*/
const _rows = 3;
const _columns = 3;

// Global variables track game state
let turn = 'X';
let piecesPlaced = 0;
let board;

// Generate board
const generateBoard = function (rows = _rows, columns = _columns) {
  const board = [];
  for (r = 1; r <= rows; r++) {
    var row = [];
    for (c = 1; c <= columns; c++) {
      row.push([]);
    }
    board.push(row);
  }
  return board;
}

board = generateBoard();

/*
*** HTML GENERATION ***
*/

// Create button event listener and generate table
const init = function () {
  document.getElementById('newGameBtn').onclick = resetGame;
  renderTable();
}

// Generates HTML table and renders it to the DOM.
const renderTable = function () {
  var table = document.createElement('table');
  table.id = 'table';
  table.style.width = '50%';
  table.style.height = '50%';

  for (r = 1; r <= _rows; r++) {
    var row = generateTableRow(r);
    table.appendChild(row);
  }

  document.body.appendChild(table);
};

// Generates a <tr> node with a cell for each column.
const generateTableRow = function(r) {
  var row = document.createElement('tr');
  row.className = 'row';

  for (c = 1; c <= _columns; c++) {
    var cell = generateTableCell(r, c);
    row.appendChild(cell);
  }

  return row;
}

// Generates a <td> node with a unique id
const generateTableCell = function (r, c) {
  var cell = document.createElement('td');
  cell.className = 'cell';
  cell.id = `r${r}c${c}`;
  cell.style.border = '1px solid black';
  cell.style.width = '16.6666%';
  cell.style.height = '16.6666%';
  cell.style.textAlign = 'center';
  cell.style.fontWeight = 'bold';
  cell.style.fontSize = 'xx-large';
  cell.addEventListener('click', handleClick);
  return cell;
}

// *** GAMEPLAY EVENT HANDLING AND STATE MANAGEMENT ***

// Click handler checks if move is valid and initiates move.
const handleClick = function(event) {
  const { target } = event;
  if (target.innerText !== '') {
    throw new Error('Cell click event fired for a second time.');
  }

  // Update HTML
  target.innerText = turn;

  // Update game state
  const targetRow = target.id[1] - 1;
  const targetColumn = target.id[3] - 1;
  console.log(board);
  board[targetRow][targetColumn] = turn;
  piecesPlaced++;

  // Check if game is over
  const result = gameIsOver(targetRow, targetColumn);
  if (result) {
    endGame(result);
  } else {
    target.removeEventListener('click', handleClick);
    turn = turn === 'X' ? 'O' : 'X';
  }
}

// Checks to see whether a player has won, or all spots are taken. 
const gameIsOver = function (row, column) {
  if (checkRow(row) || checkColumn(column) || checkDiagonals()) return turn;
  if (piecesPlaced === _rows * _columns) return 'tie';
  return false;
};

// Returns true if every item in row matches turn's piece.
const checkRow = function (r) {
  return board[r].every(space => space === turn);
}

// Returns true if every item in column matches turn's piece.
const checkColumn = function (c) {
  return board.reduce((acc, row) => {
    return row[c] === turn ? acc : false;
  }, true);
}

// Checks two diagonals and returns boolean
// ** This needs to be refactoed before _rows or _columns are changed ** 
const checkDiagonals = function () {
  if (board[1][1] !== turn) return false;
  if (board[0][0] === turn && board[2][2] === turn) return true;
  if (board[0][2] === turn && board[2][0] === turn) return true;
  return false;
}

// *** GAME ENDING AND RESETING ***

// Announces result and resets board
const endGame = function (result) {
  alert(result === 'tie' ? 'It\'s a tie!' : `${turn} wins!`);
  resetGame();
};

// Resets game state and HTML
const resetGame = function () {
  turn = 'X';
  piecesPlaced = 0;
  board = generateBoard();
  document.getElementById('table').remove();
  renderTable();
}

window.onload = init;

