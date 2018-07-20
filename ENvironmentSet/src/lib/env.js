import { p } from 'genf';

class Scope {
  constructor(outer = null) {
    this.record = new Map();
    this.outer = outer;
  }

  get(identifier) {
    let record = this.record;
    while(record !== null) {
      if(record.has(identifier))
        return record.get(identifier);
      else record = record.outer;
    }
  }

  set(identifier, value) {
    const record = this.record;
    record.set(identifier, value);
    return value;
  }
}

class Environment {
  constructor() {
    this.scope = new Scope;
    this.last = undefined;
  }

  insert(f) {
    const newScope = new Scope(this.scope);
    this.scope = newScope;
    return p.call(f, this.last, newScope);
  }
}

export function env() {
  return new Environment;
}

export const insert = (f, env) => env.insert(f);
//TODO: Be functional!