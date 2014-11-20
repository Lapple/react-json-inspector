var React = require('react');
var debounce = require('debounce');

var noop = function() {};

var SearchBar = React.createClass({
    getDefaultProps: function() {
        return {
            timeout: 300,
            onChange: noop,
            onEnter: noop
        };
    },
    render: function() {
        return <input
            className='json-inspector__search'
            type='search'
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
        var query = this.refs.query.getDOMNode().value;

        if (this.props.validateQuery(query) || query.length === 0) {
            this.props.onChange(query);
        }
    }
});

module.exports = SearchBar;