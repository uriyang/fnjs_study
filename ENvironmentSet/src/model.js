import { p } from "genf";
import enumGen from './lib/enum';
import inf from './lib/inf';
import fetch from './lib/fetch';
import env from './lib/env';
import set from './lib/set';

const TodoItemStorage = new Map();
const TODO_STATUS = enumGen('WORKING', 'FINISHED');
const TODO_ID = inf();

class TodoItem {
  constructor(id, desc) {
    this.id = id;
    this.desc = desc;
    this.status = TODO_STATUS.WORKING;
  }
}

export function createTodo(desc) {
  const id = fetch(TODO_ID);
  const todo = new TodoItem(id, desc);
  TodoItemStorage.set(id, todo);
  return todo;
}
//TODO: Be functional!

export const find = id => TodoItemStorage.get(id);

export const remove = id => TodoItemStorage.delete(id);

export const end = p.pipe(
  find,
  p.If(p.isRefable,
    p.partial(p.tap, p.partial(set, p._, 'status', p.prop('FINISHED', TODO_STATUS))),
    p.identity
    )
);

export const run = p.pipe(
  find,
  p.If(p.isRefable,
    p.partial(p.tap, p.partial(set, p._, 'status', p.prop('WORKING', TODO_STATUS))),
    p.identity
  )
);