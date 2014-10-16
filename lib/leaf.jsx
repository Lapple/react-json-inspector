var React = require('react');

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
                { this.props.formatter(this.props.label.toString()) }:
                { this.renderTitle() }
            </div>
            { this.renderChildren() }
        </div>;
    },
    renderTitle: function() {
        var data = this.props.data;

        switch (type(data)) {
            case 'Array':
                return '[] ' + data.length;
            case 'Object':
                return '{} ' + Object.keys(data).length;
            default:
                return this.props.formatter(data.toString());
        }
    },
    renderChildren: function() {
        var p = this.props;
        var childPrefix = p.prefix + '.' + p.label;

        if (!this.state.expanded) {
            return null;
        }

        switch (type(p.data)) {
            case 'Array':
                return p.data.map(function(value, index) {
                    return <Leaf data={ value } label={ index } prefix={ childPrefix } isExpanded={ p.isExpanded } formatter={ p.formatter } key={ index } />;
                });
            case 'Object':
                return Object.keys(p.data).map(function(key) {
                    return <Leaf data={ p.data[key] } label={ key } prefix={ childPrefix } isExpanded={ p.isExpanded } formatter={ p.formatter } key={ key } />;
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
    return t !== 'Array' && t !== 'Object';
}

module.exports = Leaf;
