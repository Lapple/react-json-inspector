var React = require('react');

var ARRAY_TYPE = 'Array';
var OBJECT_TYPE = 'Object';
var PATH_PREFIX = '.root.';

var Leaf = React.createClass({
    getInitialState: function() {
        var p = this.props;

        return {
            expanded: p.isExpanded(p.data, p.label, p.prefix)
        };
    },
    render: function() {
        var uid = unique();
        var p = this.props;

        var d = {
            path: this.getCurrentPath().substr(PATH_PREFIX.length),
            key: p.label.toString(),
            value: p.data
        };

        return <div className={ 'json-inspector__leaf' + (p.isRoot ? ' json-inspector__leaf_root' : '') } id={ 'leaf-' + this.getCurrentPath() }>
            <input className='json-inspector__radio' type='radio' name={ p.id } id={ uid } />
            <label className='json-inspector__line' htmlFor={ uid } onClick={ this._onClick.bind(this, d) }>
                <div className='json-inspector__flatpath'>
                    { d.path }
                </div>
                <span className='json-inspector__key'>
                    { p.format(d.key) }:
                </span>
                { this.renderTitle() }
            </label>
            { this.renderChildren() }
        </div>;
    },
    renderTitle: function() {
        var data = this.props.data;
        var keyType = type(data);

        switch (keyType) {
            case ARRAY_TYPE:
                return <span className='json-inspector__value json-inspector__value_helper'>
                    { '[] ' + items(data.length) }
                </span>;
            case OBJECT_TYPE:
                return <span className='json-inspector__value json-inspector__value_helper'>
                    { '{} ' + items(Object.keys(data).length) }
                </span>;
            default:
                return <span className={ 'json-inspector__value json-inspector__value_' + keyType.toLowerCase() }>
                    { this.props.format(String(data)) }
                </span>;
        }
    },
    renderChildren: function() {
        var p = this.props;
        var childPrefix = this.getCurrentPath();

        if (!this.state.expanded) {
            return null;
        }

        switch (type(p.data)) {
            case ARRAY_TYPE:
                return p.data.map(function(value, index) {
                    return leaf({
                        data: value,
                        label: index,
                        prefix: childPrefix,
                        isExpanded: p.isExpanded,
                        onClick: p.onClick,
                        format: p.format,
                        id: p.id,
                        key: index
                    });
                });
            case OBJECT_TYPE:
                return Object.keys(p.data).map(function(key) {
                    return leaf({
                        data: p.data[key],
                        label: key,
                        prefix: childPrefix,
                        isExpanded: p.isExpanded,
                        onClick: p.onClick,
                        format: p.format,
                        id: p.id,
                        key: key
                    });
                });
            default:
                return null;
        }
    },
    getCurrentPath: function() {
        return this.props.prefix + '.' + this.props.label;
    },
    toggle: function() {
        if (!isPrimitive(this.props.data)) {
            this.setState({ expanded: !this.state.expanded });
        }
    },
    _onClick: function(data, e) {
        this.toggle();
        this.props.onClick(data);

        e.stopPropagation();
    }
});

var leaf = React.createFactory(Leaf);

function type(object) {
    return Object.prototype.toString.call(object).slice(8, -1);
}

function isPrimitive(object) {
    var t = type(object);
    return t !== ARRAY_TYPE && t !== OBJECT_TYPE;
}

function items(count) {
    return count + (count === 1 ? ' item' : ' items');
}

function unique() {
    return 'id_' + Date.now() + Math.floor(Math.random() * 100);
}

module.exports = Leaf;
