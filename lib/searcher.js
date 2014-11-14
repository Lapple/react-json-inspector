var flatten = require('flat');

var ROOT_LABEL = 'root';
var PATH_DELIMITER = '.';

module.exports = function(data) {
    var queries = {};
    var paths = flatten(data, { delimiter: PATH_DELIMITER });

    return function(query) {
        var subquery;

        if (!queries[query]) {
            for (var i = query.length; i > 0; i -= 1) {
                subquery = query.substr(0, i);

                if (queries[subquery]) {
                    queries[query] = getMatchedPaths(queries[subquery].matches, query);

                    return queries[query];
                }
            }

            queries[query] = getMatchedPaths(paths, query);
        }

        return queries[query];
    };
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
