var React = require('react');
var debounce = require('debounce');

var noop = function() {};

var SearchBar = React.createClass({
    getDefaultProps: function() {
        return {
            minlength: 2,
            timeout: 300,
            onChange: noop,
            onEnter: noop
        };
    },
    render: function() {
        return <input
            className='json-inspector__search'
            type='text'
            placeholder='Search'
            ref='query'
            onInput={ debounce(this.update, this.props.timeout) }
            onKeyUp={ this.onKeyUp } />;
    },
    onKeyUp: function(e) {
        if (e.keyCode === 13) {
            this.props.onEnter();
        }
    },
    update: function() {
        var value = this.refs.query.getDOMNode().value;

        if (value.length >= this.props.minlength || value.length === 0) {
            this.props.onChange(value);
        }
    }
});

module.exports = SearchBar;