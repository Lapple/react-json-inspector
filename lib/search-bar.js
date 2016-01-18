var debounce = require('debounce');
var React = require('react');
var input = React.DOM.input;

var noop = require('./noop');

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            onChange: noop
        };
    },
    render: function() {
        return input({
            className: 'json-inspector__search',
            type: 'search',
            placeholder: 'Search',
            value: this.props.query,
            onChange: this.onChange
        });
    },
    onChange: function(e) {
        this.props.onChange(e.target.value);
    }
});
