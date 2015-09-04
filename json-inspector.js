var React = require('react');
var D = React.DOM;

var Leaf = require('./lib/leaf');
var leaf = React.createFactory(Leaf);
var SearchBar = require('./lib/search-bar');
var searchBar = React.createFactory(SearchBar);

var filterer = require('./lib/filterer');
var isEmpty = require('./lib/is-empty');
var lens = require('./lib/lens');
var noop = require('./lib/noop');

module.exports = React.createClass({
    propTypes: {
        data: React.PropTypes.oneOfType([
            React.PropTypes.object.isRequired,
            React.PropTypes.array.isRequired
        ]),
        // For now it expects a factory function, not element.
        search: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.bool
        ]),
        onClick: React.PropTypes.func,
        validateQuery: React.PropTypes.func,
        isExpanded: React.PropTypes.func,
        filterOptions: React.PropTypes.object
    },

    getDefaultProps: function() {
        return {
            data: null,
            search: searchBar,
            className: '',
            id: 'json-' + Date.now(),
            onClick: noop,
            filterOptions: {},
            validateQuery: function(query) {
                return query.length >= 2;
            },
            /**
             * Decide whether the leaf node at given `keypath` should be
             * expanded initially.
             * @param  {String} keypath
             * @param  {Any} value
             * @return {Boolean}
             */
            isExpanded: function(keypath, value) {
                return false;
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

        var rootNode = leaf({
            data: data,
            onClick: p.onClick,
            id: p.id,
            getOriginal: this.getOriginal,
            query: s.query,
            label: 'root',
            root: true,
            isExpanded: p.isExpanded,
            interactiveLabel: p.interactiveLabel
        });

        var notFound = D.div({ className: 'json-inspector__not-found' }, 'Nothing found');

        return D.div({ className: 'json-inspector ' + p.className },
            this.renderToolbar(),
            isEmpty(data) ? notFound : rootNode);
    },
    renderToolbar: function() {
        var search = this.props.search;

        if (search) {
            return D.div({ className: 'json-inspector__toolbar' },
                search({ onChange: this.search, data: this.props.data }));
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
        this.createFilterer(this.props.data, this.props.filterOptions);
    },
    componentWillReceiveProps: function(p) {
        this.createFilterer(p.data, p.filterOptions);
    },
    shouldComponentUpdate: function (p, s) {
        return s.query !== this.state.query ||
            p.data !== this.props.data ||
            p.onClick !== this.props.onClick;
    },
    createFilterer: function(data, options) {
        this.setState({
            filterer: filterer(data, options)
        });
    },
    getOriginal: function(path) {
        return lens(this.props.data, path);
    }
});
