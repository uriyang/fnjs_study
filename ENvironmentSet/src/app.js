import View from './view';
import Controller, { onKeyEvent } from './controller';
import { p } from 'genf';

window.addEventListener('DOMContentLoaded', () => {
  const inputBox = document.querySelector('.new-todo');
  const base = document.querySelector('.todo-list');
  const view = new View(base);
  const controller = new Controller(view);

  inputBox.addEventListener('keypress', p.partial(onKeyEvent, controller));
});