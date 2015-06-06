var React = require('react');
var span = React.DOM.span;

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            string: '',
            highlight: ''
        };
    },
    shouldComponentUpdate: function(p) {
        return p.highlight !== this.props.highlight;
    },
    render: function() {
        var p = this.props;

        if (!p.highlight || p.string.indexOf(p.highlight) === -1) {
            return span(null, p.string);
        }

        return span(null,
            p.string.split(p.highlight).map(function(part, index) {
                return span({ key: index },
                    index > 0 ?
                        span({ className: 'json-inspector__hl' }, p.highlight) :
                        null,
                    part);
            }));
    }
});
