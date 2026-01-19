import { getEl, createEl, addClass, removeClass } from './dom.js';
import { flyDonutToBox, closeBox, shiftBoxLeft, fadeIn } from './anim.js';
import { GameState, addDonutToBox } from './state.js';

export interface DonutConfig {
  x: number;
  y: number;
  imagePath: string;
}

export class DonutsPhase {
  private donutsContainer: HTMLElement;
  private boxesContainer: HTMLElement;
  private clickLockOverlay: HTMLElement;
  private donutElements: Map<HTMLElement, DonutConfig> = new Map();
  private currentBoxEl: HTMLElement | null = null;
  
  constructor(
    private onStateChange: (state: GameState) => void,
    private state: GameState
  ) {
    this.donutsContainer = getEl('#donuts-container');
    this.boxesContainer = getEl('#boxes-container');
    this.clickLockOverlay = getEl('#click-lock-overlay');
    this.currentBoxEl = getEl('#current-box');
  }
  
  init(donuts: DonutConfig[]): void {
    const containerWidth = this.donutsContainer.offsetWidth || 700;
    const containerHeight = this.donutsContainer.offsetHeight || 300;
    const donutSize = 80;
    const padding = 20;
    
    const usedPositions: Array<{ x: number; y: number }> = [];
    
    const getRandomPosition = (): { x: number; y: number } => {
      let attempts = 0;
      let x: number, y: number;
      
      do {
        x = Math.random() * (containerWidth - donutSize - padding * 2) + padding;
        y = Math.random() * (containerHeight - donutSize - padding * 2) + padding;
        attempts++;
      } while (
        attempts < 50 && 
        usedPositions.some(pos => 
          Math.abs(pos.x - x) < donutSize && Math.abs(pos.y - y) < donutSize
        )
      );
      
      usedPositions.push({ x, y });
      return { x, y };
    };
    
    donuts.forEach((donut) => {
      const randomPos = getRandomPosition();
      const donutEl = createEl<HTMLDivElement>('div', 'donut');
      
      donutEl.style.left = `${randomPos.x}px`;
      donutEl.style.top = `${randomPos.y}px`;
      donutEl.style.backgroundImage = `url(${donut.imagePath})`;
      donutEl.style.backgroundSize = 'contain';
      donutEl.style.backgroundRepeat = 'no-repeat';
      donutEl.style.backgroundPosition = 'center';
      donutEl.style.borderRadius = '50%';
      donutEl.style.width = '60px';
      donutEl.style.height = '60px';
      
      donutEl.addEventListener('click', () => this.handleDonutClick(donutEl));
      
      this.donutsContainer.appendChild(donutEl);
      this.donutElements.set(donutEl, { ...donut, x: randomPos.x, y: randomPos.y });
    });
    }
  
  private async handleDonutClick(donutEl: HTMLElement): Promise<void> {
    if (this.isLocked() || !this.currentBoxEl) return;
    
    this.lock();
    
    await flyDonutToBox(donutEl, this.currentBoxEl);
    
    removeClass(donutEl, 'flying');
    donutEl.style.position = 'absolute';
    donutEl.style.left = '50%';
    donutEl.style.top = '50%';
    donutEl.style.transform = 'translate(-90%, -25%) scale(0.7)';
    donutEl.style.pointerEvents = 'none';
    donutEl.style.zIndex = '1';
    
    const boxDonuts = this.currentBoxEl.querySelectorAll('.box-donut').length;
    const offsetY = boxDonuts === 0 ? -15 : 15;
    donutEl.style.top = `calc(50% + ${offsetY}px)`;
    
    addClass(donutEl, 'box-donut');
    this.currentBoxEl.appendChild(donutEl);
    
    this.donutElements.delete(donutEl);
    
    this.state = addDonutToBox(this.state);
    this.onStateChange(this.state);
    
    if (this.state.currentBoxDonuts === 0 && this.state.boxes.length > 1) {
      await this.handleBoxComplete();
    } else {
      this.unlock();
    }
  }
  
  private async handleBoxComplete(): Promise<void> {
    if (!this.currentBoxEl) return;
    
    const boxWrapper = this.currentBoxEl.parentElement;
    if (!boxWrapper) return;
    
    const boxDonuts = this.currentBoxEl.querySelectorAll('.box-donut');
    boxDonuts.forEach(donut => {
      (donut as HTMLElement).style.opacity = '0';
      (donut as HTMLElement).style.transition = 'opacity 200ms';
    });
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    boxDonuts.forEach(donut => donut.remove());
    
    closeBox(this.currentBoxEl);
    await shiftBoxLeft(boxWrapper);
    
    if (this.state.phase === 'DONUTS') {
      const newBoxWrapper = createEl<HTMLDivElement>('div', 'box-wrapper');
      const newBox = createEl<HTMLDivElement>('div', 'box box-open');
      const lid = createEl<HTMLDivElement>('div', 'box-lid');
      newBox.appendChild(lid);
      newBoxWrapper.appendChild(newBox);
      newBoxWrapper.style.opacity = '0';
      this.boxesContainer.appendChild(newBoxWrapper);
      
      this.currentBoxEl = newBox;
      
      await fadeIn(newBoxWrapper);
    }
    
    this.unlock();
  }
  
  private lock(): void {
    removeClass(this.clickLockOverlay, 'hidden');
  }
  
  private unlock(): void {
    addClass(this.clickLockOverlay, 'hidden');
  }
  
  private isLocked(): boolean {
    return !this.clickLockOverlay.classList.contains('hidden');
  }
  
  updateState(state: GameState): void {
    this.state = state;
  }
}

