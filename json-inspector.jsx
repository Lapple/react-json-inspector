var React = require('react');

var Leaf = require('./lib/leaf.jsx');
var SearchBar = require('./lib/search-bar.jsx');
var Highlighter = require('./lib/highlighter.jsx');

var searcher = require('./lib/searcher.js');

var DEFAULT_JUMP_POSITION = -1;
var SEARCH_JUMP_OFFSET = 30 // px;

var Inspector = React.createClass({
    getDefaultProps: function() {
        return {
            className: '',
            search: true
        };
    },
    getInitialState: function() {
        return {
            query: null,
            flatdata: null,
            jumpPosition: DEFAULT_JUMP_POSITION
        };
    },
    render: function() {
        return <div className={ 'json-inspector ' + this.props.className }>
            { this.renderSearchBar() }
            <Leaf data={ this.props.data } label='root' prefix='' isExpanded={ this.isExpanded } format={ this.formatter } key={ this.state.query } />
        </div>;
    },
    renderSearchBar: function() {
        if (this.props.search) {
            return <SearchBar onChange={ this.search } onEnter={ this.jump } />;
        }
    },
    isExpanded: function(value, label, prefix) {
        var query = this.state.query;
        var path = prefix + '.' + label;

        if (!prefix) {
            return true;
        }

        if (query && this.state.searcher(query).parents.hasOwnProperty(path)) {
            return true;
        }

        return false;
    },
    search: function(query) {
        this.setState({
            query: query,
            jumpPosition: DEFAULT_JUMP_POSITION,
            searcher: searcher(this.props.data)
        });
    },
    jump: function() {
        this.setState({
            jumpPosition: this.state.jumpPosition + 1
        });
    },
    formatter: function(string) {
        return <Highlighter string={ string } query={ this.state.query } />;
    },
    componentWillUpdate: function(p, s) {
        if (s.query && s.jumpPosition !== DEFAULT_JUMP_POSITION) {
            var matches = Object.keys(s.searcher(s.query).matches);
            var position = s.jumpPosition % matches.length;

            try {
                scrollTo(leafElement(matches[position]));
            } catch(e) {}
        }
    }
});

function leafElement(path) {
    return document.getElementById('leaf-' + path);
}

function scrollTo(el) {
    var box = el.getBoundingClientRect();
    var body = document.body;

    body.scrollTop = (window.pageYOffset || body.scrollTop) + box.top - SEARCH_JUMP_OFFSET;
}

module.exports = Inspector;
