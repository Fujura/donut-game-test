export function flyDonutToBox(
  donutEl: HTMLElement,
  boxTargetEl: HTMLElement
): Promise<void> {
  return new Promise((resolve) => {
    const donutsContainer = donutEl.parentElement;
    const donutsPhase = donutsContainer?.parentElement;
    if (!donutsContainer || !donutsPhase) {
      resolve();
      return;
    }
    
    const containerRect = donutsContainer.getBoundingClientRect();
    const boxRect = boxTargetEl.getBoundingClientRect();
    const phaseRect = donutsPhase.getBoundingClientRect();
    const donutSize = 60;
    
    const boxXRelativeToPhase = boxRect.left - phaseRect.left;
    const boxYRelativeToPhase = boxRect.top - phaseRect.top;
    const containerXRelativeToPhase = containerRect.left - phaseRect.left;
    const containerYRelativeToPhase = containerRect.top - phaseRect.top;
    
    const endX = boxXRelativeToPhase - containerXRelativeToPhase + boxRect.width / 2 - donutSize / 2;
    const endY = boxYRelativeToPhase - containerYRelativeToPhase + boxRect.height / 2 - donutSize / 2;
    
    addClass(donutEl, 'flying');
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        donutEl.style.left = `${endX}px`;
        donutEl.style.top = `${endY}px`;
        donutEl.style.transform = 'scale(0.3)';
        
        setTimeout(() => {
          resolve();
        }, 500);
      });
    });
  });
}

export function closeBox(boxEl: HTMLElement): void {
  removeClass(boxEl, 'box-open');
  addClass(boxEl, 'box-closed');
}

export function shiftBoxLeft(boxWrapperEl: HTMLElement, px: number = 30): Promise<void> {
  return new Promise((resolve) => {
    const currentTransform = getComputedStyle(boxWrapperEl).transform;
    const matrix = currentTransform !== 'none' ? currentTransform.match(/matrix.*\((.+)\)/) : null;
    const currentX = matrix ? parseFloat(matrix[1].split(',')[4]) : 0;
    const newX = currentX - px;
    
    boxWrapperEl.style.transition = 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)';
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        boxWrapperEl.style.transform = `translateX(${newX}px)`;
        
        setTimeout(() => {
          boxWrapperEl.style.transition = '';
          resolve();
        }, 500);
      });
    });
  });
}

export function fadeIn(el: HTMLElement, ms: number = 1000): Promise<void> {
  return new Promise((resolve) => {
    el.style.opacity = '0';
    removeClass(el, 'hidden');
    
    requestAnimationFrame(() => {
      el.style.transition = `opacity ${ms}ms ease`;
      el.style.opacity = '1';
      
      setTimeout(() => {
        el.style.transition = '';
        resolve();
      }, ms);
    });
  });
}

function addClass(el: HTMLElement, className: string): void {
  el.classList.add(className);
}

function removeClass(el: HTMLElement, className: string): void {
  el.classList.remove(className);
}

