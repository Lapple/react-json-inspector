var React = require('react');

var ARRAY_TYPE = 'Array';
var OBJECT_TYPE = 'Object';

var Leaf = React.createClass({
    getInitialState: function() {
        var p = this.props;

        return {
            expanded: p.isExpanded(p.data, p.label, p.prefix)
        };
    },
    render: function() {
        return <div className='json-inspector__leaf' id={ 'leaf-' + this.getCurrentPath() }>
            <span className='json-inspector__key' onClick={ this.toggle }>
                { this.props.format(this.props.label.toString()) }:
            </span>
            { this.renderTitle() }
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
                    return Leaf({
                        data: value,
                        label: index,
                        prefix: childPrefix,
                        isExpanded: p.isExpanded,
                        format: p.format,
                        key: index
                    });
                });
            case OBJECT_TYPE:
                return Object.keys(p.data).map(function(key) {
                    return Leaf({
                        data: p.data[key],
                        label: key,
                        prefix: childPrefix,
                        isExpanded: p.isExpanded,
                        format: p.format,
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
    }
});

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

module.exports = Leaf;
