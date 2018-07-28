import { p } from 'genf';
import eq from './lib/eq';
import set from './lib/set';
import flow from './lib/flow';

class TodoItem {
  id = NaN;
  description = '';
  static WORKING = Symbol('Working');
  static DONE = Symbol('Done');

  constructor(id, description) {
    this.id = id == null ? this.id : id;
    this.description = description || this.description;
    this.status = TodoItem.WORKING;
  }
}

export const isDone = p.pipe(
  p.partial(p.prop, 'status'),
  p.partial(eq, TodoItem.DONE)
);

export const done = p.partial(set, 'status', TodoItem.DONE);

export const start = p.partial(set, 'status', TodoItem.WORKING);

export default class Model {
  storage = new Map();
  id = 0;

  get uid() {
    return this.id++;
  }
}

export const addTodo = p.pipe(
  p.wrap,
  p.partial(
    flow,
    ([desc, model]) => flow(
      id => flow(
        storage => flow(
          item => flow(
            register => register(id, item),
          p.tie(storage, Map.prototype.set)),
          Reflect.construct(TodoItem, p.wrap(id, desc))),
        p.prop('storage', model)),
      p.prop('uid', model))
  )
);

export const getTodo = p.pipe(
  p.wrap,
  p.partial(
    flow,
    ([id, model]) => flow(
      storage => flow(
        getter => getter(id) || Reflect.construct(TodoItem),
      p.tie(storage, Map.prototype.get)),
    p.prop('storage', model))
  )
);

export const removeTodo = p.pipe(
  p.wrap,
  p.partial(
    flow,
    ([id, model]) => flow(
      storage => flow(
        remover => remover(id),
        p.tie(storage, Map.prototype.delete)),
      p.prop('storage', model))
  )
);

export const finishTodo = p.pipe(
  p.wrap,
  p.partial(
    flow,
    ([id, model]) => flow(
      done,
    getTodo(id, model))
  )
);

export const beginTodo = p.pipe(
  p.wrap,
  p.partial(
    flow,
    ([id, model]) => flow(
      start,
      getTodo(id, model))
  )
);