import type { RouteHandler } from './types';

const routes: Map<string, RouteHandler> = new Map();
let appContainer: HTMLElement | null = null;

export function addRoute(path: string, handler: RouteHandler): void {
  routes.set(path, handler);
}

export function navigate(path: string): void {
  history.pushState(null, '', path);
  render();
}

function render(): void {
  if (!appContainer) return;

  const path = window.location.pathname;
  const handler = routes.get(path) || routes.get('/');

  if (handler) {
    handler(appContainer);
  }
}

export function initRouter(container: HTMLElement): void {
  appContainer = container;

  window.addEventListener('popstate', () => {
    render();
  });

  render();
}
