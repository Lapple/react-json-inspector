var React = require('react');
var D = React.DOM;

var uid = require('./uid');
var type = require('./type');
var isFunction = require('./is-function');

var Selection = require('./selection');
var selection = React.createFactory(Selection);
var Highlighter = require('./highlighter');
var highlighter = React.createFactory(Highlighter);

var PATH_PREFIX = '.root.';

var Leaf = React.createClass({
    getInitialState: function() {
        return {
            expanded: this._isInitiallyExpanded()
        };
    },
    getDefaultProps: function() {
        return {
            root: false,
            prefix: ''
        };
    },
    render: function() {
        var id = 'id_' + uid();
        var p = this.props;

        var d = {
            path: this.keypath(),
            key: p.label.toString(),
            value: p.data
        };

        var onLabelClick = this._onClick.bind(this, d);

        return D.div({ className: this.getClassName(), id: 'leaf-' + this._rootPath() },
            D.input({ className: 'json-inspector__radio', type: 'radio', name: p.id, id: id }),
            D.label({ className: 'json-inspector__line', htmlFor: id, onClick: onLabelClick },
                D.div({ className: 'json-inspector__flatpath' },
                    d.path),
                D.span({ className: 'json-inspector__key' },
                    this.format(d.key),
                    ':',
                    selection({ value: d.key })),
                this.renderTitle(),
                this.renderShowOriginalButton()),
            this.renderChildren());
    },
    renderTitle: function() {
        var data = this.data();
        var t = type(data);

        switch (t) {
            case 'Array':
                return D.span({ className: 'json-inspector__value json-inspector__value_helper' },
                    '[] ' + items(data.length));
            case 'Object':
                return D.span({ className: 'json-inspector__value json-inspector__value_helper' },
                    '{} ' + items(Object.keys(data).length));
            default:
                return D.span({ className: 'json-inspector__value json-inspector__value_' + t.toLowerCase() },
                    this.format(String(data)),
                    selection({ value: String(data) }));
        }
    },
    renderChildren: function() {
        var p = this.props;
        var childPrefix = this._rootPath();
        var data = this.data();

        if (this.state.expanded && !isPrimitive(data)) {
            return Object.keys(data).map(function(key) {
                return leaf({
                    data: data[key],
                    label: key,
                    prefix: childPrefix,
                    onClick: p.onClick,
                    id: p.id,
                    query: p.query,
                    getOriginal: this.state.original ? null : p.getOriginal,
                    key: key,
                    isExpanded: p.isExpanded
                });
            }, this);
        }

        return null;
    },
    renderShowOriginalButton: function() {
        var p = this.props;

        if (isPrimitive(p.data) || this.state.original || !p.getOriginal || !p.query || contains(this.keypath(), p.query)) {
            return null;
        }

        return D.span({
            className: 'json-inspector__show-original',
            onClick: this._onShowOriginalClick
        });
    },
    componentWillReceiveProps: function(p) {
        if (p.query) {
            this.setState({
                expanded: !contains(p.label, p.query)
            });
        } else if (!p.root) {
            this.setState({
                expanded: false
            });
        }
    },
    _rootPath: function() {
        return this.props.prefix + '.' + this.props.label;
    },
    keypath: function() {
        return this._rootPath().substr(PATH_PREFIX.length);
    },
    data: function() {
        return this.state.original || this.props.data;
    },
    format: function(string) {
        return highlighter({
            string: string,
            highlight: this.props.query
        });
    },
    getClassName: function() {
        var cn = 'json-inspector__leaf';

        if (this.props.root) {
            cn += ' json-inspector__leaf_root';
        }

        if (this.state.expanded) {
            cn += ' json-inspector__leaf_expanded';
        }

        if (!isPrimitive(this.props.data)) {
            cn += ' json-inspector__leaf_composite';
        }

        return cn;
    },
    toggle: function() {
        this.setState({
            expanded: !this.state.expanded
        });
    },
    _onClick: function(data, e) {
        this.toggle();
        this.props.onClick(data);

        e.stopPropagation();
    },
    _onShowOriginalClick: function(e) {
        this.setState({
            original: this.props.getOriginal(this.keypath())
        });

        e.stopPropagation();
    },
    _isInitiallyExpanded: function() {
        var p = this.props;
        var keypath = this.keypath();

        if (p.root) {
            return true;
        }

        if (p.query === '') {
            return p.isExpanded(keypath, p.data);
        } else {
            // When a search query is specified, first check if the keypath
            // contains the search query: if it does, then the current leaf
            // is itself a search result and there is no need to expand further.
            //
            // Having a `getOriginal` function passed signalizes that current
            // leaf only displays a subset of data, thus should be rendered
            // expanded to reveal the children that is being searched for.
            return !contains(keypath, p.query) && isFunction(p.getOriginal);
        }
    }
});

// FIXME: There should be a better way to call a component factory from inside
// component definition.
var leaf = React.createFactory(Leaf);

function items(count) {
    return count + (count === 1 ? ' item' : ' items');
}

function contains(string, substring) {
    return string.indexOf(substring) !== -1;
}

function isPrimitive(value) {
    var t = type(value);
    return t !== 'Object' && t !== 'Array';
}

module.exports = Leaf;
