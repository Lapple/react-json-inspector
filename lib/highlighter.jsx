var React = require('react');

var Highlighter = React.createClass({
    getDefaultProps: function() {
        return {
            string: '',
            query: ''
        };
    },
    render: function() {
        var p = this.props;

        if (!p.query || p.string.indexOf(p.query) === -1) {
            return <span>{ p.string }</span>;
        }

        return <span>
            {
                p.string.split(p.query).map(function(part, index) {
                    return <span key={ index }>
                        { index !== 0 ? <span style={ { background: '#ff0' } }>{ p.query }</span> : null }
                        { part }
                    </span>;
                })
            }
        </span>;
    }
});

module.exports = Highlighter;
