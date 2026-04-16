(function (globalScope) {
  const DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  function cloneSegment(segment) {
    return { x: segment.x, y: segment.y };
  }

  function areOppositeDirections(current, next) {
    return current.x + next.x === 0 && current.y + next.y === 0;
  }

  function getEmptyCells(boardSize, snake) {
    const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
    const cells = [];

    for (let y = 0; y < boardSize; y += 1) {
      for (let x = 0; x < boardSize; x += 1) {
        if (!occupied.has(`${x},${y}`)) {
          cells.push({ x, y });
        }
      }
    }

    return cells;
  }

  function createFoodPosition(boardSize, snake, randomFn) {
    const emptyCells = getEmptyCells(boardSize, snake);

    if (!emptyCells.length) {
      return null;
    }

    const randomIndex = Math.floor(randomFn() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  function createInitialState(options = {}) {
    const boardSize = options.boardSize || 14;
    const randomFn = options.randomFn || Math.random;
    const center = Math.floor(boardSize / 2);
    const snake = [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ];
    const direction = cloneSegment(DIRECTIONS.right);
    const food = createFoodPosition(boardSize, snake, randomFn);

    return {
      boardSize,
      snake,
      direction,
      nextDirection: direction,
      food,
      score: 0,
      status: "running",
      lastEvent: null,
    };
  }

  function setDirection(state, directionName) {
    const requestedDirection = DIRECTIONS[directionName];
    if (!requestedDirection || state.status === "gameover") {
      return state;
    }

    const basisDirection = state.nextDirection || state.direction;
    if (areOppositeDirections(basisDirection, requestedDirection)) {
      return state;
    }

    return {
      ...state,
      nextDirection: cloneSegment(requestedDirection),
    };
  }

  function togglePause(state) {
    if (state.status === "gameover") {
      return state;
    }

    return {
      ...state,
      status: state.status === "paused" ? "running" : "paused",
      lastEvent: state.status === "paused" ? "resumed" : "paused",
    };
  }

  function stepGame(state, options = {}) {
    if (state.status !== "running") {
      return state;
    }

    const randomFn = options.randomFn || Math.random;
    const direction = cloneSegment(state.nextDirection || state.direction);
    const nextHead = {
      x: state.snake[0].x + direction.x,
      y: state.snake[0].y + direction.y,
    };

    const hitsWall =
      nextHead.x < 0 ||
      nextHead.y < 0 ||
      nextHead.x >= state.boardSize ||
      nextHead.y >= state.boardSize;

    if (hitsWall) {
      return {
        ...state,
        direction,
        nextDirection: direction,
        status: "gameover",
        lastEvent: "wall-collision",
      };
    }

    const grows = Boolean(state.food) &&
      nextHead.x === state.food.x &&
      nextHead.y === state.food.y;

    const trimmedSnake = grows ? state.snake : state.snake.slice(0, -1);
    const hitsSelf = trimmedSnake.some(
      (segment) => segment.x === nextHead.x && segment.y === nextHead.y
    );

    if (hitsSelf) {
      return {
        ...state,
        direction,
        nextDirection: direction,
        status: "gameover",
        lastEvent: "self-collision",
      };
    }

    const nextSnake = [nextHead, ...trimmedSnake.map(cloneSegment)];
    const nextFood = grows
      ? createFoodPosition(state.boardSize, nextSnake, randomFn)
      : state.food;
    const isBoardFilled = grows && nextFood === null;

    return {
      ...state,
      snake: nextSnake,
      direction,
      nextDirection: direction,
      food: nextFood,
      score: grows ? state.score + 1 : state.score,
      status: isBoardFilled ? "gameover" : "running",
      lastEvent: isBoardFilled ? "board-filled" : (grows ? "food-eaten" : "moved"),
    };
  }

  function restartGame(state, options = {}) {
    return createInitialState({
      boardSize: options.boardSize || state.boardSize,
      randomFn: options.randomFn || Math.random,
    });
  }

  const api = {
    DIRECTIONS,
    createFoodPosition,
    createInitialState,
    getEmptyCells,
    restartGame,
    setDirection,
    stepGame,
    togglePause,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    globalScope.SnakeGameLogic = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
