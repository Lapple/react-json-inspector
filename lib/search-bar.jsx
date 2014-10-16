var React = require('react');
var debounce = require('debounce');

var SearchBar = React.createClass({
    getDefaultProps: function() {
        return {
            minlength: 2,
            timeout: 300,
            onChange: function() {}
        };
    },
    render: function() {
        return <input type='text' placeholder='Search' ref='query' onInput={ debounce(this.update, this.props.timeout) } />;
    },
    update: function() {
        var value = this.refs.query.getDOMNode().value;

        if (value.length >= this.props.minlength || value.length === 0) {
            this.props.onChange(value);
        }
    }
});

module.exports = SearchBar;