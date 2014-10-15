var React = require('react');
var Leaf = require('./components/leaf.jsx');

var Inspector = React.createClass({
    render: function() {
        return <div>
            <Leaf data={ this.props.data } label='root' expanded={ true } />
        </div>;
    }
});

module.exports = Inspector;
