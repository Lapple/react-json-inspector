var React = require('react');

var Inspector = require('..');
var inspector = React.createFactory(Inspector);
var InteractiveSelection = require('./interactive-selection');
var interactiveSelection = React.createFactory(InteractiveSelection);

var data = require('./data.json');

document.addEventListener('DOMContentLoaded', function() {
    React.render(
        inspector({
            data: data,
            onClick: console.log.bind(console),
            interactiveLabel: interactiveSelection
        }),
        document.getElementById('inspector')
    );
});
