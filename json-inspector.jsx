var React = require('react');

var Leaf = require('./lib/leaf.jsx');
var SearchBar = require('./lib/search-bar.jsx');

var filterer = require('./lib/filterer.js');
var isEmpty = require('./lib/is-empty.js');
var lens = require('./lib/lens.js');
var noop = require('./lib/noop.js');

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
            query: ''
        };
    },
    render: function() {
        var p = this.props;
        var s = this.state;

        var data = s.query ? s.filterer(s.query) : p.data;
        var leaf = <Leaf data={ data } label='root' onClick={ p.onClick } id={ p.id } query={ s.query } isRoot={ true } getOriginal={ this.getOriginal } />;
        var notFound = <div className='json-inspector__not-found'>Nothing found</div>;

        return <div className={ 'json-inspector ' + p.className }>
            { this.renderToolbar() }
            { isEmpty(data) ? notFound : leaf }
        </div>;
    },
    renderToolbar: function() {
        if (this.props.search) {
            return <div className='json-inspector__toolbar'>
                <SearchBar onChange={ this.search } />
            </div>;
        }
    },
    search: function(query) {
        if (query === '' || this.props.validateQuery(query)) {
            this.setState({
                query: query
            });
        }
    },
    componentDidMount: function() {
        this.createFilterer(this.props.data);
    },
    componentWillReceiveProps: function(p) {
        this.createFilterer(p.data);
    },
    shouldComponentUpdate: function (p, s) {
        return s.query !== this.state.query ||
            p.data !== this.props.data ||
            p.onClick !== this.props.onClick;
    },
    createFilterer: function(data) {
        this.setState({
            filterer: filterer(data)
        });
    },
    getOriginal: function(path) {
        return lens(this.props.data, path);
    }
});

module.exports = Inspector;
