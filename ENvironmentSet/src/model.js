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

  isDone() {
    return this.status === TodoItem.DONE;
  }

  done() {
    return this.status = TodoItem.DONE;
  }

  start() {
    return this.status = TodoItem.WORKING;
  }
}

export default class Model {
  storage = new Map();
  id = 0;

  get uid() {
    return this.id++;
  }

  addTodo(desc) {
    const id = this.uid;
    const storage = this.storage;
    const item = new TodoItem(id, desc);
    storage.set(id, item);
    return item;
  }

  getTodo(id) {
    const storage = this.storage;
    return storage.get(id);
  }

  removeTodo(id) {
    const storage = this.storage;
    storage.delete(id);
    return id;
  }

  finishTodo(id) {
    const target = this.getTodo(id);
    return target == null ? target : target.done();
  }

  beginTodo(id) {
    const target = this.getTodo(id);
    return target == null ? target : target.start();
  }
}