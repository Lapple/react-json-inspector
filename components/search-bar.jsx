var React = require('react');

var SearchBar = React.createClass({
    getDefaultProps: function() {
        return {
            minlength: 3,
            onChange: function() {}
        };
    },
    render: function() {
        return <input type='text' placeholder='Search' ref='query' onInput={ this.update } />;
    },
    // TODO: Throttle
    update: function() {
        var value = this.refs.query.getDOMNode().value;

        if (value.length >= this.props.minlength || value.length === 0) {
            this.props.onChange(value);
        }
    }
});

module.exports = SearchBar;