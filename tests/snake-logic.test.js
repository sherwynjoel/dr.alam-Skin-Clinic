const assert = require("node:assert/strict");

const {
  createFoodPosition,
  createInitialState,
  setDirection,
  stepGame,
  togglePause,
} = require("../scripts/snake-logic.js");

function runTest(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

runTest("moves the snake one cell in the current direction", () => {
  const initialState = createInitialState({ boardSize: 8, randomFn: () => 0 });
  const nextState = stepGame(initialState, { randomFn: () => 0 });

  assert.deepEqual(nextState.snake[0], { x: 5, y: 4 });
  assert.equal(nextState.score, 0);
  assert.equal(nextState.status, "running");
});

runTest("grows the snake and increments score after eating food", () => {
  const state = {
    boardSize: 8,
    snake: [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 4, y: 3 },
    score: 0,
    status: "running",
    lastEvent: null,
  };

  const nextState = stepGame(state, { randomFn: () => 0 });

  assert.equal(nextState.snake.length, 4);
  assert.deepEqual(nextState.snake[0], { x: 4, y: 3 });
  assert.equal(nextState.score, 1);
  assert.equal(nextState.lastEvent, "food-eaten");
});

runTest("ends the game on wall collision", () => {
  const state = {
    boardSize: 5,
    snake: [{ x: 4, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 2 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 0, y: 0 },
    score: 0,
    status: "running",
    lastEvent: null,
  };

  const nextState = stepGame(state);

  assert.equal(nextState.status, "gameover");
  assert.equal(nextState.lastEvent, "wall-collision");
});

runTest("ends the game on self collision", () => {
  const state = {
    boardSize: 6,
    snake: [
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 2 },
    ],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 0, y: 0 },
    score: 3,
    status: "running",
    lastEvent: null,
  };

  const nextState = stepGame(state);

  assert.equal(nextState.status, "gameover");
  assert.equal(nextState.lastEvent, "self-collision");
});

runTest("food placement skips occupied snake cells", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ];

  const food = createFoodPosition(3, snake, () => 0);

  assert.deepEqual(food, { x: 2, y: 0 });
});

runTest("reverse direction input is ignored", () => {
  const initialState = createInitialState({ boardSize: 8, randomFn: () => 0 });
  const nextState = setDirection(initialState, "left");

  assert.equal(nextState, initialState);
});

runTest("pause toggle swaps between running and paused", () => {
  const initialState = createInitialState({ boardSize: 8, randomFn: () => 0 });
  const pausedState = togglePause(initialState);
  const resumedState = togglePause(pausedState);

  assert.equal(pausedState.status, "paused");
  assert.equal(resumedState.status, "running");
});

console.log("Snake logic tests completed.");
