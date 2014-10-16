var React = require('react');

var Leaf = require('./lib/leaf.jsx');
var SearchBar = require('./lib/search-bar.jsx');
var Highlighter = require('./lib/highlighter.jsx');

var searcher = require('./lib/searcher.js');

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
            <Leaf data={ this.props.data } label='root' prefix='' isExpanded={ this.isExpanded } format={ this.formatter } key={ this.state.query } />
        </div>;
    },
    isExpanded: function(value, label, prefix) {
        var query = this.state.query;
        var path = prefix + '.' + label;

        if (!prefix) {
            return true;
        }

        if (query && this.state.searcher(query).hasOwnProperty(path)) {
            return true;
        }

        return false;
    },
    search: function(query) {
        if (!this.state.searcher) {
            this.setState({ searcher: searcher(this.props.data) });
        }

        this.setState({ query: query });
    },
    formatter: function(string) {
        return <Highlighter string={ string } query={ this.state.query } />;
    }
});

module.exports = Inspector;
