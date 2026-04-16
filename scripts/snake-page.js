document.addEventListener("DOMContentLoaded", () => {
  const logic = window.SnakeGameLogic;
  if (!logic) {
    return;
  }

  const boardElement = document.querySelector("[data-snake-board]");
  const scoreElement = document.querySelector("[data-snake-score]");
  const stateElement = document.querySelector("[data-snake-state]");
  const restartButtons = document.querySelectorAll("[data-snake-restart]");
  const pauseButtons = document.querySelectorAll("[data-snake-pause]");
  const controlButtons = document.querySelectorAll("[data-direction]");

  if (!boardElement || !scoreElement || !stateElement) {
    return;
  }

  const boardSize = Number(boardElement.dataset.boardSize || 14);
  const tickMs = 180;
  let gameState = logic.createInitialState({ boardSize });
  let tickHandle = null;

  function renderBoard() {
    const snakePositions = new Set(
      gameState.snake.map((segment) => `${segment.x},${segment.y}`)
    );
    const headKey = `${gameState.snake[0].x},${gameState.snake[0].y}`;
    const foodKey = gameState.food ? `${gameState.food.x},${gameState.food.y}` : "";
    const cells = [];

    for (let y = 0; y < boardSize; y += 1) {
      for (let x = 0; x < boardSize; x += 1) {
        const key = `${x},${y}`;
        let className = "snake-cell";

        if (key === foodKey) {
          className += " snake-cell-food";
        } else if (key === headKey) {
          className += " snake-cell-head";
        } else if (snakePositions.has(key)) {
          className += " snake-cell-body";
        }

        cells.push(`<div class="${className}" aria-hidden="true"></div>`);
      }
    }

    boardElement.innerHTML = cells.join("");
  }

  function renderMeta() {
    scoreElement.textContent = String(gameState.score);

    if (gameState.status === "gameover") {
      stateElement.textContent = gameState.lastEvent === "board-filled"
        ? "Board cleared. Press restart to play again."
        : "Game over. Press restart to try again.";
    } else if (gameState.status === "paused") {
      stateElement.textContent = "Paused";
    } else {
      stateElement.textContent = "Running";
    }

    pauseButtons.forEach((button) => {
      button.textContent = gameState.status === "paused" ? "Resume" : "Pause";
    });
  }

  function render() {
    renderBoard();
    renderMeta();
  }

  function stopLoop() {
    if (tickHandle) {
      window.clearInterval(tickHandle);
      tickHandle = null;
    }
  }

  function startLoop() {
    stopLoop();
    tickHandle = window.setInterval(() => {
      const nextState = logic.stepGame(gameState);
      if (nextState === gameState) {
        return;
      }

      gameState = nextState;
      render();

      if (gameState.status === "gameover") {
        stopLoop();
      }
    }, tickMs);
  }

  function restart() {
    gameState = logic.restartGame(gameState, { boardSize });
    render();
    startLoop();
  }

  function queueDirection(directionName) {
    const nextState = logic.setDirection(gameState, directionName);
    if (nextState !== gameState) {
      gameState = nextState;
      renderMeta();
    }
  }

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const directionMap = {
      arrowup: "up",
      w: "up",
      arrowdown: "down",
      s: "down",
      arrowleft: "left",
      a: "left",
      arrowright: "right",
      d: "right",
    };

    if (directionMap[key]) {
      event.preventDefault();
      queueDirection(directionMap[key]);
      return;
    }

    if (key === " " || key === "spacebar") {
      event.preventDefault();
      gameState = logic.togglePause(gameState);
      renderMeta();
      if (gameState.status === "paused") {
        stopLoop();
      } else if (gameState.status === "running") {
        startLoop();
      }
      return;
    }

    if (key === "enter" && gameState.status === "gameover") {
      event.preventDefault();
      restart();
    }
  });

  restartButtons.forEach((button) => {
    button.addEventListener("click", restart);
  });

  pauseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      gameState = logic.togglePause(gameState);
      renderMeta();
      if (gameState.status === "paused") {
        stopLoop();
      } else if (gameState.status === "running") {
        startLoop();
      }
    });
  });

  controlButtons.forEach((button) => {
    button.addEventListener("click", () => {
      queueDirection(button.dataset.direction);
    });
  });

  render();
  startLoop();
});
