var React = require('react');
var createClass = require('create-react-class');


module.exports = createClass({
    getDefaultProps: function() {
        return {
            string: '',
            highlight: '',
            fullKey: '',
            shouldHighlight: null,
            highlightRenderer: null
        };
    },
    shouldComponentUpdate: function(p) {
        return p.highlight !== this.props.highlight ||
          p.shouldHighlight !== this.props.shouldHighlight ||
          p.highlightRenderer !== this.props.highlightRenderer ||
          p.fullKey !== this.props.fullKey;
    },
    render: function() {
        var p = this.props;
        if (p.shouldHighlight) {
            if (!p.shouldHighlight(p.string, p.highlight, p.fullKey)) {
                return React.createElement('span', null, p.string);
            } else {
                if (p.highlightRenderer) {
                    return React.createElement('span', null, p.highlightRenderer(p.string, p.highlight, p.fullKey));
                } else {
                    return React.createElement('span', {className: 'json-inspector__hl'}, p.string)
                }
            }
        }
        else {
            if (!p.highlight || p.string.indexOf(p.highlight) === -1) {
                return React.createElement('span', null, p.string);
            }

            return React.createElement('span', null,
              p.string.split(p.highlight).map(function (part, index) {
                  return React.createElement('span', {key: index},
                    index > 0 ?
                      React.createElement('span', {className: 'json-inspector__hl'}, p.highlight) :
                      null,
                    part);
              }));
        }
    }
});
