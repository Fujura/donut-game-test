export type GamePhase = 'DONUTS' | 'QUIZ';

export interface GameState {
  phase: GamePhase;
  donutsCollected: number;
  donutsTotal: number;
  currentBoxDonuts: number;
  boxes: Array<{ donuts: number }>;
  correctAnswer: number;
}

export function createInitialState(donutsTotal: number): GameState {
  return {
    phase: 'DONUTS',
    donutsCollected: 0,
    donutsTotal,
    currentBoxDonuts: 0,
    boxes: [{ donuts: 0 }],
    correctAnswer: donutsTotal,
  };
}

export function addDonutToBox(state: GameState): GameState {
  const newState = { ...state };
  newState.donutsCollected++;
  newState.currentBoxDonuts++;
  
  const currentBox = newState.boxes[newState.boxes.length - 1];
  currentBox.donuts = newState.currentBoxDonuts;
  
  if (newState.currentBoxDonuts >= 2) {
    newState.currentBoxDonuts = 0;
    newState.boxes.push({ donuts: 0 });
  }
  
  if (newState.donutsCollected >= newState.donutsTotal) {
    newState.phase = 'QUIZ';
  }
  
  return newState;
}

