var React = require('react');

var uid = require('./uid.js');
var type = require('./type.js');
var Highlighter = require('./highlighter.js');

var PATH_PREFIX = '.root.';

var Leaf = React.createClass({
    getInitialState: function() {
        var p = this.props;

        return {
            expanded: (p.query && !contains(p.label, p.query)) || p.isRoot
        }
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

        return <div className={ this.rootClassName() } id={ 'leaf-' + this.path() }>
            <input className='json-inspector__radio' type='radio' name={ p.id } id={ id } />
            <label className='json-inspector__line' htmlFor={ id } onClick={ this._onClick.bind(this, d) }>
                <div className='json-inspector__flatpath'>
                    { d.path }
                </div>
                <span className='json-inspector__key'>
                    { this.format(d.key) }:
                </span>
                { this.renderTitle() }
            </label>
            { this.renderChildren() }
        </div>;
    },
    renderTitle: function() {
        var data = this.props.data;
        var t = type(data);

        switch (t) {
            case 'Array':
                return <span className='json-inspector__value json-inspector__value_helper'>
                    { '[] ' + items(data.length) }
                </span>;
            case 'Object':
                return <span className='json-inspector__value json-inspector__value_helper'>
                    { '{} ' + items(Object.keys(data).length) }
                </span>;
            default:
                return <span className={ 'json-inspector__value json-inspector__value_' + t.toLowerCase() }>
                    { this.format(String(data)) }
                </span>;
        }
    },
    renderChildren: function() {
        var p = this.props;
        var childPrefix = this.path();

        if (this.state.expanded && !isPrimitive(p.data)) {
            return Object.keys(p.data).map(function(key) {
                return <Leaf
                    data={ p.data[key] }
                    label={ key }
                    prefix={ childPrefix }
                    onClick={ p.onClick }
                    id={ p.id }
                    query={ p.query }
                    key={ key } />;
            });
        }
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
    format: function(string) {
        return <Highlighter string={ string } highlight={ this.props.query } />;
    },
    rootClassName: function() {
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
    }
});

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
