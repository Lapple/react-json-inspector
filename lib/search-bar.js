var debounce = require('debounce');
var React = require('react');
var createClass = require('create-react-class');
var input = React.createElement('input');

var noop = require('./noop');

module.exports = createClass({
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
