var assign = require('object-assign');
var keys = Object.keys;

var type = require('./type');
var isEmpty = require('./is-empty');

module.exports = function(data) {
    var cache = {};

    return function(query) {
        var subquery;

        if (!cache[query]) {
            for (var i = query.length - 1; i > 0; i -= 1) {
                subquery = query.substr(0, i);

                if (cache[subquery]) {
                    cache[query] = find(cache[subquery], query);
                    break;
                }
            }
        }

        if (!cache[query]) {
            cache[query] = find(data, query);
        }

        return cache[query];
    };
};

function find(data, query) {
    return keys(data).reduce(function(acc, key) {
        var value = data[key];
        var matches;

        if (isPrimitive(value)) {
            if (contains(query, key) || contains(query, value)) {
                acc[key] = value;
            }
        } else {
            if (contains(query, key)) {
                acc[key] = value;
            } else {
                matches = find(value, query);

                if (!isEmpty(matches)) {
                    assign(acc, pair(key, matches));
                }
            }
        }

        return acc;
    }, {});
}

function contains(query, string) {
    return string && String(string).indexOf(query) !== -1;
}

function isPrimitive(value) {
    var t = type(value);
    return t !== 'Object' && t !== 'Array';
}

function pair(key, value) {
    var p = {};
    p[key] = value;
    return p;
}
