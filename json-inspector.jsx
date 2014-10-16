var React = require('react');
var flatten = require('flat');

var Leaf = require('./components/leaf.jsx');
var SearchBar = require('./components/search-bar.jsx');

var ROOT_LABEL = 'root';
var PATH_DELIMITER = '.';

var Inspector = React.createClass({
    getInitialState: function() {
        return {
            query: null,
            flatdata: null
        };
    },
    render: function() {
        return <div>
            <SearchBar onChange={ this.search } />
            <Leaf data={ this.props.data } label={ ROOT_LABEL } prefix='' isExpanded={ this.isExpanded } key={ this.state.query } />
        </div>;
    },
    isExpanded: function(value, label, prefix) {
        var query = this.state.query;
        var path = prefix + PATH_DELIMITER + label;

        if (!prefix) {
            return true;
        }

        if (query && getMatchedPaths(query, this.state.flatdata).hasOwnProperty(path)) {
            return true;
        }

        return false;
    },
    search: function(query) {
        if (!this.state.flatdata) {
            this.setState({ flatdata: flatten(this.props.data, { delimiter: PATH_DELIMITER }) });
        }

        this.setState({ query: query });
    }
});

var _cache = {};

function getMatchedPaths(query, paths) {
    var result;

    if (!_cache[query]) {
        result = {};

        for (var path in paths) {
            if (doesMatch(query, paths[path], path)) {
                var segments = path.split(PATH_DELIMITER);

                while (segments.length) {
                    result[PATH_DELIMITER + ROOT_LABEL + PATH_DELIMITER + segments.join(PATH_DELIMITER)] = null;
                    segments.pop();
                }
            }
        }

        _cache[query] = result;
    }

    return _cache[query];
}

function doesMatch(query, value, key) {
    return key.indexOf(query) !== -1 || (value && value.indexOf(query) !== -1);
}

module.exports = Inspector;
