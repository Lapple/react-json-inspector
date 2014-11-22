var React = require('react');

var Leaf = require('./lib/leaf.jsx');
var SearchBar = require('./lib/search-bar.jsx');

var searcher = require('./lib/searcher.js');
var noop = require('./lib/noop.js');

var DEFAULT_JUMP_POSITION = -1;
var SEARCH_JUMP_OFFSET = 30 // px;

var Inspector = React.createClass({
    getDefaultProps: function() {
        return {
            data: null,
            search: true,
            className: '',
            id: 'json-' + Date.now(),
            onClick: noop,
            validateQuery: function(query) {
                return query.length >= 2;
            }
        };
    },
    getInitialState: function() {
        return {
            query: '',
            jumpPosition: DEFAULT_JUMP_POSITION
        };
    },
    render: function() {
        var p = this.props;
        var s = this.state;

        return <div className={ 'json-inspector ' + p.className }>
            { this.renderToolbar() }
            <Leaf data={ p.data }
                onClick={ p.onClick }
                id={ p.id }
                query={ s.query }
                updated={ s.searcher && s.searcher(s.query).parents }
                matches={ s.searcher && s.searcher(s.query).matches }
                isRoot={ true } />
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

        if (s.query && current !== DEFAULT_JUMP_POSITION) {
            var total = this.getMatches(s.query).length;
            var result = 'Nothing found';

            if (total > 0) {
                result = ((current % total) + 1) + ' of ' + total;
            }

            return <span className='json-inspector__counter'>
                { result }
            </span>;
        }
    },
    search: function(query) {
        if (this.props.validateQuery(query) || query.length === 0) {
            this.setState({
                query: query,
                jumpPosition: query ? 0 : DEFAULT_JUMP_POSITION
            });
        }
    },
    jump: function() {
        if (this.state.query) {
            this.setState({
                jumpPosition: this.state.jumpPosition + 1
            });
        }
    },
    componentDidMount: function() {
        this.createSearcher(this.props.data);
    },
    componentWillReceiveProps: function(p) {
        this.createSearcher(p.data);
    },
    componentWillUpdate: function(p, s) {
        if (s.query && s.jumpPosition !== DEFAULT_JUMP_POSITION) {
            var matches = this.getMatches(s.query);
            var position = s.jumpPosition % matches.length;

            try {
                scrollTo(leafElement(matches[position]));
            } catch(e) {}
        }
    },
    shouldComponentUpdate: function (p, s) {
        return s.jumpPosition !== this.state.jumpPosition ||
            s.query !== this.state.query ||
            p.data !== this.props.data ||
            p.onClick !== this.props.onClick;
    },
    createSearcher: function(data) {
        this.setState({
            searcher: searcher(data)
        });
    },
    getMatches: function(query) {
        return Object.keys(this.state.searcher(query).matches);
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
