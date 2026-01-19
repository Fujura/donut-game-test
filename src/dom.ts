export function getEl<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) {
    throw new Error(`Element not found: ${selector}`);
  }
  return el;
}

export function createEl<T extends HTMLElement>(
  tag: string,
  className?: string
): T {
  const el = document.createElement(tag) as T;
  if (className) {
    el.className = className;
  }
  return el;
}

export function addClass(el: HTMLElement, className: string): void {
  el.classList.add(className);
}

export function removeClass(el: HTMLElement, className: string): void {
  el.classList.remove(className);
}

export function toggleClass(el: HTMLElement, className: string, force?: boolean): void {
  el.classList.toggle(className, force);
}

