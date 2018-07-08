function log(v) {
  console.log.apply(console, arguments);  // apply 아래에..
  return v;
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
function _reduce(list, iter, memo) {
  if (arguments.length == 2) {
    memo = list[0];
    list = _rest(list);
  }
  _each(list, function(val) {
    memo = iter(memo, val);
  });
  return memo;
}

// curry
function _curry(fn) {
  return function(a, b) {
    return arguments.length == 2 ? fn(a, b) : function(b) { return fn(a, b); };
  }
}

// go
function _go(arg) {
  var fns = _rest(arguments);
  return _pipe.apply(null, fns)(arg); // apply https://blog.weirdx.io/post/3214
}

// pipe
function _pipe() {
  var fns = arguments;
  return function(arg) {
    return _reduce(fns, function(arg, fn) {
      return fn(arg);
    }, arg);
  }
}

// ES6에서는 객체 자체를 iterator로 생성하는 방식으로 처리
log('1__', [1, 2, 3], document.querySelectorAll("body"), { 1: 'aa', 2: 'bb', 3: 'cc' })
// es6 버전으로 변형 시킬 예정
// JS의 7가지 내장 타입
// https://github.com/Functional-JavaScript/FunctionalES/blob/master/articles/ES6%2C%20%ED%95%A8%EC%88%98%ED%98%95%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%2C%20%EB%B9%84%EB%8F%99%EA%B8%B0%2C%20%EB%8F%99%EC%8B%9C%EC%84%B1%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D/1.%20%ED%83%80%EC%9E%85%EA%B3%BC%20%EA%B0%92.md
/*
null
undefined
boolean
number
string
object
symbol  * ADD
*/

// es5 자료형
// Boolean
// Number
// String
// Null
// Undefined
// Object

function getVowels(str) {
  var m = str.match(/[aeiou]/gi);
  return m;
}

log('2__', getVowels('sky'));

var ss;
log('3__', ss)

var myVariable = true;
log('4__', myVariable)

var myVariable = 10;
log('5__', myVariable)

var myVariable = document.querySelector('button');
log('6__', myVariable)
log('7__', { 1: 'aa', 2: 'bb', a: 'cc', b: 'dd' })
log('8__', typeof { 1: 'aa', 2: 'bb', a: 'cc', b: 'dd' } == 'object')


// 원시값임에도 불구하고 객체와 같이 참조하는 메모리의 주소를 가지고 비교
// new 연산자를 이용하면 오류...
log('9__', Symbol('a') === Symbol('a'));
// https://blog.perfectacle.com/2017/04/16/es6-symbol/
// 정확하게 언제 쓰는지는..????

// symbol iterator - 반복 요소를 끊어서 실행할 수 있다. (함수로도 가능)
// https://gist.github.com/qodot/ecf8d90ce291196817f8cf6117036997
// https://blog.perfectacle.com/2017/04/22/es6-iterator/
/*
위 타입은 다시 크게 두 가지로 나눌 수 있습니다. 객체(object)와 객체가 아닌 것입니다. 위 7가지 타입에서 객체를 제외한 모든 값은 원시 값이며, 원시 값의 경우 인자로 전달하거나 할당할 때 항상 값 복사가 이루어지고, 객체의 경우는 항상 레퍼런스 사본을 만듭니다.
*/
var a = 10;
function f1(a2) {
  a2 = 5;
  log('10__', a2); // 5
  log('11__', a); // 10
}
f1(a);

const obj = { value: 10 };
function f2(obj2) {
  obj2.value = 5;
  log('12__', obj2); // { value: 5 }
  log('13__', obj); // { value: 5 }
  log('14__', obj == obj2); // true
}
f2(obj);


// array.from => arrayLike array로 가능
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/from

// es6 style
// const hasIter = coll => !!coll[Symbol.iterator]
// const curry = f => (a, ..._) => _[0] === undefined ? (..._) => f(a, ..._) : f(a, ..._);
// const mapIter = baseMFIter(
//   (res, a, b) => push(res, b),
//   (res, k, a, b) => set(res, k, b));
// const map = curry((f, coll) =>  // curry는 입력을 다 받아야 실행
//     hasIter(coll) ? mapIter(f, coll, []) : mapIter(f, entriesIter(coll), {}));
// console.log(map([1,2,3], (a) => (a+1)))

// const, let, promise(async await)....