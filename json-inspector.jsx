var React = require('react');
var flatten = require('flat');

var Leaf = require('./components/leaf.jsx');
var SearchBar = require('./components/search-bar.jsx');

var ON = true;
var _cache = {};

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
            <Leaf data={ this.props.data } label='root' prefix='' isExpanded={ this.isExpanded } key={ this.state.query } />
        </div>;
    },
    isExpanded: function(value, key, prefix) {
        var query = this.state.query;
        var path = prefix + '.' + key;

        if (!prefix) {
            return true;
        }

        if (query && this.getMatchedPaths(query)[path] === ON) {
            return true;
        }

        return false;
    },
    search: function(query) {
        if (!this.state.flatdata) {
            this.setState({ flatdata: flatten(this.props.data) });
        }

        this.setState({ query: query });
    },
    getMatchedPaths: function(query) {
        var result;
        var paths = this.state.flatdata;

        if (!_cache[query]) {
            result = { '.root': ON };

            for (var path in paths) {
                if (doesMatch(query, paths[path], path)) {
                    var segments = path.split('.');

                    while (segments.length) {
                        result['.root.' + segments.join('.')] = ON;
                        segments.pop();
                    }
                }
            }

            _cache[query] = result;
        }

        return _cache[query];
    }
});

function doesMatch(query, value, key) {
    return (key + value).indexOf(query) !== -1;
}

module.exports = Inspector;
