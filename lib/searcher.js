var flatten = require('flat');

var ROOT_LABEL = 'root';
var PATH_DELIMITER = '.';

module.exports = function(data) {
    var queries = {};
    var paths = flatten(data, { delimiter: PATH_DELIMITER });

    return function(query) {
        if (!queries[query]) {
            queries[query] = getMatchedPaths(paths, query);
        }

        return queries[query];
    };
};

function getMatchedPaths(paths, query) {
    var matches = {};
    var parents = {};

    var segments;

    for (var path in paths) {
        if (doesMatch(query, paths[path], path)) {
            segments = path.split(PATH_DELIMITER);

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
    var prefix = PATH_DELIMITER + ROOT_LABEL + PATH_DELIMITER;

    if (path.indexOf(prefix) === 0) {
        return path;
    } else {
        return prefix + path;
    }
}
