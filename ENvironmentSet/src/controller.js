import eq from './lib/eq';
import View from './view';
import Model, * as M from './model';
import flow from './lib/flow';
import { p } from 'genf';
import set from './lib/set';

export default class Controller {
  model = new Model;
  view = new View;

  constructor(view, model) {
    this.view = view || this.view;
    this.model = model || this.model;
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

const addTodo = (controller, element) => flow(
  model => flow(
    view => flow(
      desc => flow(
        draw => flow(
          _ => {
            M.addTodo(desc, model);
            p.call(p.tie(view, draw), model.storage, p.partial(onClickEvent, controller));
            },
          set('value', '', element)),
        p.prop('draw', view)),
      p.prop('value', element)),
    p.prop('view', controller)),
  p.prop('model', controller)
);

export const onKeyEvent = p.pipe(
  p.wrap,
  p.If(
    p.pipe(
      p.cdr,
      p.car,
      p.partial(p.prop, 'keyCode'),
      p.partial(eq, 13)
    ),
    ([controller, event]) => flow(
      target => addTodo(controller, target),
      p.prop('target', event)
    )
  )
);

export const onClickEvent = (controller, id, event) => flow(
  p.If(
    p.partial(p.prop, 'checked'),
    p.partial(finishTodo, controller, id),
    p.partial(startTodo, controller, id)
  ),
  p.prop('target', event)
);

const finishTodo = (controller, id) => flow(
  model => flow(
    view => flow(
      storage => flow(
        draw => {
          M.finishTodo(id, model);
          p.call(p.tie(view, draw), storage, p.partial(onClickEvent, controller));
        },
      p.prop('draw', view)),
      p.prop('storage', model)),
    p.prop('view', controller)),
  p.prop('model', controller)
);

const startTodo = (controller, id) => flow(
  model => flow(
    view => flow(
      storage => flow(
        draw => {
          M.beginTodo(id, model);
          p.call(p.tie(view, draw), storage, p.partial(onClickEvent, controller));
        },
        p.prop('draw', view)),
      p.prop('storage', model)),
    p.prop('view', controller)),
  p.prop('model', controller)
);