var React = require('react');
var PropTypes = require('prop-types');
var createClass = require('create-react-class');

var Leaf = require('./lib/leaf');
var leaf = React.createFactory(Leaf);
var SearchBar = require('./lib/search-bar');
var searchBar = React.createFactory(SearchBar);

var filterer = require('./lib/filterer');
var isEmpty = require('./lib/is-empty');
var lens = require('./lib/lens');
var noop = require('./lib/noop');

module.exports = createClass({
  propTypes: {
    data: PropTypes.any.isRequired,
    // For now it expects a factory function, not element.
    search: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.bool
    ]),
    onClick: PropTypes.func,
    validateQuery: PropTypes.func,
    isExpanded: PropTypes.func,
    isRootCollapsed: PropTypes.bool,
    filterOptions: PropTypes.object,
    query: PropTypes.string,
    filterFunc: PropTypes.func,
    shouldHighlight: PropTypes.func,
    highlightRenderer: PropTypes.func
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
        return query !== null && query !== undefined;
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
      },
      highlightRenderer: null
    };
  },
  render: function() {
    var p = this.props;
    var s = this.state;

    var isQueryValid = (
      p.query !== '' &&
      p.validateQuery(p.query)
    );

    var data = (
      isQueryValid ?
        s.filterer(p.query) :
        p.data
    );

    var isNotFound = (
      isQueryValid &&
      isEmpty(data)
    );

    return React.createElement('div', { className: 'json-inspector ' + p.className },
      this.renderToolbar(),
      (
        isNotFound ?
          React.createElement('div', { className: 'json-inspector__not-found' }, 'Nothing found') :
          leaf({
            data: data,
            onClick: p.onClick,
            id: p.id,
            getOriginal: this.getOriginal,
            query: (
              isQueryValid ?
                p.query :
                null
            ),
            label: 'root',
            root: true,
            isRootCollapsed: p.isRootCollapsed,
            isExpanded: p.isExpanded,
            interactiveLabel: p.interactiveLabel,
            shouldHighlight: p.shouldHighlight,
            highlightRenderer: p.highlightRenderer,
          })
      )
    );
  },
  renderToolbar: function() {
    var search = this.props.search;

    if (search) {
      return React.createElement('div', { className: 'json-inspector__toolbar' },
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
    this.setState({query: p.query});
  },
  shouldComponentUpdate: function (p, s) {
    return (
      p.filterFunc !== this.props.filterFunc ||
      p.query !== this.props.query ||
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
