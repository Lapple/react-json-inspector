var assign = require('object-assign');
var keys = Object.keys;

var type = require('./type.js');
var isEmpty = require('./is-empty.js');

module.exports = function(data) {
    var cache = {};

    return function(query) {
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
