var React = require('react');
var debounce = require('debounce');

var noop = require('./noop.js');

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
            onChange={ debounce(this.update, this.props.timeout) }
            onKeyUp={ this.onKeyUp } />;
    },
    onKeyUp: function(e) {
        if (e.key === 'Enter') {
            this.props.onEnter();
        }
    },
    update: function() {
        this.props.onChange(this.refs.query.getDOMNode().value);
    }
});

module.exports = SearchBar;