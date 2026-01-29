import { addRoute, initRouter } from './router';
import { renderTextInput } from './screens/text-input';
import { renderSpeedReader } from './screens/speed-reader';

export function setupApp(container: HTMLElement): void {
  addRoute('/', renderTextInput);
  addRoute('/reader', renderSpeedReader);

  initRouter(container);
}
