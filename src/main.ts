import { getEl, addClass } from './dom.js';
import { createInitialState, GameState } from './state.js';
import { DonutsPhase, DonutConfig } from './donuts.js';
import { QuizPhase } from './quiz.js';
import { fadeIn } from './anim.js';

class Game {
  private state: GameState;
  private donutsPhase: DonutsPhase | null = null;
  private quizPhase: QuizPhase | null = null;
  private donutsPhaseEl: HTMLElement;
  private quizPhaseEl: HTMLElement;
  private gameTitle: HTMLElement;
  
  constructor() {
    this.donutsPhaseEl = getEl('#donuts-phase');
    this.quizPhaseEl = getEl('#quiz-phase');
    this.gameTitle = getEl('#game-title');
    
    const donutsConfig: DonutConfig[] = Array(8).fill(null).map(() => ({
      x: 0,
      y: 0,
      imagePath: './src/assets/donut.svg'
    }));
    
    this.state = createInitialState(donutsConfig.length);
    
    this.donutsPhase = new DonutsPhase(
      (state) => this.handleStateChange(state),
      this.state
    );
    
    this.donutsPhase.init(donutsConfig);
  }
  
  private handleStateChange(newState: GameState): void {
    this.state = newState;
    
    if (this.state.phase === 'QUIZ') {
      this.transitionToQuiz();
    }
  }
  
  private async transitionToQuiz(): Promise<void> {
    addClass(this.gameTitle, 'hidden');
    
    const donutsContainer = getEl('#donuts-container');
    addClass(donutsContainer, 'hidden');
    
    await fadeIn(this.quizPhaseEl, 1000);
    
    this.quizPhase = new QuizPhase(this.state);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Game();
});

