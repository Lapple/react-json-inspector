var React = require('react');
var PropTypes = require('prop-types');
var D = React.DOM;

var Leaf = require('./lib/leaf');
var leaf = React.createFactory(Leaf);
var SearchBar = require('./lib/search-bar');
var searchBar = React.createFactory(SearchBar);

var filterer = require('./lib/filterer');
var isEmpty = require('./lib/is-empty');
var lens = require('./lib/lens');
var noop = require('./lib/noop');

class JsonInspector extends React.Component {

    constructor(props)  {
        super(props);
        this.state = { query: props.query };
        this.search = this.search.bind( this );
    }

    render() {
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
                        interactiveLabel: p.interactiveLabel
                    })
            )
        );
    }

    renderToolbar() {
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
    };

    search(query) {
        this.setState({
            query: query
        });
    };

    componentWillMount() {
        this.createFilterer(this.props.data, this.props.filterOptions);
    }

    componentWillReceiveProps(p) {
        this.createFilterer(p.data, p.filterOptions);

        var isReceivingNewQuery = (
            typeof p.query === 'string' &&
            p.query !== this.state.query
        );

        if (isReceivingNewQuery) {
            this.setState({
                query: p.query
            });
        }
    }

    shouldComponentUpdate(p, s) {
        return (
            p.query !== this.props.query ||
            s.query !== this.state.query ||
            p.data !== this.props.data ||
            p.onClick !== this.props.onClick
        );
    }

    createFilterer(data, options) {
        this.setState({
            filterer: filterer(data, options)
        });
    };

    getOriginal(path){
        return lens(this.props.data, path);
    };
};

JsonInspector.propTypes = {
    data: PropTypes.any.isRequired,
    // For now it expects a factory function, not element.
    search: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.bool
    ]),
    onClick: PropTypes.func,
    validateQuery: PropTypes.func,
    isExpanded: PropTypes.func,
    filterOptions: PropTypes.object,
    query: PropTypes.string
};

JsonInspector.defaultProps = {
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
    },
    query: ''
};

module.exports = JsonInspector;