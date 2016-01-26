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
        data: React.PropTypes.any.isRequired,
        // For now it expects a factory function, not element.
        search: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.bool
        ]),
        onClick: React.PropTypes.func,
        validateQuery: React.PropTypes.func,
        isExpanded: React.PropTypes.func,
        filterOptions: React.PropTypes.object,
        query: React.PropTypes.string,
        filterFunc: React.PropTypes.func,
        shouldHighlight: React.PropTypes.func
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
            query: this.props.query || ''
        };
    },
    render: function() {
        var p = this.props;
        var s = this.state;

        var isQueryValid = (
          s.query !== '' &&
          p.validateQuery(s.query)
        );

        var data = (
          isQueryValid ?
            s.filterer(s.query) :
            p.data
        );

        var isNotFound = (
          isQueryValid &&
          isEmpty(data)
        );

        return D.div({ className: 'json-inspector ' + p.className },
          this.renderToolbar(),
          (
            isNotFound ?
              D.div({ className: 'json-inspector__not-found' }, 'Nothing found') :
              leaf({
                  data: data,
                  onClick: p.onClick,
                  id: p.id,
                  getOriginal: this.getOriginal,
                  query: (
                    isQueryValid ?
                      s.query :
                      null
                  ),
                  label: 'root',
                  root: true,
                  isExpanded: p.isExpanded,
                  interactiveLabel: p.interactiveLabel,
                  shouldHighlight: p.shouldHighlight,
              })
          )
        );
    },
    renderToolbar: function() {
        var search = this.props.search;

        if (search) {
            return D.div({ className: 'json-inspector__toolbar' },
              search({
                  onChange: this.search,
                  data: this.props.data,
                  query: this.state.query
              })
            );
        }
    },
    search: function(query) {
        this.setState({
            query: query
        });
    },
    componentWillMount: function() {
        this.createFilterer(this.props.data, this.props.filterOptions, this.props.filterFunc);
    },
    componentWillReceiveProps: function(p) {
        this.createFilterer(p.data, p.filterOptions, p.filterFunc);
    },
    shouldComponentUpdate: function (p, s) {
        return (
          p.filterFunc !== this.props.filterFunc ||
          s.query !== this.state.query ||
          p.data !== this.props.data ||
          p.onClick !== this.props.onClick
        );
    },
    getFilterer: function(pFilterFunc) {
        var filterFunc = pFilterFunc;
        if (!filterFunc) {
            filterFunc = filterer
        }
        return filterFunc;
    },
    createFilterer: function(data, options, filterFunc) {
        var f = this.getFilterer(filterFunc);
        this.setState({
            filterer: f(data, options)
        });
    },
    getOriginal: function(path) {
        return lens(this.props.data, path);
    }
});
