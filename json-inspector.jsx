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
            data: null,
            search: true,
            className: '',
            id: 'json-' + Math.random(),
            onClick: noop
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
            { this.renderToolbar() }
            <Leaf data={ this.props.data }
                label='root'
                prefix=''
                onClick={ this.props.onClick }
                id={ this.props.id }
                isExpanded={ this.isExpanded }
                format={ this.formatter }
                key={ this.state.query } />
        </div>;
    },
    renderToolbar: function() {
        if (this.props.search) {
            return <div className='json-inspector__toolbar'>
                <SearchBar onChange={ this.search } onEnter={ this.jump } />
                { this.renderSearchCount() }
            </div>;
        }
    },
    renderSearchCount: function() {
        var s = this.state;
        var current = s.jumpPosition;

        if (current !== DEFAULT_JUMP_POSITION) {
            var total = this.getMatches().length;
            var result = 'Nothing found';

            if (total > 0) {
                result = ((current % total) + 1) + ' of ' + total;
            }

            return <span className='json-inspector__counter'>
                { result }
            </span>;
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
            jumpPosition: query ? 0 : DEFAULT_JUMP_POSITION
        });
    },
    jump: function() {
        if (this.state.query) {
            this.setState({
                jumpPosition: this.state.jumpPosition + 1
            });
        }
    },
    formatter: function(string) {
        return <Highlighter string={ string } query={ this.state.query } />;
    },
    componentDidMount: function() {
        this.createSearcher(this.props.data);
    },
    componentWillReceiveProps: function(p) {
        this.createSearcher(p.data);
    },
    componentWillUpdate: function(p, s) {
        if (s.query && s.jumpPosition !== DEFAULT_JUMP_POSITION) {
            var matches = this.getMatches();
            var position = s.jumpPosition % matches.length;

            try {
                scrollTo(leafElement(matches[position]));
            } catch(e) {}
        }
    },
    createSearcher: function(data) {
        this.setState({
            searcher: searcher(data)
        });
    },
    getMatches: function() {
        return Object.keys(this.state.searcher(this.state.query).matches);
    }
});

function noop() {}

function leafElement(path) {
    return document.getElementById('leaf-' + path);
}

function scrollTo(el) {
    var box = el.getBoundingClientRect();
    var body = document.body;

    body.scrollTop = (window.pageYOffset || body.scrollTop) + box.top - SEARCH_JUMP_OFFSET;
}

module.exports = Inspector;
