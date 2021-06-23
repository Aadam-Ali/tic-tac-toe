function player(sign) {
  this.sign = sign;
  return { sign };
}

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const setSquare = (index, sign) => {
    if (index > board.length) return;
    board[index] = sign;
    return board;
  };

  const getSquare = (index) => {
    return index > board.length ? null : board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { setSquare, getSquare, reset };
})();

const displayController = (() => {
  const squares = document.querySelectorAll(".square");
  const message = document.querySelector(".message");
  const resetBtn = document.querySelector(".reset");

  const updateBoard = () => {
    for (let i = 0; i < squares.length; i++) {
      squares[i].textContent = gameBoard.getSquare(i);
    }
  };

  const updateMessage = (mes) => {
    message.textContent = mes;
  };

  squares.forEach((square) =>
    square.addEventListener("click", (e) => {
      if (gameController.isGameOver() || e.target.textContent !== "") return;
      gameController.playRound(parseInt(e.target.dataset.index));
      updateBoard();
    })
  );

  resetBtn.addEventListener("click", (e) => {
    gameBoard.reset();
    gameController.reset();
    updateBoard();
    updateMessage("Player X's Turn");
  });
  return { updateBoard, updateMessage };
})();

const gameController = (() => {
  const player1 = new player("x");
  const player2 = new player("o");
  let round = 1;
  let gameOver = false;

  const currentPlayerSign = () => {
    return round % 2 === 1 ? player1.sign : player2.sign;
  };

  const playRound = (index) => {
    gameBoard.setSquare(index, currentPlayerSign());
    if (checkForWin(index)) {
      displayController.updateMessage(`Player ${currentPlayerSign()} Wins`);
      gameOver = true;
      return;
    } else if (round === 9) {
      displayController.updateMessage("Draw");
      gameOver = true;
      return;
    }
    round++;
  };

  const checkForWin = (index) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningCombinations
      .filter((combinations) => combinations.includes(index))
      .some((potentialCombination) =>
        potentialCombination.every(
          (testIndex) => gameBoard.getSquare(testIndex) === currentPlayerSign()
        )
      );
  };

  const isGameOver = () => {
    return gameOver;
  };

  const reset = () => {
    round = 1;
    gameOver = false;
  };
  return { playRound, isGameOver, reset };
})();
