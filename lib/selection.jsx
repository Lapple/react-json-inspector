var React = require('react');

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            value: ''
        };
    },
    render: function() {
        return <input
            className='json-inspector__selection'
            value={ this.props.value }
            size={ Math.max(1, this.props.value.length - 1) }
            tabIndex='-1'
            spellCheck='false'
            onClick={ this.onClick }
            onChange={ this.onChange } />;
    },
    onChange: function() {},
    onClick: function(e) {
        e.stopPropagation();
    }
});
