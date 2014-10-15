var React = require('react');

var Leaf = React.createClass({
    getInitialState: function() {
        return {
            expanded: !!this.props.expanded
        };
    },
    render: function() {
        return <div style={ { paddingLeft: '10px' } }>
            <div onClick={ this.toggle }>
                { this.props.label }:
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
                return String(data);
        }
    },
    renderChildren: function() {
        var data = this.props.data;

        if (!this.state.expanded) {
            return null;
        }

        switch (type(data)) {
            case 'Array':
                return data.map(function(value, index) {
                    return <Leaf data={ value } label={ index } />;
                });
            case 'Object':
                return Object.keys(data).map(function(key) {
                    return <Leaf data={ data[key] } label={ key } />;
                });
            default:
                return null;
        }
    },
    toggle: function() {
        this.setState({ expanded: !this.state.expanded });
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
