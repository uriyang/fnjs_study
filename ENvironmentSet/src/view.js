import * as M from './model';

export default class View {
  base = document.createElement('div');

  constructor(base) {
    this.base = base || this.base;
  }

  draw(model, toggleCallback) {
    const base = this.base;
    while (base.firstChild) {
      base.removeChild(base.firstChild);
    }
    model.forEach(todoitem => {
      const element = this.drawElement(todoitem, toggleCallback);
      base.appendChild(element);
    });
  }

  drawElement(todoitem, toggleCallback) {
    const {id, description} = todoitem;
    const li = document.createElement('li');
    li.dataset.id = id;
    const toggle = document.createElement('input');
    toggle.setAttribute('class', 'toggle');
    toggle.setAttribute('type', 'checkbox');
    if(M.isDone(todoitem))
      toggle.setAttribute('checked', M.isDone(todoitem));
    toggle.addEventListener('click', toggleCallback.bind(null, id));
    li.appendChild(toggle);
    const body = document.createElement('label');
    const bodyContent = document.createTextNode(description);
    if(M.isDone(todoitem))
      body.setAttribute('style', 'text-decoration:line-through');
    body.appendChild(bodyContent);
    li.appendChild(body);
    return li;
  }
}