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
        return <div style={ { paddingLeft: '10px' } }>
            <div onClick={ this.toggle }>
                { this.props.format(this.props.label.toString()) }:
                { this.renderTitle() }
            </div>
            { this.renderChildren() }
        </div>;
    },
    renderTitle: function() {
        var data = this.props.data;

        switch (type(data)) {
            case ARRAY_TYPE:
                return '[] ' + data.length;
            case OBJECT_TYPE:
                return '{} ' + Object.keys(data).length;
            default:
                return this.props.format(data.toString());
        }
    },
    renderChildren: function() {
        var p = this.props;
        var childPrefix = p.prefix + '.' + p.label;

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

module.exports = Leaf;
