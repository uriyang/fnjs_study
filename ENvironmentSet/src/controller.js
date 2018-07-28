import View from './view';
import Model, * as M from './model';

export default class Controller {
  model = new Model;
  view = new View;

  constructor(view, model) {
    this.view = view || this.view;
    this.model = model || this.model;
  }

  onKeyEvent(event) {
    if(event.keyCode === 13) {
      const target = event.target;
      this.addTodo(target);
    }
  }

  onClickEvent(id, event) {
    const target = event.target;
    const checked = target.checked;
    if(checked) {
      this.finishTodo(id);
    } else {
      this.startTodo(id);
    }
  }

  addTodo(element) {
    const desc = element.value;
    const model = this.model;
    const view = this.view;
    M.addTodo(desc, model);
    element.value = '';
    view.draw(model.storage, this.onClickEvent.bind(this));
  }

  finishTodo(id) {
    const model = this.model;
    const view = this.view;
    M.finishTodo(id, model);
    view.draw(model.storage, this.onClickEvent.bind(this));
  }

  startTodo(id) {
    const model = this.model;
    const view = this.view;
    M.beginTodo(id, model);
    view.draw(model.storage, this.onClickEvent.bind(this));
  }
}