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
        var p = this.props,
            highlightStart = p.string.search(p.highlight);

        if (!p.highlight || highlightStart === -1) {
            return span(null, p.string);
        }
        var highlightLength = p.highlight.source.length,
            highlightString = p.string.substr(highlightStart, highlightLength);
        return span(null,
            p.string.split(p.highlight).map(function(part, index) {
                return span({ key: index },
                    index > 0 ?
                        span({ className: 'json-inspector__hl' }, highlightString) :
                        null,
                    part);
            }));
    }
});
