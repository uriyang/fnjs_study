import View from './view';
import Controller from './controller';

window.addEventListener('DOMContentLoaded', () => {
  const inputBox = document.querySelector('.new-todo');
  const base = document.querySelector('.todo-list');
  const view = new View(base);
  const controller = new Controller(view);

  inputBox.addEventListener('keypress', controller.onKeyEvent.bind(controller));
  window.storage = controller.model.storage;
});