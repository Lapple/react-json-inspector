var React = require('react');
var D = React.DOM;

var uid = require('./uid');
var type = require('./type');

var Selection = require('./selection');
var selection = React.createFactory(Selection);
var Highlighter = require('./highlighter');
var highlighter = React.createFactory(Highlighter);

var PATH_PREFIX = '.root.';

var Leaf = React.createClass({
    getInitialState: function() {
        var p = this.props;

        return {
            expanded: (p.query && !contains(this.path(), p.query) && p.getOriginal) || p.isRoot
        };
    },
    getDefaultProps: function() {
        return {
            isRoot: false,
            prefix: ''
        };
    },
    render: function() {
        var id = 'id_' + uid();
        var p = this.props;

        var d = {
            path: this.path().substr(PATH_PREFIX.length),
            key: p.label.toString(),
            value: p.data
        };

        var onLabelClick = this._onClick.bind(this, d);

        return D.div({ className: this.getClassName(), id: 'leaf-' + this.path() },
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
        var childPrefix = this.path();
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
                });
            }, this);
        }
    },
    renderShowOriginalButton: function() {
        var p = this.props;

        if (isPrimitive(p.data) || this.state.original || !p.getOriginal || !p.query || contains(this.path(), p.query)) {
            return;
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
        } else if (!p.isRoot) {
            this.setState({
                expanded: false
            });
        }
    },
    path: function() {
        return this.props.prefix + '.' + this.props.label;
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

        if (this.props.isRoot) {
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
            original: this.props.getOriginal(this.path().substr(PATH_PREFIX.length))
        });

        e.stopPropagation();
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
