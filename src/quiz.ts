import { getEl, addClass, removeClass } from './dom.js';
import { GameState } from './state.js';

export class QuizPhase {
  private quizInput: HTMLInputElement;
  private quizButton: HTMLButtonElement;
  private quizTask: HTMLElement;
  private correctAnswer: number;
  
  constructor(state: GameState) {
    this.quizInput = getEl('#quiz-input');
    this.quizButton = getEl('#quiz-button');
    this.quizTask = getEl('#quiz-task');
    this.correctAnswer = state.correctAnswer;
    
    this.init();
  }
  
  private init(): void {
    this.quizInput.addEventListener('input', () => this.handleInput());
    this.quizButton.addEventListener('click', () => this.handleSubmit());
    this.quizTask.textContent = `How many donuts in total?`;
    addClass(this.quizButton, 'disabled');
  }
  
  private handleInput(): void {
    const value = this.quizInput.value.trim();
    const hasNumber = /^\d+$/.test(value);
    
    if (hasNumber) {
      this.quizButton.disabled = false;
      removeClass(this.quizInput, 'error');
      removeClass(this.quizButton, 'error');
      removeClass(this.quizButton, 'disabled');
    } else {
      this.quizButton.disabled = true;
      addClass(this.quizButton, 'disabled');
    }
  }
  
  private async handleSubmit(): Promise<void> {
    const value = parseInt(this.quizInput.value.trim(), 10);
    
    if (isNaN(value)) {
      return;
    }
    
    if (value === this.correctAnswer) {
      this.handleSuccess();
    } else {
      await this.handleError();
    }
  }
  
  private handleSuccess(): void {
    removeClass(this.quizInput, 'error');
    addClass(this.quizInput, 'success');
    removeClass(this.quizButton, 'error');
    addClass(this.quizButton, 'success');
    this.quizButton.disabled = true;
    this.quizInput.disabled = true;
  }
  
  private async handleError(): Promise<void> {
    addClass(this.quizInput, 'error');
    addClass(this.quizButton, 'error');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    removeClass(this.quizInput, 'error');
    removeClass(this.quizButton, 'error');
    this.quizInput.value = '';
    this.quizButton.disabled = true;
    addClass(this.quizButton, 'disabled');
    
    await this.revealDigits();
  }
  
  private async revealDigits(): Promise<void> {
    const answerStr = this.correctAnswer.toString();
    
    for (let i = 0; i < answerStr.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      this.quizInput.value = answerStr.substring(0, i + 1);
    }
    
    this.quizButton.disabled = false;
    removeClass(this.quizButton, 'disabled');
  }
}

