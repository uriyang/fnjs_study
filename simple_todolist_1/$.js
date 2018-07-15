!function() {
    const $ = {};

    $.selAll = sel => document.querySelector(sel);
    $.selChild = (p, sel) => p.querySelector(sel);

    $.el = html => {
        var parent = document.createElement('div');
        parent.innerHTML = html;
        return parent.children[0];
    };

    $.createElement = tag => {
        return document.createElement(tag);
    };

    $.attr = (tag, attr, v) => {
        tag[attr] = v
    };

    $._appendChild = function (p, cn) {
        if (arguments.length == 1) {
            c => $._appendChild(p, c);
        } else if (arguments.length == 2) {
            if (_isArray(cn)) {
                _reduce(cn, function (p, child) {
                    p.appendChild(child);
                    return p;
                }, p);
            } else {
                p.appendChild(cn);
            }
        }
    };

    $.append = _curry2($._appendChild);

    $.addOnClick = (e, f) => e.onClick = f;
    $.addOnChange = (e, f) => e.onChange = f;
    window.$ = $;
}();