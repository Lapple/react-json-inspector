var debounce = require('debounce');
var React = require('react');
var input = React.DOM.input;

var noop = require('./noop');

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            timeout: 100,
            onChange: noop
        };
    },
    render: function() {
        return input({
            className: 'json-inspector__search',
            type: 'search',
            placeholder: 'Search',
            ref: 'query',
            onChange: debounce(this.update, this.props.timeout)
        });
    },
    update: function() {
        this.props.onChange(this.refs.query.getDOMNode().value);
    }
});
