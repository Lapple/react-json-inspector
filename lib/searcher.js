var flatten = require('flat');
var memoize = require('memoizejs');

var ROOT_LABEL = 'root';
var PATH_DELIMITER = '.';

module.exports = function(data) {
    return memoize(getMatchedPaths.bind(null, flatten(data)));
};

function getMatchedPaths(paths, query) {
    var result = {};

    for (var path in paths) {
        if (doesMatch(query, paths[path], path)) {
            var segments = path.split(PATH_DELIMITER);

            while (segments.length) {
                result[PATH_DELIMITER + ROOT_LABEL + PATH_DELIMITER + segments.join(PATH_DELIMITER)] = null;
                segments.pop();
            }
        }
    }

    return result;
}

function doesMatch(query, value, key) {
    return String(key).indexOf(query) !== -1 || (value && String(value).indexOf(query) !== -1);
}
