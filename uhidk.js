const board = document.getElementById('board');
const boardCells = [...board.querySelectorAll('button')];

let playerTurn = true;
let gameOver = false;
let difficultyLevel = 50;

const winPatterns = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Column 1
  [1, 4, 7], // Column 2
  [2, 5, 8], // Column 3
  [0, 4, 8], // Diagonal \
  [2, 4, 6]  // Diagonal /
];

const difficulty = document.getElementById('difficulty');


// Event Listeners

difficulty.addEventListener('change', () => {
  if (difficulty.value === 'easy') {
    difficultyLevel = 10;
  } else if (difficulty.value === 'medium') {
    difficultyLevel = 50;
  } else if (difficulty.value === 'hard') {
    difficultyLevel = 80;
  } else if (difficulty.value === 'unbeatable') {
    difficultyLevel = 99;
  }
});

document.getElementById('reset').addEventListener('click', () => resetBoard());

boardCells.forEach(cell => {
  cell.addEventListener('click', () => turn(cell));
});


// Main Functions

function turn(cell) {
  if (gameOver || cell.textContent !== '') {
    return;
  }
  cell.textContent = 'x';
  cell.disabled = true;

  if (checkWin('x')) {
    alert('You win!');
    gameOver = true;
    return;
  }

  playerTurn = !playerTurn;
  computerTurn();

  if (checkWin('Y')) {
    alert('Oski wins!');
    gameOver = true;
    return;
  }
  playerTurn = !playerTurn;

  if (boardCells.every(cell => cell.textContent !== '')) {
    alert('It\'s a draw!');
    gameOver = true;
  }
}

function resetBoard() {
  boardCells.forEach(cell => {
    cell.textContent = '';
  });
  gameOver = false;
  playerTurn = true;
  boardCells.forEach(cell => {
    cell.disabled = false;
  });
  return;
}

function checkWin(player) {
  return winPatterns.some(([a, b, c]) =>
    boardCells[a].textContent === player &&
    boardCells[b].textContent === player &&
    boardCells[c].textContent === player
  );
}

function computerTurn() {
  const percent = Math.floor(Math.random() * 100) + 1;
  if (percent <= difficultyLevel) {

    if (winBlock('Y') || winBlock('x')) {
      return;
    }

    if (boardCells[4].textContent === '') {
      boardCells[4].textContent = 'Y';
      boardCells[4].disabled = true;
      return;
    }

    const diagCorners = [[0, 8], [2, 6]];
    for (const [a, b] of diagCorners) {
      if (boardCells[a].textContent === 'x' && boardCells[b].textContent === 'x') {
        const sides = [1, 3, 5, 7];
        for (const side of sides) {
          if (boardCells[side].textContent === '') {
            boardCells[side].textContent = 'Y';
            boardCells[side].disabled = true;
            return true;
          }
        }
      }
    }

    const corners = [0, 2, 6, 8];
    for (const corner of corners) {
      if (boardCells[corner].textContent === '') {
        boardCells[corner].textContent = 'Y';
        boardCells[corner].disabled = true;
        return;
      }
    }
  }
  randomTurn();
  return;
}


// Helper Functions

function randomTurn() {
  const emptyCells = boardCells.filter(cell => cell.textContent == '');
  if (emptyCells.length === 0) return;
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  emptyCells[randomIndex].textContent = 'Y';
}

function winBlock(player) {
  for (const pattern of winPatterns) {
    const cells = pattern.map(index => boardCells[index]);
    const playerCount = cells.filter(cell => cell.textContent === player).length;
    const emptyCount = cells.filter(cell => cell.textContent === '').length;
    if (playerCount === 2 && emptyCount === 1) {
      const emptyCell = cells.find(cell => cell.textContent === '');
      emptyCell.textContent = 'Y';
      emptyCell.disabled = true;
      return true;
    }
  }
  return false;
}