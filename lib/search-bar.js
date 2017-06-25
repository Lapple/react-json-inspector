var debounce = require('debounce');
var React = require('react');
var createReactClass = require('create-react-class');

var h = React.createElement;
var noop = require('./noop');

module.exports = createReactClass({
    getDefaultProps: function() {
        return {
            onChange: noop
        };
    },
    render: function() {
        return h('input', {
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
