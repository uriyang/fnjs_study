const users = [
    {id: '1', age: 10, name: 'Kim1'},
    {id: '2', age: 12, name: 'Kim2'},
    {id: '3', age: 17, name: 'Kim3'},
    {id: '4', age: 21, name: 'Kim4'},
    {id: '5', age: 25, name: 'Kim5'},
    {id: '6', age: 29, name: 'Kim6'},
];

// _each 에 null 이 들어가도 error 발생하지 않도록
// const _each = (list, iter) => {
//     var _length = _get('length');
//     for (let i = 0, len = _length(list); i < len; ++i) {
//         iter(list[i]);
//     }
// };

// _each 다형성 높이기
const _each = (list, iter) => {
    var keys = _keys(list);
    for (let i = 0, len = keys.length ; i < len; ++i) {
        iter(list[keys[i]], keys[i]);
    }
};

var _map = (list, iter) => {
    let new_list = [];
    _each(list, function (value, key) {
        new_list.push(iter(value, key));
    })
    return new_list;
};

var _filter = (list, predi) => {
    let new_list = [];
    _each(list, function (value) {
        if (predi(value)) new_list.push(value);
    })
    return new_list;
}

const slice = Array.prototype.slice;
const _rest = (list, num) => {
    return slice.call(list, num || 1);
};

const _reduce = (list, iter, memo) => {
    if (!memo) {
        memo = list[0];
        list = _rest(list);
    }
    _each(list, function (value) {
        memo = iter(memo, value);
    });
    return memo;
};

/******** *********/
    // ES5
const _curry = function (f) {
        return function (a, b) {
            if (arguments.length == 2) return f(a, b);
            return function (b) {
                return f(a, b);
            }
        }
    };

const _curryr = function (f) {
    return function (a, b) {
        if (arguments.length == 2) return f(a, b);
        return function (b) {
            return f(b, a);
        }
    }
};

// ES6
var _curry2 = f => (...args) => args.length < 2 ? (...args2) => f(...args, ...args2) : f(...args);

/******** *********/

var _get = _curryr(function (obj, key) {
    return obj == null ? undefined : obj[key];
});
// console.log(_get('name')(users[1]));

const _pipe = function () {
    var fns = arguments;
    return function (arg) {
        return _reduce(fns, function (arg, fn) {
            return fn(arg);
        }, arg);
    }
};

// var f1 = _pipe(
//     function (a) { return a + 1; },
//     function (a) { return a + 2; },
// );
// console.log(f1(1)); // 4

const _go = function (arg) {
    var fns = _rest(arguments);
    return _pipe.apply(null, fns)(arg);
};

// _go(1,
//     function (a) { return a + 1; },
//     function (a) { return a + 1; },
//     function (a) { return a + 1; },
//     console.log
// );

// _go(users,
//     function (users) {
//         return _filter(users, function (user) {
//             return user.age >= 20;
//         })
//     },
//     function (users) {
//         return _map(users, _get('name'));
//     },
//     console.log
// );

var _map = _curryr(_map);
var _filter = _curryr(_filter);

// console.log (
//     _map([1, 2, 3], function (val) {
//         return val * 2;
//     })
// );
//
// console.log (
//     _map(function (val) {return val * 2;})([1, 2, 3])
// );

// _go(users,
//     _filter(function (user) { return user.age >= 20;}),
//     _map(_get('name')),
//     console.log
// );
//
// _go(null,
//     _filter(function (user) { return user.age >= 20;}),
//     _map(_get('name')),
//     console.log
// );
const _isArray = obj => Object.prototype.toString.call(obj) == '[object Array]';

function _is_object(obj) {
    return typeof obj == 'object' && !!obj;
}

function _keys (obj) {
    return _is_object(obj) ? Object.keys(obj) : [];
}

// _each({
//     13: 'ID',
//     19: 'HD',
//     29: 'YD',
// }, function (name) {
//     console.log(name);
// });
//
// console.log(
//     _map({
//         13: 'ID',
//         19: 'HD',
//         29: 'YD',
//     }, function (name) {
//         return name.toLowerCase();
//     })
// );

/** 콜렉션 **/
/** 1. 수집하기 **/
function _identity(val) { return val; }
var _values = _map(_identity);

// ex) _pluck(users, 'age');
// -> [10, 11, 12, ...]
function _pluck(data, key) {
    return _map(data, _get(key));
}

/** 2. 거르기 **/
// reject -> true 인 값을 배제한 나머지를 반환
// compact -> true 인 값들만 반환

// function _reject(data, predi) {
//     return _filter(data, function (obj) {
//         return !predi(obj);
//     });
// };
// 위 reject -> filter 의 predi func는 negate 와 같다.
function _negate(func) {
    return function (val) {
        return !func(val);
    }
}
var _reject = _curryr(function _reject(data, predi) {
    return _filter(data, _negate(predi));
});

// _compact([1, 2, 0, false, null, {}]);
// -> [1, 2, {}]
var _compact = _filter(_identity);
// console.log( _compact([1, 2, 0, false, null, {}]) );

/** 3. 찾아내기 **/
// function _find(list, predi) {
//     var keys = _keys(list);
//     for (let i = 0, len = keys.length ; i < len; ++i) {
//         var val = list[keys[i]];
//         if (predi(val)) return val;
//     }
// }
var find = _curryr(function (list, predi) {
    var keys = _keys(list);
    for (let i = 0, len = keys.length ; i < len; ++i) {
        var val = list[keys[i]];
        if (predi(val)) return val;
    }
});

var _find_index = _curryr(function _find_index(list, predi) {
    var keys = _keys(list);
    for (let i = 0, len = keys.length ; i < len; ++i) {
        if (predi(list[keys[i]])) return i;
    }
    return -1;
});

// console.log(
//     _get(_find(users, function (user) {
//         return user.id == 3;
//     }), 'name')
// );

// { id: 3, age: 17, name: 'Kim3' }
// _go(users,
//     find(function (user) { return user.id == 3; }),
//     console.log
// );

// Kim3
// _go(users,
//     find(function (user) { return user.id == 3; }),
//     _get('name'),
//     console.log
// );

// ex) some : 조건에 하나라도 부합하는 값이 존재하면 true 반환
// _some([1, 2, 5, 10, 20], function (val) {
//     return val > 10;
// }) -> true
// ex) every 는 some 과 비슷한데, 모든 값이 조건과 부합해야 true 반환
function _some(data, predi) {
    return _find_index(data, predi || _identity) != -1;
}
// console.log(
//     _some([1, 2, 5, 10, 20], function (val ) { return val > 20; })
// );

// evaluate 시에 false 가 한개도 나오지 않아야 true
// 설명
// - _negate 를 사용하지 않으면, true 를 찾는 함수가 되는데,
//   _negate 를 사용하여 false 를 찾는 함수로 변화시킴
function _every(data, predi) {
    return _find_index(data, _negate(predi || _identity)) == -1;
}
// console.log(
//     _every([1, 2, 5, 10, 20], function (val ) { return val > 0; })
// );

/** _some, every 는 predicate func 가 없어도 실행이 되야하므로
 * || 연산자로 _identity 를 predi func 로 삽입함
 * _some without predi func - 원소들 중 true 를 반환하는 것이 존재하는 지
 * _every without predi func - 모든 원소가 true 를 반환하는 지
 * **/
/*
console.log(_some([0, false, null, 1, {}])); // true
console.log(_some([0, false, null])); // false
console.log(_every([0, false, null])); // false
console.log(_some([1, true, {}])); // true
*/

/** 4. 접기 혹은 축약 **/
/** reduce 는 array 혹은 iterable 한 객체의 값들을 통해서
    축약, 집계, merge 된 값 등등을 위해서 쓰인다.
   그런데, reduce 를 for state 의 대체 함수로 사용하는 경우가 종종있음
   그보다는 순수함수로써, 평가순서와 상관없이 접기, 축약을 하는 데
   쓰인다고 이해하는 것이 필요함 **/
function _min(data) {
    return _reduce(data, function (a, b) {
        return a < b ? a : b;
    });
}
// console.log(_min([1, 2, 4, 5, 10, -5])); // -4
function _max(data) {
    return _reduce(data, function (a, b) {
        return a > b ? a : b;
    });
}
// console.log(_max([1, 2, 4, 5, 10, -5])); // 10


// min_by, max_by 는 어떤 조건으로 비교할 것인가를 추가한 것으로
// 추가적으로 iterator 를 전달받는다.
function _min_by(data, iter) {
    return _reduce(data, function (a, b) {
        return iter(a) < iter(b) ? a : b;
    });
}

function _max_by(data, iter) {
    return _reduce(data, function (a, b) {
        return iter(a) > iter(b) ? a : b;
    });
}

var _min_by = _curryr(_min_by),
    _max_by = _curryr(_max_by);

// console.log( _min_by([1, 2, 4, 10, 5, -4], Math.abs) ); // 1
// console.log( _max_by([1, 2, 4, 10, 5, -11], Math.abs) ); // -11
/* 만약 _max_by 를 쓰지않고 아래처럼 _map 에 abs 를 먼저 적용하고 _max 를
   실행한다면 -11 이 아닌 11이 반환되는 상황이 있다.
console.log(_max(_map([1, 2, 4, 10, 5, -11], Math.abs)));
*/

// 가장 나이가 적은 user 찾아내기
// console.log(
//     _min_by(users, function (user) {
//         return user.age;
//     })
// );

/*
// 10대 중에서 나이가 가장 적은 user 찾아내기
_go(users,
    _filter(user => user.age >= 10 && user.age < 20),
    _min_by(_get('age')),
    console.log
);

// 위에서 나온 user 의 name 을 출력
_go(users,
    _filter(user => user.age >= 10 && user.age < 20),
    _min_by(_get('age')),
    _get('name'),
    console.log
);

// 다른 방법으로 age 를 모두 map 해놓고 그 중 최솟값을 찾아도됨
_go(users,
    _filter(user => user.age >= 10 && user.age < 20),
    _map(_get('age')),
    _min,
    console.log
)
*/

/** 4. 접기 혹은 축약 (이어서) **/
var users2 = [
    {id: 10, name: 'ID', age: 36},
    {id: 20, name: 'BJ', age: 32},
    {id: 30, name: 'JM', age: 32},
    {id: 40, name: 'PJ', age: 27},
    {id: 50, name: 'HA', age: 25},
    {id: 60, name: 'JE', age: 26},
    {id: 70, name: 'JI', age: 31},
    {id: 80, name: 'MP', age: 23},
    {id: 90, name: 'FP', age: 13},
];
// group_by 실행하면 객체가 반환되어야 함
// var user3 = {
//     36: [{id: 10, name: 'ID', age: 36}],
//     32: [{id: 20, name: 'BJ', age: 32},
//          {id: 30, name: 'JM', age: 32}],
//      ...
// };

function _push(obj, key, val) {
    (obj[key] = obj[key] || []).push(val);
    return obj;
}

var _group_by = _curryr(function (data, iter) {
    return _reduce(data, function (grouped, val) {
        /* 밑의 3줄은 1줄(_push)로 축약 가능
        // var key = iter(val);
        // (grouped[key] = grouped[key] || []).push(val);
        // return grouped; */
        return _push(grouped, iter(val), val);
    }, {});
});

/*
// 나이별로 group
_go(users2,
    _group_by(user => user.age),
    console.log
);

// 10, 20, 30대를 나누어 group
_go(users2,
    _group_by(user => user.age - user.age % 10),
    console.log
);

// 이름의 첫번째 스펠링으로 group
// 1.
_go(users2,
    _group_by(user => user.name[0]),
    console.log
);
// 2.
var _head = function (list) {
    return list[0];
}

_go(users2,
    _group_by(_pipe(_get('name'), _head)),
    console.log
);
*/

var _inc = function (count, key) {
    count[key] ? count[key]++ : count[key] = 1;
    return count;
}

var _count_by = _curryr(function (data, iter) {
    return _reduce(data, function(count, val) {
        /* 밑의 3줄은 아래 1줄의 return 으로 변환 가능
         var key = iter(val);
         count[key] ? count[key]++ : count[key] = 1;
         return count; */
        return _inc(count, iter(val));
    }, {});
});

// console.log(
//     _count_by(users2, function(user) {
//         return user.age - user.age % 10;
//     })
// );
//
// _go(users2,
//     _count_by(user => user.name[0]),
//     console.log
// );

// map, each 에 key 를 추가

var _pairs = _map(function (val, key) {
    return [key, val];
});
/*
_map(users2[0], function (val, key) {
    console.log(val, key);
});

console.log(
    _map(users2[0], function (val, key) {
        return [key, val];
    })
);

console.log( _pairs(users2[0]) );
*/

// 조금 더 실무적인 예제
/** 1. **/
/*
_go(users2,
    _reject(function (user) { return user.age < 20; }),
    _count_by(function(user) {return user.age - user.age % 10;}),
    _map(function (count, key) { return `<li>${key}대는 ${count}명 입니다.</li>` }),
    list => '<ul>' + list.join('') + '</ul>',
    document.write.bind(document),
);

// 위와 동일한데 f1 자체를 func 로 만들어버림
var f1 = _pipe(
    _reject(function (user) { return user.age < 20; }),
    _count_by(function(user) {return user.age - user.age % 10;}),
    _map(function (count, key) { return `<li>${key}대는 ${count}명 입니다.</li>` }),
    list => '<ul>' + list.join('') + '</ul>',
    document.write.bind(document),
);
f1(users2);
*/

/** 2. **/
// 아래처럼 f1, f2 를 만들면서 조립할 수도 있다.
/*
var f1 = _pipe(
    _count_by(function(user) {return user.age - user.age % 10;}),
    _map(function (count, key) { return `<li>${key}대는 ${count}명 입니다.</li>` }),
    list => '<ul>' + list.join('') + '</ul>',
    document.write.bind(document),
);

var f2 = _pipe(
    _reject(function (user) { return user.age < 20; }),
    f1,
);
f2(users2);
*/




