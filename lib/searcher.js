var flatten = require('flat');
var memoize = require('memoizejs');

var ROOT_LABEL = 'root';
var PATH_DELIMITER = '.';

module.exports = function(data) {
    return memoize(getMatchedPaths.bind(null, flatten(data, { delimiter: PATH_DELIMITER })));
};

function getMatchedPaths(paths, query) {
    var matches = {};
    var parents = {};

    for (var path in paths) {
        if (doesMatch(query, paths[path], path)) {
            var segments = path.split(PATH_DELIMITER);

            matches[getAbsolutePath(path)] = null;

            while (segments.length) {
                segments.pop();
                parents[getAbsolutePath(segments.join(PATH_DELIMITER))] = null;
            }
        }
    }

    return {
        matches: matches,
        parents: parents
    };
}

function doesMatch(query, value, key) {
    return String(key).indexOf(query) !== -1 || (value && String(value).indexOf(query) !== -1);
}

function getAbsolutePath(path) {
    return PATH_DELIMITER + ROOT_LABEL + PATH_DELIMITER + path;
}
