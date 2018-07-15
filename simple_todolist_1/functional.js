const users = [
    {id: '1', age: 10, name: 'Kim1'},
    {id: '2', age: 12, name: 'Kim2'},
    {id: '3', age: 17, name: 'Kim3'},
    {id: '4', age: 21, name: 'Kim4'},
    {id: '5', age: 25, name: 'Kim5'},
    {id: '6', age: 29, name: 'Kim6'},
];

const _each = (list, iter) => {
    const l = list.length;
    for (let i = 0; i < l; ++i) {
        iter(list[i]);
    }
};

const _map = (list, iter) => {
    let new_list = [];
    _each(list, function (value) {
        new_list.push(iter(value));
    })
    return new_list;
};

const _filter = (list, predi) => {
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
const _curry2 = f => (...args) => args.length < 2 ? (...args2) => f(...args, ...args2) : f(...args);

/******** *********/

const _get = _curryr(function (obj, key) {
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

_go(users,
    function (users) {
        return _filter(users, function (user) {
            return user.age >= 20;
        })
    },
    function (users) {
        return _map(users, _get('name'));
    },
    console.log
)


const _values = (data) => {
    return _map(data, function (value) {
        return value;
    });
};

const _isArray = obj => Object.prototype.toString.call(obj) == '[object Array]';

