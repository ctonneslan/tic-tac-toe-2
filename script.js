const Player = (name, marker) => {
  return { name, marker };
};

const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => [...board];

  const placeMarker = (index, marker) => {
    if (board[index] == "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, placeMarker, reset };
})();

const GameController = (() => {
  let player1;
  let player2;
  let currentPlayer;
  let winner = null;

  const startGame = (name1, name2) => {
    player1 = Player(name1 || "Player 1", "X");
    player2 = Player(name2 || "Player 2", "O");
    currentPlayer = player1;
    winner = null;
    Gameboard.reset();
  };

  const playTurn = (index) => {
    if (Gameboard.placeMarker(index, currentPlayer.marker)) {
      if (checkWin(currentPlayer.marker)) {
        winner = currentPlayer;
        console.log(`${currentPlayer.name} wins!`);
      } else if (checkTie()) {
        console.log(`It's a tie!`);
      } else {
        switchTurn();
      }
    } else {
      console.log("Invalid move.");
    }
  };

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWin = (marker) => {
    const b = Gameboard.getBoard();

    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winCombos.some((combo) => combo.every((i) => b[i] === marker));
  };

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  const getCurrentPlayer = () => currentPlayer;
  const getWinner = () => winner;
  const getBoard = () => gameboard.getBoard();
  const resetGame = () => {
    Gameboard.reset();
    currentPlayer = player1;
    winner = null;
  };

  return {
    startGame,
    playTurn,
    getCurrentPlayer,
    getWinner,
    getBoard,
    resetGame,
  };
})();

const DisplayController = (() => {
  const boardElement = document.getElementById("board");
  const statusElement = document.getElementById("status");
  const restartButton = document.getElementById("restart");

  const startButton = document.getElementById("start");
  const name1Input = document.getElementById("player1-name");
  const name2Input = document.getElementById("player2-name");

  const gameContainer = document.getElementById("game");
  const setupContainer = document.getElementById("setup");

  startButton.addEventListener("click", () => {
    const name1 = name1Input.value.trim();
    const name2 = name2Input.value.trim();
    GameController.startGame(name1, name2);
    setupContainer.style.display = "none";
    gameContainer.style.display = "block";
    render();
  });

  restartButton.addEventListener("click", () => {
    GameController.resetGame();
    render();
  });

  const render = () => {
    boardElement.innerHTML = "";
    const board = Gameboard.getBoard();

    board.forEach((cell, index) => {
      const square = document.createElement("div");
      square.classList.add("square");
      square.textContent = cell;
      square.addEventListener("click", () => {
        handleClick(index);
      });
      boardElement.appendChild(square);
    });

    const winner = GameController.getWinner();
    if (winner) {
      statusElement.textContent = `${winner.name} wins!`;
    } else if (board.every((cell) => cell !== "")) {
      statusElement.textContent = `It's a tie!`;
    } else {
      statusElement.textContent = `${
        GameController.getCurrentPlayer().name
      }'s turn`;
    }
  };

  const handleClick = (index) => {
    if (GameController.getWinner()) return;
    GameController.playTurn(index);
    render();
  };

  return { render };
})();
