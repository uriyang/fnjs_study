!function() {
  // curry
  // function _curry(fn) {
  //   return function(a, b) {
  //     return arguments.length == 2 ? fn(a, b) : function(b) { return fn(a, b); };
  //   }
  // }
  const curry = f => (...args) => args.length < 2 ? (...args2) => f(...args, ...args2) : f(...args);

  function log(v) {
    console.log.apply(console, arguments);  // apply 아래에..
    return v; // undefined를 찍지 않는다. PIPE 흐름에 자연스럽게~
  }

  function _is_object(obj) {
    return typeof obj == 'object' && !!obj;
  }

  function _keys(obj) {
    return _is_object(obj) ? Object.keys(obj) : [];
  }

  function _each(list, iter) {
    var keys = _keys(list);
    for (var i = 0, len = keys.length; i < len; i++) {
      iter(list[keys[i]], keys[i]);
    }
    return list;
  }

  // ## map ## //
  // es5 style
  function map(list, mapper) {
    var new_list = [];
    _each(list, function(val, key) {
      new_list.push(mapper(val, key));
    });
    return new_list;
  }

  // ## filter ##
  function _filter(list, predi) {
    var new_list = [];
    _each(list, function(val) {
      if (predi(val)) new_list.push(val);
    });
    return new_list;
  }

  // reduce
  // function _reduce(list, iter, memo) {
  //   if (arguments.length == 2) {
  //     memo = list[0];
  //     list = _rest(list);
  //   }
  //   _each(list, function(val) {
  //     memo = iter(memo, val);
  //   });
  //   return memo;
  // }
  const reduce = curry((f, acc, coll) => {
    for (const val of coll) acc = f(acc, val);
    return acc;
  })

  const find = curry((f, coll) => {
    for (var val of coll) if (f(val)) return val
  })

  // go
  // function _go(arg) {
  //   var fns = _rest(arguments);
  //   return _pipe.apply(null, fns)(arg); // apply https://blog.weirdx.io/post/3214
  // }

  const go = (arg, ...fs) => reduce((arg, f) => f(arg), arg, fs);

  // pipe
  // function _pipe() {
  //   var fns = arguments;
  //   return function(arg) {
  //     return _reduce(fns, function(arg, fn) {
  //       return fn(arg);
  //     }, arg);
  //   }
  // }
  const pipe = (...fs) => arg => reduce((arg, f) => f(arg), arg, fs);

  Object.assign(window, {
    log, curry, pipe, go, reduce, find
  })
} ();