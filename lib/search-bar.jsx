var React = require('react');
var debounce = require('debounce');

var noop = require('./noop.js');

var SearchBar = React.createClass({
    getDefaultProps: function() {
        return {
            timeout: 200,
            onChange: noop
        };
    },
    render: function() {
        return <input
            className='json-inspector__search'
            type='search'
            placeholder='Search'
            ref='query'
            onChange={ debounce(this.update, this.props.timeout) } />;
    },
    update: function() {
        this.props.onChange(this.refs.query.getDOMNode().value);
    }
});

module.exports = SearchBar;
